import { Express, NextFunction, Request, Response } from "express";

function server(app: Express) {
  console.log("Setting up server routes and middleware");

  // Middleware example: simple request logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
  // Simple typed request handlers
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from Express + TypeScript" });
  });

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Basic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = err?.status || 500;
    res.status(status).json({ error: err?.message || "Internal Server Error" });
  });
}

export { server };
