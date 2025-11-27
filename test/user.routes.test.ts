import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compress from "compression";
import userRoutes from "../src/routes/user.routes";

// Bypass Zod validation in route tests to focus on controller wiring
jest.mock("../src/middleware/validate", () => ({
  __esModule: true,
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

// Bypass auth middleware for route tests (avoid ESM jose import under Jest)
jest.mock("../src/middleware/auth.middleware", () => ({
  __esModule: true,
  requireAuth: (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../src/services/user.service", () => ({
  __esModule: true,
  getUserById: jest.fn(async (id) =>
    id === "notfound" ? null : { id, username: "u" }
  ),
  listUsers: jest.fn(async () => ({
    data: [{ id: "u1" }],
    total: 1,
    page: 1,
    limit: 10,
  })),
  updateUserById: jest.fn(async (id, _u) =>
    id === "notfound" ? null : { id, username: "u2" }
  ),
  deleteUserById: jest.fn(async (id) => (id === "notfound" ? null : { id })),
}));

function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use("/api/users", userRoutes);
  return app;
}

describe("User Routes (supertest)", () => {
  test("GET /api/users -> 200 list", async () => {
    const app = makeApp();
    const res = await request(app).get("/api/users?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  test("GET /api/users/:id -> 200 user", async () => {
    const app = makeApp();
    const res = await request(app).get("/api/users/0123456789abcdef01234567");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("GET /api/users/:id -> 404 not found", async () => {
    const app = makeApp();
    const res = await request(app).get("/api/users/notfound");
    expect(res.status).toBe(404);
  });

  test("PATCH /api/users/:id -> 200 updated", async () => {
    const app = makeApp();
    const res = await request(app)
      .patch("/api/users/0123456789abcdef01234567")
      .send({ firstName: "New" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("DELETE /api/users/:id -> 200 deleted", async () => {
    const app = makeApp();
    const res = await request(app).delete(
      "/api/users/0123456789abcdef01234567"
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});
