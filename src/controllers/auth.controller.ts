import { Request, Response } from "express";
import { createUser, validateCredentials } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { signAccessToken } from "../utils/jwt.util";

export async function register(
  req: Request<unknown, unknown, RegisterInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    const { passwordHash, ...safe } = user.toObject();
    return res.status(201).json({ user: safe });
  } catch (err: any) {
    const msg = err?.message || "Registration failed";
    const status = /exists/i.test(msg) ? 409 : 400;
    return res.status(status).json({ error: msg });
  }
}

export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response
) {
  const { usernameOrEmail, password } = req.body;
  const user = await validateCredentials(usernameOrEmail, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = await signAccessToken({
    sub: user.id,
    username: user.username,
  });
  return res.json({ token });
}
