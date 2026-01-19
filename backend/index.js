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

import path, { join } from "path";
import { fileURLToPath } from "url";

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
app.options("/", cors());

const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: allowedOrigins, credentials: true },
});

setSocketInstance(io);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/avatar", path.join(__dirname, "assets/avatar"));

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
