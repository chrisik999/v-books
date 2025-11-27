import { Wallet, IWallet } from "../models/wallet.model";

export async function getWalletByUserId(
  userId: string
): Promise<IWallet | null> {
  return Wallet.findOne({ user: userId }).exec();
}

export async function setWalletBalance(
  userId: string,
  balance: number
): Promise<IWallet | null> {
  if (balance < 0) throw new Error("Balance cannot be negative");
  return Wallet.findOneAndUpdate(
    { user: userId },
    { $set: { balance } },
    { new: true }
  ).exec();
}

export async function adjustWalletBalance(
  userId: string,
  delta: number
): Promise<IWallet | null> {
  const wallet = await Wallet.findOne({ user: userId }).exec();
  if (!wallet) return null;
  const next = wallet.balance + delta;
  if (next < 0) throw new Error("Insufficient funds");
  wallet.balance = next;
  await wallet.save();
  return wallet;
}
