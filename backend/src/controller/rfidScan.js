import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";
import {
  getJakartaTime,
  getAttendanceDate,
  getAttendanceStatus,
} from "../utils/time.js";

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
      return res.status(404).json({
        message: "Employee not found, Please Register!!!",
      });
    }

    const { nowUtc, nowJakarta } = getJakartaTime();
    const attendanceDate = getAttendanceDate(nowJakarta);

    const existingEmployee = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    // ================= CHECK-IN =================
    if (!existingEmployee) {
      const status = getAttendanceStatus(nowJakarta);

      const newEntry = await TodaysAttendance.create({
        uid: employee.uid,
        name: employee.name,
        picture: employee.picture,
        empId: employee.empId,
        department: employee.department,
        role: employee.role,
        date: attendanceDate,
        clockIn: nowUtc,
        clockOut: null, // ✅ FIX
        status,
      });

      emitSocketEvent("attendance-recorded", newEntry);

      return res.status(201).json({
        message: "Check-in recorded successfully",
        attendance: newEntry,
      });
    }

    // ================= CHECK-OUT =================
    if (existingEmployee.clockOut) {
      return res.status(400).json({
        message: "You have already checked out today",
      });
    }

    existingEmployee.clockOut = nowUtc;
    await existingEmployee.save();

    emitSocketEvent("attendance-updated", existingEmployee);

    return res.status(200).json({
      message: "Check-out successfully",
      attendance: existingEmployee,
    });
  } catch (error) {
    console.error("[ERROR RFID SCAN]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
