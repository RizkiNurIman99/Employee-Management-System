import express from "express";
import { rfidScan } from "../controller/rfidScan.js";
import { rfidLimiter } from "../config/rateLimmiter.js";
import { rfidAuth } from "../auth/rfidAuth.js";

const router = express.Router();

router.post("/rfid-scan", rfidAuth, rfidLimiter, rfidScan);

export default router;
