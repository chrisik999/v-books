import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import config from "./config/config";
import cookieParser from "cookie-parser";
import compress from "compression";
import morgan from "morgan";
import { server } from "./server";

// src/index.ts

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  server(app);
});

// export default app;
