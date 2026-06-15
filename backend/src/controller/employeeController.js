import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Employee from "../models/employeeModel.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarDir = path.resolve(__dirname, "..", "assets", "avatar");

const deleteOldAvatar = (filename) => {
  if (!filename || filename === "default-avatar.png") return;
  const filePath = path.join(avatarDir, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed delete old avatar:", err.message);
    }
  });
};

export const getEmployees = async (req, res) => {
  try {
    const { uid, name, empId } = req.query;

    const filter = {};
    if (uid) filter.uid = uid;
    if (name) filter.name = name;
    if (empId) filter.empId = empId;

    const employees = await Employee.find(filter)
      .collation({ locale: "en", numericOrdering: true })
      .sort({ empId: 1 });
    console.log("Result count:", employees.length);
    if (employees.length > 0) {
      return res.status(200).json({ exists: true, employees });
    }
    return res.status(404).json({ exists: false, employees: [] });
  } catch (error) {
    console.log("Internal Server Error", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { uid } = req.params;
    const employee = await Employee.findOne({ uid });
    if (!employee) return res.status(404).json("Employee not found");
    res.status(200).json({ message: "Employee Found", employee });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { uid, name, empId, department, role } = req.body;
    const picture = req.file ? req.file.filename : "default-avatar.png";
    if (!uid || !name || !empId || !department || !role) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }
    const existingEmployee = await Employee.findOne({ uid });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ error: "User with this UID already exists." });
    }

    const newEmployee = new Employee({
      uid,
      picture,
      name,
      empId,
      department,
      role,
    });

    await newEmployee.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (req.file) {
      deleteOldAvatar(req.file.filename);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, empId, department, role } = req.body;
    const newPicture = req.file ? req.file.filename : undefined;

    const updateData = { name, empId, department, role };
    if (newPicture) {
      updateData.picture = newPicture;
    }
    const existingEmployee = await Employee.findOne({ uid });
    if (!existingEmployee) {
      if (newPicture) deleteOldAvatar(newPicture);
      return res.status(404).json("Employee not found");
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { uid },
      updateData,
      {
        new: true,
      },
    );

    if (newPicture) {
      deleteOldAvatar(existingEmployee.picture);
    }

    res.status(200).json({ message: "Employee Updated", updatedEmployee });
  } catch (error) {
    if (req.file) deleteOldAvatar(req.file.filename);
    console.error("update error", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: "User not found" });
    }
    deleteOldAvatar(employee.picture);
    emitSocketEvent("employee-deleted", { id });
    res.status(200).json({ message: "User deleted succesfully", employee });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
