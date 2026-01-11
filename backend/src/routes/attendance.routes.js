import express from "express";
import {
  attendance,
  checkIn,
  checkOut,
  deleteAttendanceRecord,
  getAllTodaysAttendance,
  getAttendanceEmployee,
  markStatus,
} from "../controller/attendanceController.js";
import {
  getDailyReport,
  getMonthlyReport,
} from "../controller/attendanceReport.js";

const router = express.Router();

router.post("/attendance", attendance);
router.post("/attendance/manual-checkIn", checkIn);
router.put("/attendance/manual-checkOut", checkOut);
router.post("/attendance/mark-status", markStatus);
router.get("/attendance/getAttendance", getAttendanceEmployee);
router.get("/attendance/attendances", getAllTodaysAttendance);
router.delete("/attendance/delete-record/:id", deleteAttendanceRecord);

router.get("/attendance-report/daily-report", getDailyReport);
router.get("/attendance-report/daily-monthly", getMonthlyReport);

export default router;
