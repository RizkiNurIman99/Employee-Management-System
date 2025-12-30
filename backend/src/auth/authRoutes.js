import dotenv from "dotenv";
import express, { Router } from "express";
import AdminLogin from "./authController.js";

dotenv.config();
const router = express.Router();

router.post("/api/login", AdminLogin);

export default router;
