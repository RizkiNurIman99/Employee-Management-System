import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDb } from "./src/config/db.js";

import {
  emitSocketEvent,
  setSocketInstance,
} from "./src/utilities/socketInstance.js";

import employeeRoutes from "./src/routes/employee.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import rfidRoutes from "./src/routes/rfid.Routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import router from "./src/auth/authRoutes.js";
import { protect } from "./src/auth/protect.js";
import { logError, logInfo } from "./src/utilities/logger.js";

import path from "path";
import { fileURLToPath } from "url";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const REQUIRED_ENV = ["MONGO_URI", "SECRET_KEY", "RFID_API_KEY", "CORS_ORIGIN"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length) {
  logError(`Missing required env: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const SERVICE_NAME = "absensi-backend";
const HEALTHCHECK_PATH = "/api/health";

const allowedOrigins = process.env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

const app = express();
const server = http.createServer(app);

app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

app.use(cors(corsOptions));

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  next();
});

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

setSocketInstance(io);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/storage/avatar",
  express.static(path.join(__dirname, "assets/avatar")),
);

app.use("/api", router);
app.use("/api", rfidRoutes);
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", adminRoutes);

app.get(HEALTHCHECK_PATH, (_req, res) => {
  res.status(200).json({ status: "ok", service: SERVICE_NAME });
});

app.get("/api/secure", protect, (req, res) => {
  res.json({ message: "Anda berhasil masuk", user: req.admin });
});

app.get("/emittest", (req, res) => {
  emitSocketEvent("uid-detected", {
    uid: "Test123456",
    isRegistered: false,
    message: "Test UID emitted",
  });
  res.send("Test UID emitted");
});

io.on("connection", (socket) => {
  logInfo("Socket connected", socket.id);
  socket.on("disconnect", () => {
    logInfo("Socket disconnected", socket.id);
  });
});

const isExistingBackendRunning = () =>
  new Promise((resolve) => {
    const request = http.get(
      {
        host: "127.0.0.1",
        port: PORT,
        path: HEALTHCHECK_PATH,
        timeout: 1500,
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode !== 200) {
            resolve(false);
            return;
          }

          try {
            const payload = JSON.parse(body);
            resolve(payload?.service === SERVICE_NAME);
          } catch {
            resolve(false);
          }
        });
      },
    );

    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });

    request.on("error", () => {
      resolve(false);
    });
  });

const shutdown = async (signal) => {
  logInfo(`${signal} received, shutting down server`);

  if (!server.listening) {
    process.exit(0);
    return;
  }

  server.close(async (error) => {
    if (error) {
      logError("Error during server shutdown", error);
      process.exit(1);
      return;
    }

    try {
      await mongoose.connection.close(false);
    } catch (dbError) {
      logError("Error during DB shutdown", dbError);
    }

    process.exit(0);
  });
};

server.on("error", async (error) => {
  if (error.code === "EADDRINUSE") {
    const existingBackendRunning = await isExistingBackendRunning();

    if (existingBackendRunning) {
      logInfo(
        `Backend already running on http://127.0.0.1:${PORT}. Skipping duplicate startup.`,
      );
      process.exit(0);
      return;
    }

    logError(
      `Port ${PORT} is already in use by another process. Stop that process or set PORT in your environment and update the frontend VITE_* URLs to match.`,
    );
    process.exit(1);
    return;
  }

  logError("Server failed to start", error);
  process.exit(1);
});

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

connectDb()
  .then(() => {
    logInfo("Database connected");
    server.listen(PORT, HOST, () => {
      logInfo(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logError("Database connecting error", err);
    process.exit(1);
  });
