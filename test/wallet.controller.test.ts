import { getMyWallet } from "../src/controllers/wallet.controller";

jest.mock("../src/services/wallet.service", () => ({
  __esModule: true,
  getWalletByUserId: jest.fn(async (userId: string) =>
    userId === "no-wallet"
      ? null
      : ({ id: "w1", user: userId, balance: 20 } as any)
  ),
}));

import { getWalletByUserId } from "../src/services/wallet.service";

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

describe("Wallet Controller - getMyWallet", () => {
  test("401 when payload missing", async () => {
    const req: any = { user: null };
    const res = mockRes();
    await getMyWallet(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body).toHaveProperty("error");
  });

  test("404 when wallet not found", async () => {
    const req: any = { user: { sub: "no-wallet" } };
    const res = mockRes();
    await getMyWallet(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toHaveProperty("error");
  });

  test("200 returns wallet", async () => {
    const req: any = { user: { sub: "u1" } };
    const res = mockRes();
    (getWalletByUserId as jest.Mock).mockResolvedValue({
      id: "w1",
      user: "u1",
      balance: 20,
    });
    await getMyWallet(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.body.wallet).toMatchObject({ user: "u1", balance: 20 });
  });
});
