import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, User, Clock, Building2, BadgeCheck } from "lucide-react";

import { useTheme } from "@/Context/theme-context";
import { formattedDateLong, formatTime } from "@/config/formatDate";

import logo from "../../src/assets/Logo/Logo.png";
import StatusPill from "@/components/StatusPill/StatusPill";
import socket from "@/config/socket";
import toast from "react-hot-toast";
import Avatar from "@/Common/Avatar";
import { cn } from "@/lib/utils";
import api from "@/config/axios";
import API_ENDPOINTS from "@/config/api";

const displayKey =
  new URLSearchParams(window.location.search).get("key") ??
  import.meta.env.VITE_DISPLAY_KEY;

const Display = () => {
  const { theme, setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    let isFetching = false;
    const fetchDataAttendance = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const res = await api.get(API_ENDPOINTS.DISPLAY_ATTENDANCE, {
          headers: { "x-display-key": displayKey },
        });
        console.log("status :", res.status);
        console.log("Array :", Array.isArray(res.data));
        if (!active) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setAttendance(rows);
        console.log("jumlah", rows.length);

        const latestAttendance = rows
          .map((record) => {
            const clockInTime = record.clockIn
              ? new Date(record.clockIn).getTime()
              : 0;
            const clockOutTime = record.clockOut
              ? new Date(record.clockOut).getTime()
              : 0;
            const isCheckOut = clockOutTime > clockInTime;
            return {
              ...record,
              attendanceType: isCheckOut ? "CHECK-OUT" : "CHECK-IN",
              activityTime: Math.max(clockInTime, clockOutTime),
            };
          })
          .sort((a, b) => b.activityTime - a.activityTime)[0];
        setAttendance(latestAttendance ?? null);
        console.log("attendance", latestAttendance);
      } catch (error) {
        console.error(
          "Failed to display fetching data :",
          error.response?.data || error.message,
        );
        toast.error("Failed get Data attendance", { id: "display-load-error" });
      } finally {
        isFetching = false;
        if (active) setLoading(false);
      }
    };
    fetchDataAttendance();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleCheckIn = (record) => {
      setAttendance({ ...record, attendanceType: "CHECK-IN" });
    };
    const handleCheckOut = (record) => {
      setAttendance({ ...record, attendanceType: "CHECK-OUT" });
    };

    socket.on("attendance-recorded", handleCheckIn);
    socket.on("attendance-updated", handleCheckOut);

    return () => {
      socket.off("attendance-recorded", handleCheckIn);
      socket.off("attendance-updated", handleCheckOut);
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleDisconnect);

    setConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleDisconnect);
    };
  }, []);

  const currentTimeFormatted = formatTime(currentTime);

  const attendanceType = attendance?.attendanceType ?? "CHECK-IN";

  const attendanceTime =
    attendanceType === "CHECK-OUT"
      ? formatTime(attendance?.clockOut)
      : formatTime(attendance?.clockIn);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen font-DMsans bg-accent text-foreground transition-colors duration-300">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex h-20 w-full  items-center justify-between px-6 lg:px-10">
          <div>
            <img src={logo} className="h-18 w-32" />
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  `className="inline-block h-3 w-3 rounded-full bg-green-500`,
                  connected ? "bg-green-500" : "bg-red-500",
                )}
              />
              {connected ? "Connected" : "Disconnected"}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent hover:bg-accent text-foreground transition-all duration-200 ">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <section className="flex flex-col justify-center items-center">
          <p className="text-md font-semibold capitalize tracking-wider text-muted-foreground">
            {formattedDateLong()}
          </p>
          <time
            className="mt-1 block text-6xl font-extrabold tracking-tight tabular-nums font-Montserrat sm:text-7xl lg:text-8xl"
            style={{
              fontSize: "clamp(4rem, 13vw, 12rem)",
              fontVariantNumeric: "tabular-nums",
            }}>
            {currentTimeFormatted}
          </time>
        </section>
        <section className="flex flex-1 items-center justify-center py-10">
          {loading ? (
            <p className="text-muted-foreground">Loading attendance...</p>
          ) : !attendance ? (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="mt-5 text-2xl font-bold">Ready for Attendance</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Please scan your RFID card
              </p>
            </div>
          ) : (
            <article className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* CARD HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Attendance
                  </p>
                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                    Employee Attendance
                  </h2>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
                    attendanceType === "CHECK-IN"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  }`}>
                  {attendanceType}
                </span>
              </div>
              {/* EMPLOYEE */}
              <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[180px_1fr] md:items-center">
                {/* PHOTO */}
                <div className="flex justify-center">
                  <div className="aspect-square w-40 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Avatar
                      src={attendance.picture}
                      alt={attendance.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                {/* INFORMATION */}
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Welcome
                  </p>
                  <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    {attendance.name}
                  </h3>
                  <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                    {/* ID */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Employee ID
                      </p>
                      <p className="mt-1 font-semibold">{attendance.empId}</p>
                    </div>
                    {/* DEPARTMENT */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Department
                      </p>

                      <p className="mt-1 font-semibold">
                        {attendance.department}
                      </p>
                    </div>
                    {/* TIME */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {attendanceType}
                      </p>

                      <p className="mt-1 text-lg font-bold tabular-nums">
                        {attendanceTime}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="mt-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    <StatusPill status={attendance.status} />
                  </div>
                </div>
              </div>
            </article>
          )}
        </section>
      </main>
      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border/40 mt-auto">
        Employee Management System · version 0.1
      </footer>
    </div>
  );
};

export default Display;
