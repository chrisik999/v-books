import { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { logger, loggerStream } from "./utils/logger";
import { setupSwagger } from "./swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import walletRoutes from "./routes/wallet.routes";

function server(app: Express) {
  logger.info("Setting up server routes and middleware");

  // HTTP access logs via morgan -> winston
  morgan.token("req-id", (req) => (req as any).id || "-");
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms reqId=:req-id",
      {
        stream: loggerStream,
      }
    )
  );

  // Middleware example: simple request logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // Swagger UI at /docs and raw spec at /openapi.json
  setupSwagger(app);

  // Simple typed request handlers
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from Express + TypeScript" });
  });

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Auth routes
  app.use("/api/auth", authRoutes);
  // User routes
  app.use("/api/users", userRoutes);
  // Book routes
  app.use("/api/books", bookRoutes);
  // Wallet routes
  app.use("/api/wallet", walletRoutes);

  // Basic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || 500;
    logger.error("Unhandled error", {
      status,
      message: err?.message,
      stack: err?.stack,
    });
    res.status(status).json({ error: err?.message || "Internal Server Error" });
  });
}

export { server };
