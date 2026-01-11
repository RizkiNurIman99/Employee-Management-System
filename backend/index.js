import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDb } from "./src/config/db.js";

import {
  emitSocketEvent,
  setSocketInstance,
} from "./src/utilities/socketInstance.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import rfidRoutes from "./src/routes/rfid.Routes.js";
import router from "./src/auth/authRoutes.js";
import { protect } from "./src/auth/protect.js";
import { logError, logInfo } from "./src/utilities/logger.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.set("trust proxy", true);

const allowedOrigins = process.env.CORS_ORIGIN?.split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: allowedOrigins, credentials: true },
});

setSocketInstance(io);

app.use("/avatar", express.static("assets/avatar"));

app.use("/api", router);
app.use("/api", rfidRoutes);
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);

app.get("/api/secure", protect, (req, res) => {
  res.json({ message: "Anda berhasil masuk", user: req.user });
});

app.get("/emittest", (req, res) => {
  emitSocketEvent("uid-detected", "Test123456");
  res.send("Test UID emitted");
});

io.on("connection", (socket) => {
  logInfo("Socket connected", socket.id);
  socket.on("disconnect", () => {
    logInfo("Socket disconnected", socket.id);
  });
});
connectDb()
  .then(() => {
    logInfo("Database connected");
    server.listen(PORT, "0.0.0.0", () => {
      logInfo(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logError("Database connecting error", err);
    process.exit(1);
  });
