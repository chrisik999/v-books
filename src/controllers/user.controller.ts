import { Request, Response } from "express";
import {
  deleteUserById,
  getUserById,
  listUsers,
  updateUserById,
} from "../services/user.service";

/*
 * Get user controller
 */
export async function getUser(req: Request<{ id: string }>, res: Response) {
  const user = await getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json({ user });
}

/*
 * List users controller
 */
export async function getUsers(req: Request, res: Response) {
  const { page, limit, q } = req.query as any;
  const result = await listUsers({ page, limit, q });
  return res.status(200).json(result);
}

/*
 * Update user controller
 */
export async function updateUser(req: Request<{ id: string }>, res: Response) {
  try {
    const updated = await updateUserById(req.params.id, req.body as any);
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json({ user: updated });
  } catch (err: any) {
    const msg = err?.message || "Update failed";
    const status = /exists/i.test(msg) ? 409 : 400;
    return res.status(status).json({ error: msg });
  }
}

/*
 * Delete user controller
 */
export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  const deleted = await deleteUserById(req.params.id);
  if (!deleted) return res.status(404).json({ error: "User not found" });
  return res.status(200).json({ deleted: true });
}
