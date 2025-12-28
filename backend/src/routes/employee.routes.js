import express from "express";
import { getManualAttend } from "../controller/attendanceController.js";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "../controller/employeeController.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
import { protect } from "../auth/protect.js";
import { authorize } from "../auth/authorize.js";

const router = express.Router();

router.use(protect);

router.get("/api/employees", protect, authorize("active"), getEmployees);
router.get("/api/employee/:uid", getEmployeeById);
router.post(
  "/api/createEmployee",
  protect,
  authorize("active"),
  upload.single("picture"),
  createEmployee
);
router.put(
  "/api/updateEmployee/:uid",
  upload.single("picture"),
  updateEmployee
);
router.delete("/api/deleteEmployee/:id", deleteEmployee);
router.get("/api/employees/manualAttend", getManualAttend);

export default router;
