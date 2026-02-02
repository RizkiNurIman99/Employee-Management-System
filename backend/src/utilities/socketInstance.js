let ioInstance;
export const setSocketInstance = (io) => {
  ioInstance = io;
  console.log("Socket.IO instance set in socketInstance");
};

export const emitSocketEvent = (eventName, data) => {
  if (ioInstance) {
    ioInstance.emit(eventName, data);
    console.log(`Event emitted: "${eventName}" with data:`, data);
  } else {
    console.warn("Socket.IO instance is not set. Cannot emit event.");
  }
};

export const emitEvent = (event, payload) => {
  if (process.env.DISABLE_SOCKET === "true") return;
  if (!ioInstance) return;

  ioInstance.emit(event, payload);
};
