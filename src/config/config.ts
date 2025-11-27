import * as dotenv from "dotenv";

dotenv.config(); // loads .env into process.env

type NodeEnv = "development" | "production" | "test" | string;

function requiredEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required environment variable: ${key}`);
  return v;
}

export const config = {
  nodeEnv: (process.env.NODE_ENV ?? "development") as NodeEnv,
  port: Number(process.env.PORT ?? 3000),
  // example of a required variable - will throw if not set
  databaseUrl: process.env.DATABASE_URL ?? "",
  logLevel: process.env.LOG_LEVEL ?? "info",
  // utility to access required envs at runtime
  require: requiredEnv,
};

export default config;
