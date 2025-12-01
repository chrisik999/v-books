// Mocks must be set up before importing the route module
jest.mock("../src/middleware/auth.middleware", () => ({
  __esModule: true,
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { sub: "u1" };
    next();
  },
}));

jest.mock("../src/services/book.service", () => ({
  __esModule: true,
  listBooksByUser: jest.fn(async (_userId: string, _q: any) => ({
    data: [
      {
        id: "b1",
        author: "Jane Doe",
        isbn: "9781234567890",
        price: 9.99,
        uploadedBy: { id: "u1", firstName: "A", lastName: "B" },
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  })),
}));

import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compress from "compression";
import bookRoutes from "../src/routes/book.routes";

describe("Book Routes - mine", () => {
  function makeApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(compress());
    app.use("/api/books", bookRoutes);
    return app;
  }

  test("GET /api/books/mine -> 200 list", async () => {
    const app = makeApp();
    const res = await request(app).get("/api/books/mine?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data[0]).toMatchObject({ uploadedBy: { id: "u1" } });
  });
});
