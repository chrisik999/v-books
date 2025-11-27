import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import config from "./config/config";
import cookieParser from "cookie-parser";
import compress from "compression";
import { server } from "./server";
import { connectDB, disconnectDB } from "./utils/db";
import { logger } from "./utils/logger";

// src/index.ts

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

// Bootstrap: connect DB then start server
const PORT = config.port;

async function bootstrap() {
  try {
    await connectDB();
    const srv = app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
      server(app);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down...`);
      srv.close(() => logger.info("HTTP server closed"));
      await disconnectDB();
      process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err: any) {
    logger.error("Startup failed", {
      message: err?.message,
      stack: err?.stack,
    });
    process.exit(1);
  }
}

void bootstrap();

// export default app;
