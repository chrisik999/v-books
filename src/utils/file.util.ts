import path from "node:path";
import { promises as fs } from "node:fs";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

export function isWithinUploads(p?: string): boolean {
  if (!p) return false;
  const abs = path.resolve(process.cwd(), p);
  return abs.startsWith(uploadsRoot);
}

export async function safeUnlink(p?: string): Promise<void> {
  if (!p) return;
  if (p.trim() === "") return;
  try {
    const abs = path.resolve(process.cwd(), p);
    if (!abs.startsWith(uploadsRoot)) return;
    await fs.unlink(abs);
  } catch {
    // ignore unlink errors
  }
}

export async function safeUnlinkMany(
  paths: Array<string | undefined>
): Promise<void> {
  await Promise.all(paths.map((p) => safeUnlink(p)));
}
