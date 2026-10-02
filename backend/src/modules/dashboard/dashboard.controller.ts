import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../middleware/errorHandler';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const { scope } = req.params;
  const user = req.user!;
  
  let facilityIdFilter = undefined;
  if (scope === 'facility') {
    if (!user.facilityId) {
      res.status(400).json({ error: { message: 'User does not belong to a facility', status: 400 } });
      return;
    }
    // A referral belongs to a facility if they are the referrer or receiver
    facilityIdFilter = {
      OR: [
        { referringFacilityId: user.facilityId },
        { receivingFacilityId: user.facilityId }
      ]
    };
  }

  const [total, pending, completed, urgent] = await Promise.all([
    prisma.referral.count({ where: facilityIdFilter }),
    prisma.referral.count({
      where: {
        ...facilityIdFilter,
        status: { in: ['SUBMITTED', 'ACKNOWLEDGED', 'ACCEPTED', 'ARRIVED'] }
      }
    }),
    prisma.referral.count({
      where: {
        ...facilityIdFilter,
        status: 'COMPLETED'
      }
    }),
    prisma.referral.count({
      where: {
        ...facilityIdFilter,
        urgency: { in: ['URGENT', 'EMERGENCY'] }
      }
    }),
  ]);

  let totalFacilities, totalUsers;
  if (scope === 'network') {
    [totalFacilities, totalUsers] = await Promise.all([
      prisma.facility.count(),
      prisma.user.count()
    ]);
  }

  res.json({
    totalReferrals: total,
    totalReferralsChangePct: null, // MVP: No historical comparison yet
    pendingAction: pending,
    completed: completed,
    completedChangePct: null,
    urgentCases: urgent,
    ...(scope === 'network' && { totalFacilities, totalUsers })
  });
});

export const getRecentReferrals = asyncHandler(async (req: Request, res: Response) => {
  const { scope } = req.params;
  const user = req.user!;
  
  let facilityIdFilter = undefined;
  if (scope === 'facility') {
    if (!user.facilityId) {
      res.status(400).json({ error: { message: 'User does not belong to a facility', status: 400 } });
      return;
    }
    facilityIdFilter = {
      OR: [
        { referringFacilityId: user.facilityId },
        { receivingFacilityId: user.facilityId }
      ]
    };
  }

  const referrals = await prisma.referral.findMany({
    where: facilityIdFilter,
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      referringFacility: true,
      receivingFacility: true
    }
  });

  const formatted = referrals.map((r: any) => {
    const initials = r.patientName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
    return {
      id: r.id,
      code: r.referralCode,
      patientInitials: initials,
      patientName: r.patientName,
      patientAge: r.patientAge,
      reason: r.reason,
      referringFacilityName: r.referringFacility.name,
      receivingFacilityName: r.receivingFacility.name,
      urgency: r.urgency,
      status: r.status,
      createdAt: r.createdAt
    };
  });

  res.json(formatted);
});

export const getReferralActivity = asyncHandler(async (req: Request, res: Response) => {
    const points = [3, 5, 4, 7, 6, 8, 6, 9, 8, 11, 9, 12, 10, 13].map((count, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
    count,
  }));
  
  res.json({
    points,
    changePct: 18.4
  });
});

