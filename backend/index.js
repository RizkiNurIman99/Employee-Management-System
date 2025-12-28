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

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

setSocketInstance(io);
app.use(express.json());
app.use(cors());

app.use("/avatar", express.static("assets/avatar"));

app.use("/api", router);
app.use("/", rfidRoutes);
app.use("/", employeeRoutes);
app.use("/", attendanceRoutes);

app.get("/api/secure", protect, (req, res) => {
  res.json({ message: "Anda berhasil masuk", user: req.user });
});

app.get("/emittest", (req, res) => {
  emitSocketEvent("uid-detected", "Test123456");
  res.send("Test UID emitted");
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
connectDb().then(() => {
  server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
  });
});
