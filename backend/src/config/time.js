import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { now } from "mongoose";

export const getWibTime = () => {
  let nowUtc = new Date();
  if (process.env.MOCK_TIME) {
    const [hour, minute] = process.env.MOCK_TIME.split(":").map(Number);
    const jakartaTime = toZonedTime(nowUtc, "Asia/Jakarta");

    jakartaTime.setHours(hour, minute, 0, 0);
    nowUtc = fromZonedTime(jakartaTime, "Asia/Jakarta");
  }
  const nowJakarta = toZonedTime(nowUtc, "Asia/Jakarta");
  return { nowUtc, nowJakarta };
};

export const getAttendanceDate = (nowJakarta) =>
  fromZonedTime(startOfDay(nowJakarta), "Asia/Jakarta");

export const getWibDayRange = (nowJakarta) => {
  const base = nowJakarta ?? getWibTime().nowJakarta;
  const start = fromZonedTime(startOfDay(base), "Asia/Jakarta");
  const end = fromZonedTime(endOfDay(base), "Asia/Jakarta");
  return { start, end };
};

export const isCheckInAllowed = (nowJakarta) => {
  const hour = nowJakarta.getHours();
  const minute = nowJakarta.getMinutes();
  const totalMinuntes = hour * 60 + minute;

  const checkInOpen = 6 * 60 + 30; // 06:30 in minutes
  const checkInClose = 7 * 60 + 45;

  return totalMinuntes >= checkInOpen && totalMinuntes <= checkInClose;
};

export const isCheckOutAllowed = (nowJakarta) => {
  const hour = nowJakarta.getHours();
  const minute = nowJakarta.getMinutes();
  const totalMinuntes = hour * 60 + minute;

  const checkOutOpen = 15 * 60; // 15:00 in minutes
  const checkOutClose = 16 * 60; // 16:00 in minutes

  return totalMinuntes >= checkOutOpen && totalMinuntes <= checkOutClose;
};

export const getAttendanceStatus = (nowJakarta) => {
  const ON_TIME_HOUR = 6;
  const ON_TIME_MINUTE = 30;

  return nowJakarta.getHours() < ON_TIME_HOUR ||
    (nowJakarta.getHours() === ON_TIME_HOUR &&
      nowJakarta.getMinutes() <= ON_TIME_MINUTE)
    ? "On-Time"
    : "Late";
};
