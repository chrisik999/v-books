import { QueryFilter } from "mongoose";
import { userRepository } from "../repositories/user.repository";

export async function getUserById(id: string) {
  return userRepository.getById(id);
}

export async function listUsers(params: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.limit ?? 10)));
  const filter: QueryFilter<any> = {};
  if (params.q) {
    const rx = new RegExp(params.q, "i");
    filter.$or = [
      { email: rx },
      { username: rx },
      { firstName: rx },
      { lastName: rx },
      { phone: rx },
    ];
  }
  return userRepository.list(filter, page, limit);
}

export async function updateUserById(
  id: string,
  update: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
  }>
) {
  try {
    return await userRepository.updateById(id, update);
  } catch (err: any) {
    if (err && err.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0] || "field";
      throw new Error(`${dupField} already exists`);
    }
    throw err;
  }
}

export async function deleteUserById(id: string) {
  return userRepository.deleteById(id);
}
