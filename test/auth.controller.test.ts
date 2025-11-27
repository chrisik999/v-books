// Mocks must be declared before importing controller to ensure they apply.
jest.mock("../src/services/auth.service", () => ({
  __esModule: true,
  createUser: jest.fn(),
  validateCredentials: jest.fn(),
}));

jest.mock("../src/models/wallet.model", () => ({
  __esModule: true,
  Wallet: {
    findOne: jest.fn(async () => ({ id: "w1", user: "u1", balance: 20 })),
  },
}));

jest.mock("../src/utils/jwt.util", () => ({
  __esModule: true,
  signAccessToken: jest.fn(async () => "mock-token"),
}));

import { register, login } from "../src/controllers/auth.controller";

import { createUser, validateCredentials } from "../src/services/auth.service";
import { signAccessToken } from "../src/utils/jwt.util";

function mockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.status = jest.fn((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((body: any) => {
    res.body = body;
    return res;
  });
  return res;
}

describe("Auth Controller - register", () => {
  test("201 created with user payload (no passwordHash)", async () => {
    const req: any = {
      body: {
        email: "test@example.com",
        phone: "+15551234567",
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        password: "secret123",
      },
    };
    const res = mockRes();

    (createUser as jest.Mock).mockResolvedValue({
      toObject: () => ({
        id: "u1",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hashed",
      }),
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.body.user).toMatchObject({
      id: "u1",
      email: "test@example.com",
      username: "testuser",
    });
    expect(res.body.user).not.toHaveProperty("passwordHash");
    expect(res.body.wallet).toMatchObject({ user: "u1", balance: 20 });
  });

  test("409 on duplicate field", async () => {
    const req: any = {
      body: {
        email: "dup@example.com",
        phone: "+15551234567",
        firstName: "Test",
        lastName: "User",
        username: "dup",
        password: "secret123",
      },
    };
    const res = mockRes();

    (createUser as jest.Mock).mockRejectedValue(
      new Error("email already exists")
    );

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Auth Controller - login", () => {
  test("200 returns JWT token", async () => {
    const req: any = {
      body: { usernameOrEmail: "testuser", password: "secret123" },
    };
    const res = mockRes();

    (validateCredentials as jest.Mock).mockResolvedValue({
      id: "u1",
      username: "testuser",
    });
    (signAccessToken as jest.Mock).mockResolvedValue("mock-token");

    await login(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.body).toEqual({ token: "mock-token" });
  });

  test("401 on invalid credentials", async () => {
    const req: any = {
      body: { usernameOrEmail: "testuser", password: "wrong" },
    };
    const res = mockRes();

    (validateCredentials as jest.Mock).mockResolvedValue(null);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body).toHaveProperty("error");
  });
});
