import TodaysAttendance from "../models/todaysAttendance.js";
import { startOfDay, endOfDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;

    const jakartaDate = date ? new Date(`${date}T00:00:00`) : new Date();

    const start = zonedTimeToUtc(startOfDay(jakartaDate), "Asia/Jakarta");
    const end = zonedTimeToUtc(endOfDay(jakartaDate), "Asia/Jakarta");

    const record = await TodaysAttendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ clockIn: 1 });

    res.status(200).json({
      date: date || new Date().toISOString().slice(0, 10),
      record,
    });
  } catch (error) {
    console.error("Error getting daily report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
