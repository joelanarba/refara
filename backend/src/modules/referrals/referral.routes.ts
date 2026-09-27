import { Router } from 'express';
import {
  createReferral,
  getOutgoingReferrals,
  getIncomingReferrals,
  updateReferralStatus,
  getReferralDetails,
  getAdminMetrics,
} from './referral.controller';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createReferralSchema, updateStatusSchema } from './referral.validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.post(
  '/',
  authorizeRoles(UserRole.REFERRING_WORKER, UserRole.ADMIN),
  validateBody(createReferralSchema),
  createReferral,
);

router.get(
  '/outgoing',
  authorizeRoles(UserRole.REFERRING_WORKER, UserRole.ADMIN),
  getOutgoingReferrals,
);
router.get(
  '/incoming',
  authorizeRoles(UserRole.RECEIVING_WORKER, UserRole.ADMIN),
  getIncomingReferrals,
);
router.get('/metrics', authorizeRoles(UserRole.ADMIN), getAdminMetrics);
router.get('/:id', getReferralDetails);
router.patch('/:id/status', validateBody(updateStatusSchema), updateReferralStatus);

export default router;
