import { Request, Response } from "express";
import { getWalletByUserId } from "../services/wallet.service";

export async function getMyWallet(req: Request, res: Response) {
  const payload = (req as any).user;
  const userId = payload?.sub as string;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const wallet = await getWalletByUserId(userId);
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  return res.json({ wallet });
}
