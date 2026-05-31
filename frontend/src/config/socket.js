import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;
const socket = io(socketUrl, {
  path: "/socket.io",
  withCredentials: true,
});

export default socket;
