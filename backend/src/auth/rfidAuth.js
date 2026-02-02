export const rfidAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.RFID_API_KEY) {
    return res.status(403).json({ message: "RFID Unauthorized" });
  }
  next();
};
