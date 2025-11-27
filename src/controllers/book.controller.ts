import { Request, Response } from "express";
import path from "path";
import {
  createBook,
  listBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  deleteBooksByIds,
} from "../services/book.service";

function getRole(req: Request): string {
  const role = (req as any).user?.role || "USER";
  return String(role).toUpperCase();
}

function getUserId(req: Request): string | null {
  const sub = (req as any).user?.sub;
  return sub ? String(sub) : null;
}

export async function createBookHandler(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { author, isbn, price, genre } = req.body as any;
  const image = (req as any).files?.image?.[0];
  const pdf = (req as any).files?.pdf?.[0];

  try {
    const doc = await createBook({
      author,
      isbn,
      price,
      genre,
      uploadedBy: userId as any,
      imagePath: image
        ? path.join("uploads", "images", path.basename(image.path))
        : undefined,
      pdfPath: pdf
        ? path.join("uploads", "pdfs", path.basename(pdf.path))
        : undefined,
    } as any);
    return res.status(201).json({ book: doc });
  } catch (err: any) {
    const msg =
      err?.code === 11000
        ? "isbn already exists"
        : err?.message || "Failed to create book";
    const status = err?.code === 11000 ? 409 : 400;
    return res.status(status).json({ error: msg });
  }
}

export async function listBooksHandler(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const result = await listBooks({ page, limit });
  return res.json(result);
}

export async function getBookHandler(req: Request, res: Response) {
  const { id } = req.params;
  const book = await getBookById(id);
  if (!book) return res.status(404).json({ error: "Not found" });
  return res.json({ book });
}

export async function updateBookHandler(req: Request, res: Response) {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const role = getRole(req);

  const current = await getBookById(id);
  if (!current) return res.status(404).json({ error: "Not found" });
  const isOwner = String(current.uploadedBy) === String(userId);
  if (!isOwner && role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const { author, isbn, price, genre } = req.body as any;
  const image = (req as any).files?.image?.[0];
  const pdf = (req as any).files?.pdf?.[0];

  const updates: any = {};
  if (author !== undefined) updates.author = author;
  if (isbn !== undefined) updates.isbn = isbn;
  if (price !== undefined) updates.price = price;
  if (genre !== undefined) updates.genre = genre;
  if (image)
    updates.imagePath = path.join(
      "uploads",
      "images",
      path.basename(image.path)
    );
  if (pdf)
    updates.pdfPath = path.join("uploads", "pdfs", path.basename(pdf.path));

  try {
    const updated = await updateBookById(id, updates);
    return res.json({ book: updated });
  } catch (err: any) {
    const msg =
      err?.code === 11000
        ? "isbn already exists"
        : err?.message || "Failed to update book";
    const status = err?.code === 11000 ? 409 : 400;
    return res.status(status).json({ error: msg });
  }
}

export async function deleteBookHandler(req: Request, res: Response) {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const role = getRole(req);

  const current = await getBookById(id);
  if (!current) return res.status(404).json({ error: "Not found" });
  const isOwner = String(current.uploadedBy) === String(userId);
  if (!isOwner && role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  await deleteBookById(id);
  return res.json({ deleted: true });
}

export async function deleteBooksManyHandler(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const role = getRole(req);

  const ids = (req.body?.ids || []) as string[];
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: "ids required" });

  if (role !== "ADMIN") {
    // Non-admin may only delete own books; filter ids
    const own = await Promise.all(
      ids.map(async (id) => {
        const b = await getBookById(id);
        return b && String(b.uploadedBy) === String(userId) ? id : null;
      })
    );
    const filtered = own.filter(Boolean) as string[];
    const result = await deleteBooksByIds(filtered);
    return res.json({ deletedCount: result.deletedCount });
  } else {
    const result = await deleteBooksByIds(ids);
    return res.json({ deletedCount: result.deletedCount });
  }
}
