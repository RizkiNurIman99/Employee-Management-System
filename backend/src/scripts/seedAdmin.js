import bcrypt from "bcryptjs"
import Admin from "../models/adminModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const exist = await Admin.findOne({username: "admin"})
        if(exist){
            console.log("admin sudah dibuat");
            process.exit()
        }
        const hashedPassword = await bcrypt.hash("admin12345", 10);

        await Admin.create({
            username: "admin",
            password: hashedPassword,
            name : "Administrator",
        });
        console.log("Admin berhasil dibuat");
        process.exit();
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

seedAdmin()