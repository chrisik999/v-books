import winston from "winston";

const { combine, timestamp, json, errors } = winston.format;

// Create a Winston logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

// Morgan stream adapter
export const loggerStream = {
  write: (message: string) => {
    // morgan appends a newline; trim to avoid double spacing
    logger.http(message.trim());
  },
};
