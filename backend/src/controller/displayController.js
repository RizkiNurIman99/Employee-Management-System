import { getWibDayRange, getWibTime } from "../config/time.js";
import TodaysAttendance from "../models/todaysAttendance.js";

export const verifyDisplayKey = (req, res, next) => {
  if (req.headers["x-display-key"] !== process.env.DISPLAY_KEY) {
    return res.status(401).json({ message: "unauthorized" });
  }
  next();
};

export const getTodayForDisplay = async (req, res) => {
  try {
    const { nowJakarta } = getWibTime();
    const { start, end } = getWibDayRange(nowJakarta);

    const rows = await TodaysAttendance.find({
      date: { $gte: start, $lte: end },
      clockIn: { $ne: null },
    })
      .select("name picture empId department status clockIn clockOut")
      .sort({ clockIn: -1 })
      .limit(50)
      .lean();

    res.status(200).json(rows);
  } catch (err) {
    console.error("[ERROR getTodayForDisplay]", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
