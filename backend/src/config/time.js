import { startOfDay } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const getWibTime = () => {
  const nowUtc = new Date();
  const nowJakarta = utcToZonedTime(nowUtc, "Asia/Jakarta");
  return { nowUtc, nowJakarta };
};

export const getAttendanceDate = (nowJakarta) =>
  zonedTimeToUtc(startOfDay(nowJakarta), "Asia/Jakarta");

export const getAttendanceStatus = (nowJakarta) => {
  const ON_TIME_HOUR = 7;
  const ON_TIME_MINUTE = 30;

  return nowJakarta.getHours() < ON_TIME_HOUR ||
    (nowJakarta.getHours() === ON_TIME_HOUR &&
      nowJakarta.getMinutes() <= ON_TIME_MINUTE)
    ? "On-Time"
    : "Late";
};
