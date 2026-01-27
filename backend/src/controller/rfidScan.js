import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";
import { startOfDay } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const rfidScan = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }
    const employee = await Employee.findOne({ uid });
    if (!employee) {
      emitSocketEvent("uid-detected", {
        uid,
        message: `uid: ${uid} is not registered`,
      });
      return res
        .status(404)
        .json({ message: "Employee not found, Please Register!!!" });
    }

    const nowUtc = new Date();
    const nowJakarta = utcToZonedTime(nowUtc, "Asia/Jakarta");

    const attendanceDate = zonedTimeToUtc(
      startOfDay(nowJakarta),
      "Asia/Jakarta",
    );

    const existingEmployee = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    const onTimeHour = 7;
    const onTimeMinute = 0;

    let status =
      nowJakarta.getHours() < onTimeHour ||
      (nowJakarta.getHours() === onTimeHour &&
        nowJakarta.getMinutes() <= onTimeMinute)
        ? "On-Time"
        : "Late";

    if (!existingEmployee) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const onTimeHour = 7;
      const onTimeMinute = 0;

      let status;
      if (
        currentHour < onTimeHour ||
        (currentHour === onTimeHour && currentMinute <= onTimeMinute)
      ) {
        status = "On-Time";
      } else {
        status = "Late";
      }

      const newEntry = new TodaysAttendance({
        uid: employee.uid,
        name: employee.name,
        picture: employee.picture,
        empId: employee.empId,
        department: employee.department,
        role: employee.role,
        date: attendanceDate,
        clockIn: nowUtc,
        clockOut: null,
        status: status,
      });

      await newEntry.save();
      emitSocketEvent("attendance-recorded", newEntry);
      console.log(
        `Clock in : ${employee.name}, ${employee.empId} at ${newEntry.clockIn} - ${status}`,
      );
      return res.status(201).json({
        message: "Attendance recorded successfully",
        attendance: newEntry,
      });
    } else {
      if (existingEmployee.clockOut) {
        return res
          .status(400)
          .json({ message: "You have already checked out today" });
      } else {
        existingEmployee.clockOut = today;
        await existingEmployee.save();
        emitSocketEvent("attendance-updated", existingEmployee);
        console.log(
          `Clock out : ${employee.name}, ${employee.empId} at ${existingEmployee.clockOut}`,
        );
        return res.status(200).json({
          message: "Check Out successfully",
          attendance: existingEmployee,
        });
      }
    }
  } catch (error) {
    console.error("[ERROR RFID SCAN]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
