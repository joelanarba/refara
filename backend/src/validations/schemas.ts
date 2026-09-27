import { z } from 'zod';
import {Role, ReferralUrgency, ReferralStatus} from '@prisma/client';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: "Password must contain uppercase, lowercase, number, and special character",
    }),
  role: z.nativeEnum(Role),
  facilityId: z.string().uuid(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

export const createReferralSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  patientAge: z.number().int().min(10).max(65),
  gestationalAgeWeeks: z.number().int().min(1).max(45),
  urgency: z.nativeEnum(ReferralUrgency),
  reasonForReferral: z.string().trim().min(5).max(2000),
  receivingFacilityId: z.string().uuid(),
});

export const updateStatusSchema = z.object({
  newStatus: z.nativeEnum(ReferralStatus),
  notes: z.string().trim().max(1000).optional(),
});