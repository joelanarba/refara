import { Request, Response } from 'express';
import { ReferralStatus, Role } from '@prisma/client';
import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

// Allowed State Machine Matrix
const ALLOWED_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  [ReferralStatus.SUBMITTED]: [ReferralStatus.ACKNOWLEDGED, ReferralStatus.CANCELLED],
  [ReferralStatus.ACKNOWLEDGED]: [ReferralStatus.ACCEPTED, ReferralStatus.REJECTED],
  [ReferralStatus.ACCEPTED]: [ReferralStatus.PATIENT_ARRIVED, ReferralStatus.REJECTED],
  [ReferralStatus.PATIENT_ARRIVED]: [ReferralStatus.COMPLETED],
  [ReferralStatus.REJECTED]: [],
  [ReferralStatus.CANCELLED]: [],
  [ReferralStatus.COMPLETED]: [],
};

// Unique referral code generator: REF-2026-XXXX
const generateReferralCode = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REF-${new Date().getFullYear()}-${random}`;
};

export const createReferral = async (req: Request, res: Response) => {
  try {
    const { userId, facilityId } = req.user!;
    const { patientName, patientAge, gestationalAgeWeeks, urgency, reasonForReferral, receivingFacilityId } = req.body;

    if (facilityId === receivingFacilityId) {
      return res.status(400).json({ error: 'Referring and receiving facilities cannot be identical' });
    }

    const receivingFacility = await prisma.facility.findUnique({ where: { id: receivingFacilityId } });
    if (!receivingFacility) {
      return res.status(404).json({ error: 'Receiving facility not found' });
    }

    // ACID Transaction for Referral Creation + Audit History Initialization
    const referral = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const code = generateReferralCode();

      const newReferral = await tx.referral.create({
        data: {
          referralCode: code,
          patientName,
          patientAge,
          gestationalAgeWeeks,
          urgency,
          reasonForReferral,
          referringFacilityId: facilityId,
          receivingFacilityId,
          createdByUserId: userId,
          currentStatus: ReferralStatus.SUBMITTED,
        },
      });

      await tx.referralStatusHistory.create({
        data: {
          referralId: newReferral.id,
          previousStatus: ReferralStatus.SUBMITTED,
          newStatus: ReferralStatus.SUBMITTED,
          changedByUserId: userId,
          notes: 'Referral created and submitted.',
        },
      });

      return newReferral;
    });

    return res.status(201).json(referral);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create referral' });
  }
};

export const getOutgoingReferrals = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.user!;

    const referrals = await prisma.referral.findMany({
      where: { referringFacilityId: facilityId },
      include: {
        receivingFacility: { select: { id: true, name: true, facilityType: true } },
        createdByUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(referrals);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve outgoing referrals' });
  }
};

export const getIncomingReferrals = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.user!;

    const referrals = await prisma.referral.findMany({
      where: { receivingFacilityId: facilityId },
      include: {
        referringFacility: { select: { id: true, name: true, facilityType: true } },
        createdByUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(referrals);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve incoming referrals' });
  }
};


export const updateReferralStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newStatus, notes } = req.body;
    const { userId, facilityId, role } = req.user!;

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) {
      return res.status(404).json({ error: 'Referral record not found' });
    }

    // Role and Tenant Boundary Verification
    if (newStatus === ReferralStatus.CANCELLED) {
      if (referral.referringFacilityId !== facilityId) {
        return res.status(403).json({ error: 'Only the originating facility can cancel a referral' });
      }
    } else {
      if (referral.receivingFacilityId !== facilityId && role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Unauthorized to perform state changes on incoming referrals for another facility' });
      }
    }

    // State Transition Boundary Logic
    const validTransitions = ALLOWED_TRANSITIONS[referral.currentStatus];
    if (!validTransitions.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid status transition from ${referral.currentStatus} to ${newStatus}`,
        allowedNextStatuses: validTransitions,
      });
    }

    // Atomic Status Update with Audit Log
    const updatedReferral = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.referral.update({
        where: { id },
        data: { currentStatus: newStatus },
      });

      await tx.referralStatusHistory.create({
        data: {
          referralId: id,
          previousStatus: referral.currentStatus,
          newStatus,
          changedByUserId: userId,
          notes: notes || null,
        },
      });

      return updated;
    });

    return res.status(200).json(updatedReferral);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update status transition' });
  }
};

export const getReferralDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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
      role === Role.ADMIN ||
      referral.referringFacilityId === facilityId ||
      referral.receivingFacilityId === facilityId;

    if (!isAuthorized) {
      throw new BadRequestError('You are not authorized to view referrals outside your facility.');
    }

    return res.status(200).json(referral);
});

export const getAdminMetrics = asyncHandler(async (_req: Request, res: Response) => {
  // Single DB Query grouping counts by currentStatus
  const statusCounts = await prisma.referral.groupBy({
    by: ['currentStatus'],
    _count: {
      _all: true,
    },
  });

  // Map database counts into a clean key-value object
  const metricsMap = statusCounts.reduce((acc: { [x: string]: any; }, curr: { currentStatus: string | number; _count: { _all: any; }; }) => {
    acc[curr.currentStatus] = curr._count._all;
    return acc;
  }, {} as Record<ReferralStatus, number>);

  const metrics = {
    total: Object.values(metricsMap).reduce((sum, count) => sum + count, 0),
    pending: metricsMap[ReferralStatus.SUBMITTED] || 0,
    acknowledged: metricsMap[ReferralStatus.ACKNOWLEDGED] || 0,
    accepted: metricsMap[ReferralStatus.ACCEPTED] || 0,
    completed: metricsMap[ReferralStatus.COMPLETED] || 0,
    rejected: metricsMap[ReferralStatus.REJECTED] || 0,
    cancelled: metricsMap[ReferralStatus.CANCELLED] || 0,
  };

  return res.status(200).json({ metrics });
});