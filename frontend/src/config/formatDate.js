const formatterTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
});

export const formatTime = (value) => {
  if (!value) return "---";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "---";

  return formatterTime.format(date);
};

export const formattedDateLong = (dateString) => {
  const dateToFormat = dateString ? new Date(dateString) : new Date();
  const options = {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return dateToFormat.toLocaleDateString("en-UK", options);
};

export const formattedDateShort = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
};
