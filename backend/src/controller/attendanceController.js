import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";
import { startOfDay } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const attendance = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: "Uid is required" });
    }
    const employee = await Employee.findOne({ uid });
    if (!employee) {
      emitSocketEvent("unregistered-card-error", {
        uid,
        message: "This card is not registered to any employee.",
      });
      return res
        .status(404)
        .json({ message: "Employee not found, please Register!!!" });
    }

    const nowUTC = new Date();
    const nowJakarta = utcToZonedTime(nowUTC, "Asia/Jakarta");

    const attendanceDate = zonedTimeToUtc(
      startOfDay(nowJakarta),
      "Asia/Jakarta",
    );

    const existingEmployee = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    const onTimeHour = 7;
    const onTimeMinute = 30;

    let status =
      nowJakarta.getHours() < onTimeHour ||
      (nowJakarta.getHours() === onTimeHour &&
        nowJakarta.getMinutes() <= onTimeMinute)
        ? "On-Time"
        : "Late";

    if (!existingEmployee) {
      const newAttendance = new TodaysAttendance({
        uid: employee.uid,
        name: employee.name,
        picture: employee.picture,
        empId: employee.empId,
        department: employee.department,
        role: employee.role,
        date: attendanceDate,
        clockIn: nowUTC,
        clockOut: null,
        status: status,
      });
      await newAttendance.save();
      emitSocketEvent("attendance-recorded", newAttendance);

      return res.status(201).json({
        message: "Attendance recorded successfully",
        attendance: newAttendance,
      });
    } else {
      if (existingEmployee.clockOut) {
        return res
          .status(400)
          .json({ message: "You have already checked in today" });
      } else {
        existingEmployee.clockOut = now;
        await existingEmployee.save();
        emitSocketEvent("attendance-updated", existingEmployee);

        return res.status(200).json({
          message: "Check Out succesfully",
          attendance: existingEmployee,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAttendanceEmployee = async (req, res) => {
  try {
    const { uid, name, empId } = req.query;

    if (!uid && !name && !empId) {
      return res.status(400).json({
        error:
          "Bad Request: At least one query parameter (uid, name, or empId) is required.",
      });
    }
    const filter = {};
    if (uid) filter.uid = uid;
    if (name) filter.name = name;
    if (empId) filter.empId = empId;

    const employee = await TodaysAttendance.findOne({
      ...filter,
      date: { $gte: start, $lte: end },
    }).sort({ clockIn: -1 });

    if (employee) {
      return res.status(200).json({ exists: true, employee });
    } else {
      return res.status(404).json({
        exists: false,
        employee: null,
        message: "Employee attendance not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTodaysAttendance = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todaysAttendance = await TodaysAttendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ clockIn: 1 });
    res.status(200).json({
      message: "Today's attendance fetched successfully",
      attendance: todaysAttendance,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRecord = await TodaysAttendance.findByIdAndDelete(id);
    if (!deleteRecord) {
      return res.status(404).json({ message: "Data not Found" });
    }
    emitSocketEvent("attendance-deleted", { id });
    return res.status(200).json({ message: "Data delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const checkIn = async (req, res) => {
  try {
    console.log("request body", req.body);
    const { empId } = req.body;
    if (!empId) {
      return res.status(400).json({ message: "Please select employee" });
    }
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existingAttendance = await TodaysAttendance.findOne({
      empId,
      date: { $gte: start, $lte: end },
    });
    if (!existingAttendance) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const onTimeHour = 7;
      const onTimeMinute = 30;

      let status;
      if (
        currentHour < onTimeHour ||
        (currentHour === onTimeHour && currentMinute <= onTimeMinute)
      ) {
        status = "On-Time";
      } else {
        status = "Late";
      }
      const newAttendance = new TodaysAttendance({
        uid: employee.uid,
        name: employee.name,
        picture: employee.picture,
        empId: employee.empId,
        department: employee.department,
        role: employee.role,
        date: now,
        clockIn: now,
        clockOut: null,
        status: status,
      });
      await newAttendance.save();
      emitSocketEvent("attendance-recorded", newAttendance);
      console.log(
        `Clock in : ${employee.name}, ${employee.empId} at ${newAttendance.clockIn} - ${status}`,
      );

      return res.status(201).json({
        message: "Attendance recorded successfully",
        attendance: newAttendance,
      });
    } else {
      return res.status(400).json({
        message: "Employee has already checked in today",
        attendance: existingAttendance,
      });
    }
  } catch (error) {
    console.error("[ERROR MANUAL CHECK-IN]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { empId } = req.body;
    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existingAttendance = await TodaysAttendance.findOne({
      empId,
      date: { $gte: start, $lte: end },
    });

    if (!existingAttendance) {
      return res.status(404).json({
        message: "Check-in record not found for today. Cannot check out.",
      });
    }

    if (existingAttendance.clockOut) {
      return res
        .status(400)
        .json({ message: "Employee has already checked out" });
    }

    existingAttendance.clockOut = new Date();
    await existingAttendance.save();
    emitSocketEvent("attendance-updated", existingAttendance); // Kirim event ke frontend

    return res.status(200).json({
      message: "Check-out successful",
      attendance: existingAttendance,
    });
  } catch (error) {
    console.error("[ERROR MANUAL CHECK-OUT]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markStatus = async (req, res) => {
  try {
    console.log("cek status :", req.body);

    const { empId, status } = req.body;
    if (!empId || !status) {
      return res
        .status(400)
        .json({ message: "Employee ID and status are required" });
    }

    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existingAttendance = await TodaysAttendance.findOne({
      empId,
      date: { $gte: start, $lte: end },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: `Employee already has an attendance record for today (${existingAttendance.status}).`,
      });
    }

    const newAttendance = new TodaysAttendance({
      uid: employee.uid,
      name: employee.name,
      picture: employee.picture,
      empId: employee.empId,
      department: employee.department,
      role: employee.role,
      date: new Date(),
      status: status,
      clockIn: null,
      clockOut: null,
    });

    await newAttendance.save();
    emitSocketEvent("attendance-recorded", newAttendance);

    return res.status(201).json({
      message: `Status for ${employee.name} marked as ${status}`,
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("[ERROR MARKING STATUS]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getManualAttend = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res
        .status(400)
        .json({ message: "Query parameter 'type' is required" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let employees = [];
    if (type === "not-checkedIn") {
      const todaysAttendance = await TodaysAttendance.find({
        date: {
          $gte: start,
          $lte: end,
        },
      });
      const attendEmpIds = todaysAttendance.map((a) => a.empId);
      employees = await Employee.find({
        empId: { $nin: attendEmpIds },
      })
        .sort({ name: 1 })
        .select("name empId picture");
    } else if (type === "not-checkedOut") {
      const notCheckedOut = await TodaysAttendance.find({
        date: { $gte: start, $lte: end },
        clockIn: { $ne: null },
        clockOut: null,
      }).select("empId");

      const notCheckedOutIds = notCheckedOut.map((a) => a.empId);
      employees = await Employee.find({
        empId: { $in: notCheckedOutIds },
      })
        .sort({ name: 1 })
        .select("name empId picture");
    } else {
      return res.status(400).json({
        message:
          "Invalid type. Use 'not-checkIn' or 'not-checkedout' as query parameter.",
      });
    }

    return res.status(200).json({
      type,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error(
      `Error fetching manual attendance data for type '${type}':`,
      error.message,
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
