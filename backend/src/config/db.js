import mongoose from "mongoose";

export const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  await mongoose.connect(mongoUri);
};
