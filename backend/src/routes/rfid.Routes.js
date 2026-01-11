import express from "express";
import { rfidScan } from "../controller/rfidScan.js";

const router = express.Router();

router.post("/rfid-scan", rfidScan);

export default router;
