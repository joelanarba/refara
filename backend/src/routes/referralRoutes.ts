import { Router } from 'express';
import {
  createReferral,
  getOutgoingReferrals,
  getIncomingReferrals,
  updateReferralStatus,
  getReferralDetails,
  getAdminMetrics,
} from '../controllers/referralController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReferralSchema, updateStatusSchema } from '../validations/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.post(
  '/',
  authorizeRoles(Role.REFERRING_WORKER, Role.ADMIN),
  validateBody(createReferralSchema),
  createReferral
);

router.get('/outgoing', authorizeRoles(Role.REFERRING_WORKER, Role.ADMIN), getOutgoingReferrals);
router.get('/incoming', authorizeRoles(Role.RECEIVING_WORKER, Role.ADMIN), getIncomingReferrals);
router.get('/metrics', authorizeRoles(Role.ADMIN), getAdminMetrics);
router.get('/:id', getReferralDetails);
router.patch('/:id/status', validateBody(updateStatusSchema), updateReferralStatus);

export default router;