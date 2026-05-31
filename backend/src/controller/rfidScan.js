import {
  getAttendanceDate,
  getAttendanceStatus,
  getWibTime,
  isCheckInAllowed,
} from "../config/time.js";
import Employee from "../models/employeeModel.js";
import TodaysAttendance from "../models/todaysAttendance.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";

const isDuplicateKeyError = (error) => error?.code === 11000;

export const rfidScan = async (req, res) => {
  try {
    const { uid, mockTime } = req.body;

    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const employee = await Employee.findOne({ uid });
    if (!employee) {
      emitSocketEvent("uid-detected", {
        uid,
        isRegistered: false,
        message: "Employee not found",
      });
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    emitSocketEvent("uid-detected", {
      uid,
      isRegistered: true,
      message: "Card is registered",
    });

    const { nowUtc, nowJakarta } = getWibTime();
    const attendanceDate = getAttendanceDate(nowJakarta);

    const existingEmployee = await TodaysAttendance.findOne({
      uid,
      date: attendanceDate,
    });

    // ================= CHECK-IN =================
    if (!existingEmployee) {
      if (!isCheckInAllowed(nowJakarta)) {
        const hour = nowJakarta.getHours();
        const minute = nowJakarta.getMinutes();
        const totalMinutes = hour * 60 + minute;

        const message =
          totalMinutes < 6 * 60 + 30
            ? "Check-in is not open yet. Please come back at 06:30 WIB."
            : "Check-in is closed. Please come back tomorrow.";
        emitSocketEvent("checkin-recorded", { uid, message });
        return res.status(400).json({ message });
      }
      const status = getAttendanceStatus(nowJakarta);
      try {
        const newEntry = await TodaysAttendance.create({
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

        emitSocketEvent("attendance-recorded", newEntry);
        return res.status(201).json({
          message: "Attendance recorded successfully",
          attendance: newEntry,
        });
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          return res.status(400).json({
            message: "You have already checked in",
          });
        }
        throw error; // Re-throw other errors to be caught by the outer catch block
      }
    }

    // ================= CHECK-OUT =================
    if (existingEmployee.clockOut) {
      return res.status(400).json({
        message: "You have already checked out",
      });
    }

    existingEmployee.clockOut = nowUtc;
    await existingEmployee.save();

    emitSocketEvent("attendance-updated", existingEmployee);

    return res.status(200).json({
      message: "Check Out successfully",
      attendance: existingEmployee,
    });
  } catch (error) {
    console.error("[ERROR RFID SCAN]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
