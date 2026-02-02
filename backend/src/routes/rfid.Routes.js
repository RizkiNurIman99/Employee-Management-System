import express from "express";
import { rfidScan } from "../controller/rfidScan.js";
import { rfidAuth } from "../auth/rfidAuth.js";
import { rfidLimiter } from "../config/rateLimmiter.js";

const router = express.Router();

router.post("/rfid-scan", rfidAuth, rfidLimiter, rfidScan);

export default router;
