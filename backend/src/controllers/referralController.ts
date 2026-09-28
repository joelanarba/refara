import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ReferralService } from '../services/referralService';

export const createReferral = asyncHandler(async (req: Request, res: Response) => {
  const { userId, facilityId } = req.user!;
  if (facilityId) {
    const referral = await ReferralService.createReferral(req.body, userId, facilityId);
    return res.status(201).json(referral);
  }
  throw new Error('User does not belong to a facility');
});

export const getOutgoingReferrals = asyncHandler(async (req: Request, res: Response) => {
  const { facilityId, role } = req.user!;
  const referrals = await ReferralService.getOutgoingReferrals(facilityId, role);
  return res.status(200).json(referrals);
});

export const getIncomingReferrals = asyncHandler(async (req: Request, res: Response) => {
  const { facilityId, role } = req.user!;
  const referrals = await ReferralService.getIncomingReferrals(facilityId, role);
  return res.status(200).json(referrals);
});

export const updateReferralStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, facilityId, role } = req.user!;
  const updatedReferral = await ReferralService.updateReferralStatus(
    id,
    req.body,
    userId,
    facilityId,
    role
  );
  return res.status(200).json(updatedReferral);
});

export const getReferralDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { facilityId, role } = req.user!;
  const referral = await ReferralService.getReferralDetails(id, facilityId, role);
  return res.status(200).json(referral);
});

export const getAdminMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const metrics = await ReferralService.getAdminMetrics();
  return res.status(200).json({ metrics });
});