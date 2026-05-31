import express from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
} from "../controller/adminController.js";
import { protect } from "../auth/protect.js";
import { authorize } from "../auth/authorize.js";

const router = express.Router();

router.use(protect);
router.use(authorize("active"));

router.get("/admins", getAdmins);
router.post("/createAdmin", createAdmin);
router.put("/updateAdmin/:id", updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

export default router;
