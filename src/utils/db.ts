import mongoose from "mongoose";
import config from "../config/config";
import { logger } from "./logger";

export async function connectDB(uri: string = config.databaseUrl) {
  if (!uri) {
    logger.error("DATABASE_URL is not set. Define it in your environment.");
    throw new Error("Missing DATABASE_URL");
  }
  try {
    logger.info("Connecting to database...");
    await mongoose.connect(uri);
    logger.info("Database connected");

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database disconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("Database connection error", {
        message: err.message,
        stack: err.stack,
      });
    });
  } catch (err: any) {
    logger.error("Database initial connection failed", {
      message: err?.message,
      stack: err?.stack,
    });
    throw err;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info("Database connection closed");
  } catch (err: any) {
    logger.error("Error closing database connection", {
      message: err?.message,
      stack: err?.stack,
    });
  }
}
