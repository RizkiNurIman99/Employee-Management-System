import express from "express";
import {
  attendance,
  deleteAttendanceRecord,
  getAllTodaysAttendance,
  getAttendanceEmployee,
  markStatus,
} from "../controller/attendanceController.js";
import { getDailyReport } from "../controller/attendanceReport.js";

const router = express.Router();

router.post("/attendance", attendance);
router.post("/attendance/mark-status", markStatus);
router.get("/attendance/getAttendance", getAttendanceEmployee);
router.get("/attendance/attendances", getAllTodaysAttendance);
router.delete("/attendance/delete-record/:id", deleteAttendanceRecord);

router.get("/attendance-report/daily-report", getDailyReport);

export default router;
