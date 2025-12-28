import mongoose from "mongoose";

const absentSchema = new mongoose.Schema(
  {
    uid: String,
    name: String,
    empId: String,
    department: String,
    role: String,
    date: {
      startDate: { type: Date, required: true, default: Date.now },
      endDate: { type: Date, required: true, default: Date.now },
    },
    absentType: {
      type: String,
      enum: ["Sick", "Leave", "Absent"],
    },
  },
  { timestamps: true }
);

const Absent = mongoose.model("Absent", absentSchema);
export default Absent;
