import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/i, "Invalid id format");

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const bookIdParams = z.object({
  id: objectId,
});

export const createBody = z.object({
  author: z.string().min(1, "author is required"),
  isbn: z.string().min(1, "isbn is required"),
  price: z.coerce.number().min(0, "price cannot be negative"),
  genre: z.string().optional(),
});

export const updateBody = z.object({
  author: z.string().min(1).optional(),
  isbn: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  genre: z.string().optional(),
});

export const deleteManyBody = z.object({
  ids: z.array(objectId).min(1),
});
