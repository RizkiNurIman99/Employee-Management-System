import TodaysAttendance from "../models/todaysAttendance.js";

export const getDailyReport = async (req,res) => {
    try {
        const {date} = req.query;
        const targetDate = date ? new Date((`${date}T00:00:00.000+07:00`)) : new Date();

        const start = new Date(targetDate);
        start.setHours(0,0,0,0)
        const end = new Date(targetDate)
        end.setHours(23,59,59,999);
        
        const record = await TodaysAttendance.find({
            date: {$gte:start, $lte:end},
        }).sort({clockIn :1})
        res.status(200).json({date: targetDate.toDateString(), record})
        console.log("attendance record," ,record);
    } catch (error) {
        console.error("Error getting daily report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMonthlyReport = async (req,res) => {
    try {
        const {month,year} = req.query;

        const now = new Date();
        const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const start = new Date(targetYear, targetMonth, 1);
        const end = new Date(targetYear,targetMonth + 1,0,23,59,59,999)

        const records = await TodaysAttendance.aggregate([
            {
                $match: {
                    date: { $gte: start,$lte: end},
                },
            },
            {
                $group: {
                    _id: {uid: "$uid", name: "$name", department: "$department"},
                    totalDays: {$sum:1},
                    onTime: {
                        $sum: {$cond: [{ $eq: ["$status", "On-Time"]}, 1,0]},
                    },
                    late: {
                        $sum: { $cond: [{$eq: ["$status","Late"]},1,0]},
                    }
                }
            },
            {
                $sort: { "_id.name": 1},
            }
        ])

        res.status(200).json({
            month: targetMonth + 1,
            year: targetYear,
            records,
        })
    } catch (error) {
        console.error("Error getting monthly report:", error);
    res.status(500).json({ message: "Internal server error" });
    }
}