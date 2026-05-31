import {
  getAttendanceDate,
  getAttendanceStatus,
  getWibDayRange,
  getWibTime,
} from "../config/time.js";
import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";

const isDuplicateKeyError = (error) => error?.code === 11000;

export const attendance = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: "Uid is required" });

    const employee = await Employee.findOne({ uid });
    if (!employee) {
      emitSocketEvent("unregistered-card-error", { uid });
      return res.status(404).json({ message: "Employee not found" });
    }

    const { nowUtc, nowJakarta } = getWibTime();
    const attendanceDate = getAttendanceDate(nowJakarta);

    const existing = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    if (!existing) {
      const status = getAttendanceStatus(nowJakarta);

      try {
        const record = await TodaysAttendance.create({
          uid: employee.uid,
          name: employee.name,
          picture: employee.picture,
          empId: employee.empId,
          department: employee.department,
          role: employee.role,
          date: attendanceDate,
          clockIn: nowUtc,
          clockOut: null,
          status,
        });

        emitSocketEvent("attendance-recorded", record);
        return res.status(201).json({ attendance: record });
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          return res.status(409).json({
            message: "Attendance already recorded for today",
          });
        }
        throw error;
      }
    }

    if (existing.clockOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    existing.clockOut = nowUtc;
    await existing.save();
    emitSocketEvent("attendance-updated", existing);

    return res.status(200).json({ attendance: existing });
  } catch (err) {
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

    const { nowJakarta } = getWibTime();
    const { start, end } = getWibDayRange(nowJakarta);

    const employee = await TodaysAttendance.findOne({
      ...filter,
      date: { $gte: start, $lte: end },
    }).sort({ clockIn: -1 });

    if (employee) {
      return res.status(200).json({ exists: true, employee });
    }
    return res.status(404).json({
      exists: false,
      employee: null,
      message: "Employee attendance not found.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTodaysAttendance = async (req, res) => {
  try {
    const { nowJakarta } = getWibTime();
    const { start, end } = getWibDayRange(nowJakarta);

    const attendance = await TodaysAttendance.find({
      date: { $gte: start, $lte: end },
    }).sort({ clockIn: 1 });

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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

export const markStatus = async (req, res) => {
  try {
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

    const { nowJakarta } = getWibTime();
    const { start, end } = getWibDayRange(nowJakarta);
    const attendanceDate = getAttendanceDate(nowJakarta);

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
      date: attendanceDate,
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
