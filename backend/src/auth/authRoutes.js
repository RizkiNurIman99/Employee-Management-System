import express from "express";
import AdminLogin from "./authController.js";
import { authLimiter } from "../config/rateLimmiter.js";

const router = express.Router();

router.post("/login", authLimiter, AdminLogin);

export default router;
