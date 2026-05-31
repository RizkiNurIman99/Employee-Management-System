import express from "express";
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

router.get("/employees", authorize("active"), getEmployees);
router.get("/employee/:uid", getEmployeeById);
router.post(
  "/createEmployee",
  protect,
  upload.single("picture"),
  createEmployee,
);
router.put("/updateEmployee/:uid", upload.single("picture"), updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);

export default router;
