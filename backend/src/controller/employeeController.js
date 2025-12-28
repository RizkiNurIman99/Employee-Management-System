import Employee from "../models/employeeModel.js";
import { emitSocketEvent } from "../utilities/socketInstance.js";

export const getEmployees = async (req, res) => {
  try {
    const { uid, name, empId } = req.query;

    const filter = {};
    if (uid) filter.uid = uid;
    if (name) filter.name = name;
    if (empId) filter.empId = empId;

    const employees = await Employee.find(filter).sort({ createdAt: 1 });

    if (employees) {
      return res.status(200).json({ exists: true, employees });
    } else {
      return res.status(404).json({ exist: false, employees: [] });
    }
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
    console.log(error.message);
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
    console.log("register error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, empId, department, role } = req.body;
    const picture = req.file ? req.file.filename : undefined;

    const updateData = { name, empId, department, role };
    if (picture) {
      updateData.picture = picture;
    }
    const employee = await Employee.findOne({ uid });
    if (!employee) {
      return res.status(404).json("Employee not found");
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { uid },
      updateData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Employee Updated", updatedEmployee });
    console.log("employee update", updatedEmployee);
  } catch (error) {
    console.log("update error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOneAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: "User not found" });
    }
    emitSocketEvent("attendance-delete", { id });
    res.status(200).json({ message: "User deleted succesfully", employee });
  } catch (error) {
    console.log("Delete error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
