import { z } from 'zod';
import { ReferralUrgency, ReferralStatus } from '@prisma/client';

export const createReferralSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  patientAge: z.number().int().min(10).max(65),
  gestationalWeeks: z.number().int().min(1).max(45).optional().nullable(),
  urgency: z.nativeEnum(ReferralUrgency),
  reason: z.string().trim().min(5).max(2000),
  receivingFacilityId: z.string().uuid(),
});

export const updateStatusSchema = z
  .object({
    newStatus: z.nativeEnum(ReferralStatus),
    reasonText: z.string().trim().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (
        data.newStatus === ReferralStatus.REJECTED ||
        data.newStatus === ReferralStatus.CANCELLED
      ) {
        return !!data.reasonText && data.reasonText.trim().length > 0;
      }
      return true;
    },
    {
      message: 'reasonText is strictly required when REJECTED or CANCELLED',
      path: ['reasonText'],
    },
  );
