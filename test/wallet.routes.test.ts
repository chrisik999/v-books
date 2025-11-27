// Place mocks before importing route module
jest.mock("../src/middleware/auth.middleware", () => ({
  __esModule: true,
  requireAuth: (_req: any, _res: any, next: any) => {
    // Attach a fake JWT payload to request
    (_req as any).user = { sub: "u1" };
    next();
  },
}));

jest.mock("../src/services/wallet.service", () => ({
  __esModule: true,
  getWalletByUserId: jest.fn(async (userId: string) => ({
    id: "w1",
    user: userId,
    balance: 20,
  })),
}));

import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compress from "compression";
import walletRoutes from "../src/routes/wallet.routes";
import { getWalletByUserId } from "../src/services/wallet.service";

function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use("/api/wallet", walletRoutes);
  return app;
}

describe("Wallet Routes (supertest)", () => {
  test("GET /api/wallet -> 200 wallet", async () => {
    const app = makeApp();
    const res = await request(app).get("/api/wallet");
    expect(res.status).toBe(200);
    expect(res.body.wallet).toMatchObject({ user: "u1", balance: 20 });
  });

  test("GET /api/wallet -> 404 when service returns null", async () => {
    (getWalletByUserId as jest.Mock).mockResolvedValueOnce(null);
    const app = makeApp();
    const res = await request(app).get("/api/wallet");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
