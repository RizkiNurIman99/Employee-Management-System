import { LuLayoutDashboard } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import { PiUsersLight } from "react-icons/pi";
import { AiOutlineSetting } from "react-icons/ai";

export const navbarLinks = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    id: 2,
    label: "Attendance",
    path: "/attendance",
    icon: LuIdCard,
  },
  {
    id: 3,
    label: "Employee",
    path: "/employee",
    icon: PiUsersLight,
  },
  {
    id: 4,
    label: "Manage",
    path: "/manage-user",
    icon: AiOutlineSetting,
  },
];

export const employeeColumns = [
  { label: "UID", key: "uid" },
  { label: "Name", key: "name" },
  { label: "EMP ID", key: "empId" },
  { label: "Department", key: "department" },
  { label: "Registration Date", key: "date" },
  { label: "Action", key: "action" },
];

export const attendanceTableColumns = [
  { label: "Name", key: "name" },
  { label: "Emp Id", key: "empId" },
  { label: "Department", key: "department" },
  { label: "Date & Time", key: "date" },
  { label: "Status", key: "status" },
  { label: "Option", key: "Option" },
];

export const AtendanceReportCol = [
  { label: "Name", key: "name" },
  { label: "Emp Id", key: "empId" },
  { label: "Department", key: "department" },
  { label: "Date", key: "date" },
  { label: "Status", key: "status" },
];
