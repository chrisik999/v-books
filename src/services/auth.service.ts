import bcrypt from "bcrypt";
import { User, IUser } from "../models/user.model";
import { RegisterInput } from "../schemas/auth.schema";
import { logger } from "../utils/logger";

const SALT_ROUNDS = 10;

export async function createUser(input: RegisterInput): Promise<IUser> {
  const { password, ...rest } = input;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const doc = await User.create({ ...rest, passwordHash });
    return doc;
  } catch (err: any) {
    // Handle duplicate key errors from Mongo (E11000)
    if (err && err.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0] || "field";
      throw new Error(`${dupField} already exists`);
    }
    logger.error("Error creating user", { message: err?.message });
    throw err;
  }
}

export async function validateCredentials(
  usernameOrEmail: string,
  password: string
): Promise<IUser | null> {
  const user = await User.findOne({
    $or: [
      { email: usernameOrEmail.toLowerCase() },
      { username: usernameOrEmail.toLowerCase() },
    ],
  }).exec();

  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
