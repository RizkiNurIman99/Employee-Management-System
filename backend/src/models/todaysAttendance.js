import mongoose from "mongoose";

const todaysAttendanceSchema = new mongoose.Schema(
  {
    uid: String,
    name: { type: String, required: true },
    picture: String,
    empId: String,
    department: String,
    role: String,
    date: {
      type: Date,
      default: Date.now,
    },
    clockIn: {
      type: Date,
      default: null,
    },
    clockOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["On-Time", "Late", "Absent", "Sick", "Leave"],
      default: "Absent",
    },
  },
  { timestamps: true }
);

const TodaysAttendance = mongoose.model(
  "TodaysAttendance",
  todaysAttendanceSchema
);

export default TodaysAttendance;
