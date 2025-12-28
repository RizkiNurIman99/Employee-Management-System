import express from 'express'
import { attendance, checkIn, checkOut, deleteAttendanceRecord, getAllTodaysAttendance, getAttendanceEmployee, markStatus } from "../controller/attendanceController.js";
import { getDailyReport, getMonthlyReport } from "../controller/attendanceReport.js";

const router = express.Router()

  router.post("/api/attendance", attendance);
  router.post("/api/attendance/manual-checkIn", checkIn);
  router.put("/api/attendance/manual-checkOut", checkOut);
  router.post("/api/attendance/mark-status", markStatus);
  router.get("/api/attendance/getAttendance", getAttendanceEmployee);
  router.get("/api/attendance/attendances", getAllTodaysAttendance);
  router.delete("/api/attendance/delete-record/:id", deleteAttendanceRecord);
  
  router.get("/api/attendance-report/daily-report",getDailyReport)
  router.get("/api/attendance-report/daily-monthly", getMonthlyReport)


export default router
