import { Wallet, IWallet } from "../models/wallet.model";

export async function getWalletByUserId(
  userId: string
): Promise<IWallet | null> {
  return Wallet.findOne({ user: userId }).exec();
}
