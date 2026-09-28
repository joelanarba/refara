import { ReferralStatus, Role, ReferralUrgency, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../middleware/errorHandler';

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

const generateReferralCode = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REF-${new Date().getFullYear()}-${random}`;
};

export interface CreateReferralDTO {
  patientName: string;
  patientAge: number;
  gestationalAgeWeeks: number;
  urgency: ReferralUrgency;
  reasonForReferral: string;
  receivingFacilityId: string;
}

export interface UpdateStatusDTO {
  newStatus: ReferralStatus;
  notes?: string;
}

export class ReferralService {
  static async createReferral(
    dto: CreateReferralDTO,
    userId: string,
    facilityId: string,
  ) {
    if (facilityId === dto.receivingFacilityId) {
      throw new BadRequestError('Referring and receiving facilities cannot be identical');
    }

    const receivingFacility = await prisma.facility.findUnique({
      where: { id: dto.receivingFacilityId },
    });
    if (!receivingFacility) {
      throw new NotFoundError('Receiving facility not found');
    }

    // ACID Transaction: Create Referral + Initial Audit Log
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const referralCode = generateReferralCode();

      const newReferral = await tx.referral.create({
        data: {
          referralCode,
          patientName: dto.patientName,
          patientAge: dto.patientAge,
          gestationalAgeWeeks: dto.gestationalAgeWeeks,
          urgency: dto.urgency,
          reasonForReferral: dto.reasonForReferral,
          referringFacilityId: facilityId,
          receivingFacilityId: dto.receivingFacilityId,
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
  }

  static async getOutgoingReferrals(facilityId: string | null, role: Role) {
    if (role === Role.ADMIN) {
      // Global admin views all outgoing referrals across facilities
      return prisma.referral.findMany({
        include: {
          referringFacility: { select: { id: true, name: true, facilityType: true } },
          receivingFacility: { select: { id: true, name: true, facilityType: true } },
          createdByUser: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!facilityId) throw new BadRequestError('Facility ID required for healthcare worker');

    return prisma.referral.findMany({
      where: { referringFacilityId: facilityId },
      include: {
        receivingFacility: { select: { id: true, name: true, facilityType: true } },
        createdByUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getIncomingReferrals(facilityId: string | null, role: Role) {
    if (role === Role.ADMIN) {
      // Global ADMIN: Return all incoming/transferred referrals system-wide
      return prisma.referral.findMany({
        include: {
          referringFacility: { select: { id: true, name: true, facilityType: true } },
          receivingFacility: { select: { id: true, name: true, facilityType: true } },
          createdByUser: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Healthcare Workers: Enforce facility membership
    if (!facilityId) {
      throw new BadRequestError('Facility ID required for healthcare worker');
    }

    return prisma.referral.findMany({
      where: { receivingFacilityId: facilityId },
      include: {
        referringFacility: { select: { id: true, name: true, facilityType: true } },
        createdByUser: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateReferralStatus(
    referralId: string,
    dto: UpdateStatusDTO,
    userId: string,
    facilityId: string | null,
    role: Role
  ) {
    const referral = await prisma.referral.findUnique({ where: { id: referralId } });
    if (!referral) throw new NotFoundError('Referral record not found');

    // Admin override skips tenant check; workers are verified against their assigned facility
    if (role !== Role.ADMIN) {
      if (dto.newStatus === ReferralStatus.CANCELLED) {
        if (referral.referringFacilityId !== facilityId) {
          throw new ForbiddenError('Only the originating facility can cancel a referral');
        }
      } else {
        if (referral.receivingFacilityId !== facilityId) {
          throw new ForbiddenError('Unauthorized to perform state changes for another facility');
        }
      }
    }

    // State Machine Validation
    const validTransitions = ALLOWED_TRANSITIONS[referral.currentStatus];
    if (!validTransitions.includes(dto.newStatus)) {
      throw new BadRequestError(
        `Invalid status transition from ${referral.currentStatus} to ${dto.newStatus}`
      );
    }

    // ACID Transaction: Status Update + Audit Entry
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.referral.update({
        where: { id: referralId },
        data: { currentStatus: dto.newStatus },
      });

      await tx.referralStatusHistory.create({
        data: {
          referralId,
          previousStatus: referral.currentStatus,
          newStatus: dto.newStatus,
          changedByUserId: userId,
          notes: dto.notes || null,
        },
      });

      return updated;
    });
  }

  static async getReferralDetails(
    referralId: string,
    facilityId: string | null,
    role: Role
  ) {
    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
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
      throw new NotFoundError(`Referral with ID ${referralId} was not found.`);
    }

    // Authorization & Tenant Isolation Check
    const isAuthorized =
      role === Role.ADMIN ||
      (facilityId !== null &&
        (referral.referringFacilityId === facilityId ||
          referral.receivingFacilityId === facilityId));

    if (!isAuthorized) {
      throw new ForbiddenError('You are not authorized to view referrals outside your facility.');
    }

    return referral;
  }

  static async getAdminMetrics() {
    const statusCounts = await prisma.referral.groupBy({
      by: ['currentStatus'],
      _count: { _all: true },
    });

    const metricsMap = statusCounts.reduce((acc: { [x: string]: any; }, curr: { currentStatus: string | number; _count: { _all: any; }; }) => {
      acc[curr.currentStatus] = curr._count._all;
      return acc;
    }, {} as Record<ReferralStatus, number>);

    return {
      total: Object.values(metricsMap).reduce((sum, count) => sum + count, 0),
      pending: metricsMap[ReferralStatus.SUBMITTED] || 0,
      acknowledged: metricsMap[ReferralStatus.ACKNOWLEDGED] || 0,
      accepted: metricsMap[ReferralStatus.ACCEPTED] || 0,
      completed: metricsMap[ReferralStatus.COMPLETED] || 0,
      rejected: metricsMap[ReferralStatus.REJECTED] || 0,
      cancelled: metricsMap[ReferralStatus.CANCELLED] || 0,
    };
  }
}