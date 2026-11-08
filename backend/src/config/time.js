import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export const getWibTime = () => {
  let nowUtc = new Date();
  let nowJakarta = toZonedTime(nowUtc, TIMEZONE);

  return { nowUtc, nowJakarta };
};

export const getAttendanceDate = (nowJakarta) =>
  fromZonedTime(startOfDay(nowJakarta), TIMEZONE);

export const getWibDayRange = (nowJakarta) => {
  const base = nowJakarta ?? getWibTime().nowJakarta;
  const start = fromZonedTime(startOfDay(base), TIMEZONE);
  const end = fromZonedTime(endOfDay(base), TIMEZONE);
  return { start, end };
};

const ENABLE_CHECKIN_TIME_LIMIT = false;
export const isCheckInAllowed = (nowJakarta) => {
  if (!ENABLE_CHECKIN_TIME_LIMIT) {
    return true;
  }
  const hour = nowJakarta.getHours();
  const minute = nowJakarta.getMinutes();
  const totalMinuntes = hour * 60 + minute;

  const checkInOpen = 6 * 60 + 30;
  const checkInClose = 9 * 60;

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
