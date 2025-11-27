import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().max(254),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d][\d\s-]*$/u, 'Invalid phone format'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric and underscore'),
  password: z.string().min(6).max(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1).max(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
