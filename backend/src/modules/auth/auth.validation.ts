import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
  role: z.nativeEnum(UserRole),
  facilityId: z.string().uuid().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});
