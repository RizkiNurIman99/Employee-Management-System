import { io } from "socket.io-client";

const socket = io("/", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
