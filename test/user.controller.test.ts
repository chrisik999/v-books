import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../src/controllers/user.controller";

jest.mock("../src/services/user.service", () => ({
  __esModule: true,
  listUsers: jest.fn(async () => ({
    data: [{ id: "u1" }],
    total: 1,
    page: 1,
    limit: 10,
  })),
  getUserById: jest.fn(async (id: string) =>
    id === "notfound" ? null : ({ id } as any)
  ),
  updateUserById: jest.fn(async (id: string, _u: any) =>
    id === "notfound" ? null : ({ id } as any)
  ),
  deleteUserById: jest.fn(async (id: string) =>
    id === "notfound" ? null : ({ id } as any)
  ),
}));

function mockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: any) => {
    res.body = payload;
    return res;
  };
  return res;
}

describe("User Controller", () => {
  test("getUsers returns 200 with data", async () => {
    const req: any = { query: { page: 1, limit: 10 } };
    const res = mockRes();
    await getUsers(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  test("getUser returns 404 when not found", async () => {
    const req: any = { params: { id: "notfound" } };
    const res = mockRes();
    await getUser(req, res);
    expect(res.statusCode).toBe(404);
  });

  test("updateUser returns 200 when updated", async () => {
    const req: any = { params: { id: "abc" }, body: { firstName: "A" } };
    const res = mockRes();
    await updateUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("updateUser returns 404 when not found", async () => {
    const req: any = { params: { id: "notfound" }, body: { firstName: "A" } };
    const res = mockRes();
    await updateUser(req, res);
    expect(res.statusCode).toBe(404);
  });

  test("deleteUser returns 200 when deleted", async () => {
    const req: any = { params: { id: "abc" } };
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  test("deleteUser returns 404 when not found", async () => {
    const req: any = { params: { id: "notfound" } };
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.statusCode).toBe(404);
  });
});
