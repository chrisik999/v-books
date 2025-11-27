import { Request, Response } from "express";
import { createUser, validateCredentials } from "../services/auth.service";
import { Wallet } from "../models/wallet.model";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { signAccessToken } from "../utils/jwt.util";

/*
 * User registration controller
 *
 * Handles user registration by creating a new user in the database.
 * It hashes the password and ensures no sensitive information is returned.
 */
export async function register(
  req: Request<unknown, unknown, RegisterInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    const { passwordHash, ...safe } = user.toObject();
    // Retrieve wallet (created during service) to include in response if exists
    const walletDoc = await Wallet.findOne({ user: user._id });
    const wallet =
      walletDoc && typeof (walletDoc as any).toObject === "function"
        ? (walletDoc as any).toObject()
        : walletDoc;
    return res.status(201).json({ user: safe, wallet });
  } catch (err: any) {
    const msg = err?.message || "Registration failed";
    const status = /exists/i.test(msg) ? 409 : 400;
    return res.status(status).json({ error: msg });
  }
}

/*
 * User login controller
 *
 * Handles user login by validating credentials and returns a JWT token.
 */
export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response
) {
  const { usernameOrEmail, password } = req.body;
  const user = await validateCredentials(usernameOrEmail, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = await signAccessToken({
    sub: String(user._id),
    username: user.username,
  });
  return res.json({ token });
}
