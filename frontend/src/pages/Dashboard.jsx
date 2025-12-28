import {
  LuAlarmClockOff,
  LuClock7,
  LuClockAlert,
  LuUsersRound,
} from "react-icons/lu";
import StatusCard from "../components/Status_Card/StatusCard";
import DashboardAttendance from "../components/Table/DashboardAttendance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "@/config/socket";
import API_ENDPOINTS from "@/config/api";
import { formattedDateLong } from "@/config/formatDate";
import api from "@/config/axios";

const Dashboard = () => {
  const [todaysAttendance, setTodayAttendance] = useState([]);

  useEffect(() => {
    const fetchDataAttendance = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.GET_ALL_TODAYS_ATTENDANCE);
        setTodayAttendance(res.data.attendance);
        console.log(res.data.attendance);
      } catch (error) {
        toast.error("failed get data");
      }
    };
    fetchDataAttendance();
    socket.on("attendance-recorded", (newRecord) => {
      console.log("Check-in recorded:", newRecord);
      setTodayAttendance((prevRecords) => [newRecord, ...prevRecords]);
    });

    socket.on("attendance-updated", (updatedRecord) => {
      console.log("Check-out recorded:", updatedRecord);
      setTodayAttendance((prevRecords) =>
        prevRecords.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
    });
    return () => {
      socket.off("attendance-recorded");
      socket.off("attendance-updated");
    };
  }, []);

  const totalEmployees = todaysAttendance.length;
  const late = todaysAttendance.filter((user) => user.status === "Late").length;
  const onTime = todaysAttendance.filter(
    (user) => user.status === "On-Time"
  ).length;
  const leave = todaysAttendance.filter(
    (user) => user.status === "Leave"
  ).length;
  const sick = todaysAttendance.filter((user) => user.status === "Sick").length;
  const absent = todaysAttendance.filter(
    (user) => user.status === "Absent"
  ).length;

  const absentTodays = leave + sick + absent;

  return (
    <div className="w-full overflow-hidden flex flex-col flex-1">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="font-DMsans font-semibold text-dark dark:text-white text-2xl">
          Dashboard
        </h1>
        <div>
          <p className="font-DMsans text-md font-medium text-black dark:text-light">
            {formattedDateLong()}
          </p>
        </div>
      </div>
      <div className="py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Today's Attendance"
          value={totalEmployees}
          bgColor="bg-card dark:bg-card"
          textColor="text-dark"
          icon={LuUsersRound}
          iconColor="text-orange-500"
        />
        <StatusCard
          title="Late Arrivals"
          value={late}
          bgColor="bg-card dark:bg-card"
          textColor="text-dark"
          icon={LuClockAlert}
          iconColor="text-red-500"
        />
        <StatusCard
          title="On-Time"
          value={onTime}
          bgColor="bg-card dark:bg-card"
          textColor="text-dark"
          icon={LuClock7}
          iconColor="text-green-500"
        />
        <StatusCard
          title="Absent"
          value={absentTodays}
          bgColor="bg-card dark:bg-card"
          textColor="text-dark"
          icon={LuAlarmClockOff}
          iconColor="text-purple-500"
        />
      </div>
      <div className="py-5 w-full overflow-x-auto">
        <DashboardAttendance Data={todaysAttendance} />
      </div>
    </div>
  );
};

export default Dashboard;
