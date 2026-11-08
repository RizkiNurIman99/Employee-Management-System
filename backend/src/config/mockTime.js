TIMEZONE = "Asia/Jakarta";
export default mockTimeWib = () => {
  const isMockAllowed = process.env.NODE_ENV !== "production";
  const mockTime = process.env.MOCK_TIME;

  if (!isMockAllowed || !mockTime) {
    return getWibTime();
  }

  const [hour, minute] = mockTime.split(":").map(Number);
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid MOCK_TIME: ${mockTime}. use HH:mm format.`);
  }
  const actualNowUtc = new Date();
  const jakartaTime = toZonedTime(actualNowUtc, TIMEZONE);

  jakartaTime.setHours(hour, minute, 0, 0);

  const nowUtc = fromZonedTime(jakartaTime, TIMEZONE);
  const nowJakarta = toZonedTime(nowUtc, TIMEZONE);

  return { nowUtc, nowJakarta };
};
