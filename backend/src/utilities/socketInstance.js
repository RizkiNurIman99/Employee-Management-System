import { logInfo, logWarn } from "./logger.js";

let ioInstance;

export const setSocketInstance = (io) => {
  ioInstance = io;
  logInfo("Socket.IO instance set");
};

export const emitSocketEvent = (eventName, data) => {
  if (process.env.DISABLE_SOCKET === "true") return;
  if (!ioInstance) {
    logWarn("Socket.IO instance is not set. Cannot emit event.");
    return;
  }

  ioInstance.emit(eventName, data);
  logInfo(`Event emitted: "${eventName}"`, data);
};

export const emitEvent = (eventName, data) => {
  emitSocketEvent(eventName, data);
};
