import {
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../src/services/user.service";
import { userRepository } from "../src/repositories/user.repository";

jest.mock("../src/repositories/user.repository", () => {
  const actual = jest.requireActual("../src/repositories/user.repository");
  return {
    __esModule: true,
    ...actual,
    userRepository: {
      list: jest.fn(async () => ({
        data: [{ id: "u1" }],
        total: 1,
        page: 1,
        limit: 10,
      })),
      getById: jest.fn(async (id: string) =>
        id === "notfound" ? null : ({ id } as any)
      ),
      updateById: jest.fn(async (id: string, _u: any) =>
        id === "notfound" ? null : ({ id } as any)
      ),
      deleteById: jest.fn(async (id: string) =>
        id === "notfound" ? null : ({ id } as any)
      ),
    },
  };
});

describe("User Service", () => {
  test("listUsers returns paginated data", async () => {
    const res = await listUsers({ page: 1, limit: 10 });
    expect(res.total).toBe(1);
    expect(res.data.length).toBe(1);
  });

  test("getUserById returns null when not found", async () => {
    const res = await getUserById("notfound");
    expect(res).toBeNull();
  });

  test("updateUserById returns updated user", async () => {
    const res = await updateUserById("abc", { firstName: "A" });
    expect(res).toEqual({ id: "abc" });
  });

  test("updateUserById throws duplicate error mapped to message", async () => {
    (userRepository.updateById as jest.Mock).mockRejectedValueOnce({
      code: 11000,
      keyPattern: { username: 1 },
    });
    await expect(updateUserById("abc", { username: "taken" })).rejects.toThrow(
      /already exists/
    );
  });

  test("deleteUserById returns null when not found", async () => {
    const res = await deleteUserById("notfound");
    expect(res).toBeNull();
  });
});
