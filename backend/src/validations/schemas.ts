import { z } from 'zod';
import {Role, ReferralUrgency, ReferralStatus} from '@prisma/client';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
  role: z.nativeEnum(Role),
  facilityId: z.string().uuid().optional().nullable(),
}).refine((data) => {
  // Enforce facilityId for non-admin users
  if (data.role !== Role.ADMIN && !data.facilityId) {
    return false;
  }
  return true;
}, {
  message: "facilityId is required for REFERRING_WORKER and RECEIVING_WORKER roles",
  path: ["facilityId"],
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