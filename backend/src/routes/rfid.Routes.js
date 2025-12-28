import express from "express";
import { rfidScan} from "../controller/rfidScan.js";

const router = express.Router();


router.post("/api/rfid-scan", rfidScan);


export default router
