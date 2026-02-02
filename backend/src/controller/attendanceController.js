import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitEvent } from "../utilities/socketInstance.js";
import {
  getJakartaTime,
  getAttendanceDate,
  getAttendanceStatus,
} from "../utils/time.js";

export const attendance = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: "Uid is required" });

    const employee = await Employee.findOne({ uid });
    if (!employee) {
      emitEvent("unregistered-card-error", { uid });
      return res.status(404).json({ message: "Employee not found" });
    }

    const { nowUtc, nowJakarta } = getJakartaTime();
    const attendanceDate = getAttendanceDate(nowJakarta);

    const existing = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    if (!existing) {
      const status = getAttendanceStatus(nowJakarta);

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

      emitEvent("attendance-recorded", record);
      return res.status(201).json({ attendance: record });
    }

    if (existing.clockOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    existing.clockOut = nowUtc;
    await existing.save();
    emitEvent("attendance-updated", existing);

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
    const { nowJakarta } = getJakartaTime();
    const date = getAttendanceDate(nowJakarta);

    const attendance = await TodaysAttendance.find({ date }).sort({
      clockIn: 1,
    });

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
    emitEvent("attendance-deleted", { id });
    return res.status(200).json({ message: "Data delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
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
    emitEvent("attendance-recorded", newAttendance);

    return res.status(201).json({
      message: `Status for ${employee.name} marked as ${status}`,
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("[ERROR MARKING STATUS]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
