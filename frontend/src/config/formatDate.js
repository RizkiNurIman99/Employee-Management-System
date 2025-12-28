export const formatTime = (isoString) => {
  if (!isoString) {
    return "---";
  }
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
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
