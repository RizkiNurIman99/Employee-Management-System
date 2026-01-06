import mongoose from "mongoose";
import dns from "dns";

dns.resolveTxt("employee.f5valsj.mongodb.net", (err, data) => {
  console.log(err || data);
});

export const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rizkinuriman7:2vhwwMmyijvbYWSJ@employee.f5valsj.mongodb.net/EmployeeAttendance?retryWrites=true&w=majority&appName=Employee"
    );
    console.log("Success connected to database");
  } catch (error) {
    console.log("error connected to database", error.message);
    process.exit(1);
  }
};
