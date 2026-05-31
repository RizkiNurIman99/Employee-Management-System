import Admin from "../models/adminModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment =
  process.env.NODE_ENV === "production" ? "production" : "development";
const envPath = path.resolve(__dirname, `../../.env.${environment}`);
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  dotenv.config();
}

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    await mongoose.connect(mongoUri);

    const exist = await Admin.findOne({ username: "admin" });
    if (exist) {
      if (process.env.RESET_ADMIN_PASSWORD === "true") {
        const defaultPassword =
          process.env.DEFAULT_ADMIN_PASSWORD || "admin12345";
        exist.password = defaultPassword;
        await exist.save();
        console.log("Admin password berhasil di-reset");
      } else {
        console.log("admin sudah dibuat");
      }
      process.exit(0);
    }

    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin12345";

    await Admin.create({
      username: "admin",
      password: defaultPassword,
      name: "Administrator",
    });
    console.log("Admin berhasil dibuat");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();
