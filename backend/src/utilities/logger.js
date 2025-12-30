const isProd = process.env.NODE_ENV === "production";

export const logInfo = (...arg) => {
  if (!isProd) console.log("[info]", ...arg);
};

export const logWarn = (...args) => {
  console.warn("[WARN]", ...args);
};

export const logError = (...args) => {
  console.error("[ERROR]", ...args);
};
