import { z } from "zod";

export const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/u, "Invalid id");

export const userIdParams = z.object({ id: objectId });

export const listQuery = z.object({
  page: z.preprocess((v) => Number(v), z.number().int().min(1)).optional(),
  limit: z
    .preprocess((v) => Number(v), z.number().int().min(1).max(100))
    .optional(),
  q: z.string().min(1).optional(),
});

export const updateBody = z
  .object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(/^[+[\d][\d\s-]*$/u, "Invalid phone format")
      .optional(),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/)
      .optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });
