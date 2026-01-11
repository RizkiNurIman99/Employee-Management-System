import mongoose from "mongoose";
import dns from "dns";

dns.resolveTxt("employee.f5valsj.mongodb.net", (err, data) => {
  console.log(err || data);
});

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Success connected to database");
  } catch (error) {
    console.log("error connected to database", error.message);
    process.exit(1);
  }
};
