import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const AdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!admin)
      return res.status(401).json({ message: "Username atau password salah" });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(401).json({ message: "Username atau password salah" });

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );
    console.log("Token login", token);

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default AdminLogin;
