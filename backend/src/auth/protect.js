import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const admin = await Admin.findById(decoded.adminId).select("-passsword");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Protect error:", error);
    return res.status(401).json({ message: "Token invalid" });
  }
};
