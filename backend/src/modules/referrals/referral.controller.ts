import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../config/db';
import { Prisma, ReferralStatus, UserRole } from '@prisma/client';
import { asyncHandler, NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

// Allowed State Machine Matrix
const ALLOWED_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  [ReferralStatus.SUBMITTED]: [ReferralStatus.ACKNOWLEDGED, ReferralStatus.CANCELLED],
  [ReferralStatus.ACKNOWLEDGED]: [
    ReferralStatus.ACCEPTED,
    ReferralStatus.REJECTED,
    ReferralStatus.CANCELLED,
  ],
  [ReferralStatus.ACCEPTED]: [ReferralStatus.ARRIVED],
  [ReferralStatus.ARRIVED]: [ReferralStatus.COMPLETED],
  [ReferralStatus.REJECTED]: [],
  [ReferralStatus.CANCELLED]: [],
  [ReferralStatus.COMPLETED]: [],
};

// Unique referral code generator
const generateReferralCode = (): string => {
  return `REF-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

export const createReferral = async (req: Request, res: Response) => {
  try {
    const { userId, facilityId } = req.user!;
    const { patientName, patientAge, gestationalWeeks, urgency, reason, receivingFacilityId } =
      req.body;

    if (!facilityId) {
      return res
        .status(403)
        .json({
          error: { message: 'Admins without a facility cannot create referrals', status: 403 },
        });
    }

    if (facilityId === receivingFacilityId) {
      return res
        .status(400)
        .json({
          error: { message: 'Referring and receiving facilities cannot be identical', status: 400 },
        });
    }

    const receivingFacility = await prisma.facility.findUnique({
      where: { id: receivingFacilityId },
    });
    if (!receivingFacility) {
      return res
        .status(404)
        .json({ error: { message: 'Receiving facility not found', status: 404 } });
    }

    const referral = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const code = generateReferralCode();

      const newReferral = await tx.referral.create({
        data: {
          referralCode: code,
          patientName,
          patientAge,
          gestationalWeeks,
          urgency,
          reason,
          referringFacilityId: facilityId,
          receivingFacilityId,
          createdByUserId: userId,
          status: ReferralStatus.SUBMITTED,
        },
      });

      await tx.referralStatusHistory.create({
        data: {
          referralId: newReferral.id,
          newStatus: ReferralStatus.SUBMITTED,
          changedByUserId: userId,
          reasonText: 'Referral created and submitted.',
        },
      });

      return newReferral;
    });

    return res.status(201).json({ data: referral });
  } catch (_error) {
    return res.status(500).json({ error: { message: 'Failed to create referral', status: 500 } });
  }
};

export const getOutgoingReferrals = async (req: Request, res: Response) => {
  try {
    const { facilityId, role } = req.user!;

    // Admins can see all if they don't have a facility, otherwise restrict
    const whereClause =
      role === UserRole.ADMIN && !facilityId ? {} : { referringFacilityId: facilityId! };

    const referrals = await prisma.referral.findMany({
      where: whereClause,
      include: {
        receivingFacility: { select: { id: true, name: true, type: true } },
        createdByUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ data: referrals });
  } catch (_error) {
    return res
      .status(500)
      .json({ error: { message: 'Failed to retrieve outgoing referrals', status: 500 } });
  }
};

export const getIncomingReferrals = async (req: Request, res: Response) => {
  try {
    const { facilityId, role } = req.user!;

    const whereClause =
      role === UserRole.ADMIN && !facilityId ? {} : { receivingFacilityId: facilityId! };

    const referrals = await prisma.referral.findMany({
      where: whereClause,
      include: {
        referringFacility: { select: { id: true, name: true, type: true } },
        createdByUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ data: referrals });
  } catch (_error) {
    return res
      .status(500)
      .json({ error: { message: 'Failed to retrieve incoming referrals', status: 500 } });
  }
};

export const updateReferralStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { newStatus, reasonText } = req.body;
    const { userId, facilityId, role } = req.user!;

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) {
      return res.status(404).json({ error: { message: 'Referral record not found', status: 404 } });
    }

    // Role and Tenant Boundary Verification
    if (newStatus === ReferralStatus.CANCELLED) {
      if (role !== UserRole.ADMIN && referral.referringFacilityId !== facilityId) {
        return res
          .status(403)
          .json({
            error: {
              message: 'Only the originating facility or an admin can cancel a referral',
              status: 403,
            },
          });
      }
    } else {
      if (role !== UserRole.ADMIN && referral.receivingFacilityId !== facilityId) {
        return res
          .status(403)
          .json({
            error: {
              message:
                'Unauthorized to perform state changes on incoming referrals for another facility',
              status: 403,
            },
          });
      }
    }

    // State Transition Boundary Logic
    const validTransitions = ALLOWED_TRANSITIONS[referral.status];
    if (!validTransitions.includes(newStatus)) {
      return res.status(400).json({
        error: {
          message: `Invalid status transition from ${referral.status} to ${newStatus}`,
          status: 400,
        },
      });
    }

    // Atomic Status Update with Audit Log
    const updatedReferral = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.referral.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.referralStatusHistory.create({
        data: {
          referralId: id,
          previousStatus: referral.status,
          newStatus,
          changedByUserId: userId,
          reasonText: reasonText || null,
        },
      });

      return updated;
    });

    return res.status(200).json({ data: updatedReferral });
  } catch (_error) {
    return res
      .status(500)
      .json({ error: { message: 'Failed to update status transition', status: 500 } });
  }
};

export const getReferralDetails = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { facilityId, role } = req.user!;

  const referral = await prisma.referral.findUnique({
    where: { id },
    include: {
      referringFacility: true,
      receivingFacility: true,
      createdByUser: { select: { id: true, name: true, email: true } },
      statusHistory: {
        include: { changedByUser: { select: { id: true, name: true, role: true } } },
        orderBy: { timestamp: 'asc' },
      },
    },
  });

  if (!referral) {
    throw new NotFoundError(`Referral with ID ${id} was not found.`);
  }

  // Tenant Isolation Check
  const isAuthorized =
    role === UserRole.ADMIN ||
    referral.referringFacilityId === facilityId ||
    referral.receivingFacilityId === facilityId;

  if (!isAuthorized) {
    throw new ForbiddenError('You are not authorized to view referrals outside your facility.');
  }

  return res.status(200).json({ data: referral });
});

export const getAdminMetrics = asyncHandler(async (_req: Request, res: Response) => {
  // Single DB Query grouping counts by status
  const statusCounts = await prisma.referral.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
  });

  const metricsMap = statusCounts.reduce(
    (acc: any, curr: any) => {
      acc[curr.status] = curr._count._all;
      return acc;
    },
    {} as Record<ReferralStatus, number>,
  );

  const metrics = {
    total: Object.values(metricsMap).reduce(
      (sum: number, count: unknown) => sum + (count as number),
      0,
    ),
    pending: metricsMap[ReferralStatus.SUBMITTED] || 0,
    acknowledged: metricsMap[ReferralStatus.ACKNOWLEDGED] || 0,
    accepted: metricsMap[ReferralStatus.ACCEPTED] || 0,
    arrived: metricsMap[ReferralStatus.ARRIVED] || 0,
    completed: metricsMap[ReferralStatus.COMPLETED] || 0,
    rejected: metricsMap[ReferralStatus.REJECTED] || 0,
    cancelled: metricsMap[ReferralStatus.CANCELLED] || 0,
  };

  return res.status(200).json({ data: metrics });
});
