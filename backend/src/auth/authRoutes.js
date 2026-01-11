import dotenv from "dotenv";
import express from "express";
import AdminLogin from "./authController.js";

dotenv.config();
const router = express.Router();

router.post("/login", AdminLogin);

export default router;
