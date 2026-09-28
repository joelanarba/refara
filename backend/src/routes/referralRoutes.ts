import { Router } from 'express';
import {
  createReferral,
  getOutgoingReferrals,
  getIncomingReferrals,
  getReferralDetails,
  updateReferralStatus,
  getAdminMetrics,
} from '../controllers/referralController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReferralSchema, updateStatusSchema } from '../validations/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

/**
 * @openapi
 * /referrals:
 *   post:
 *     summary: Create a new maternal referral
 *     tags:
 *       - Referrals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *               - patientAge
 *               - gestationalAgeWeeks
 *               - urgency
 *               - reasonForReferral
 *               - receivingFacilityId
 *             properties:
 *               patientName:
 *                 type: string
 *                 example: Mary Mensah
 *               patientAge:
 *                 type: integer
 *                 example: 28
 *               gestationalAgeWeeks:
 *                 type: integer
 *                 example: 34
 *               urgency:
 *                 $ref: '#/components/schemas/Urgency'
 *               reasonForReferral:
 *                 type: string
 *                 example: Severe pre-eclampsia, requires ICU support.
 *               receivingFacilityId:
 *                 type: string
 *                 example: c7f3b8b1-1234-4567-8901-234567890abc
 *     responses:
 *       201:
 *         description: Referral created successfully
 *       400:
 *         description: Validation error or missing facility context
 */
router.post('/', validateBody(createReferralSchema), createReferral);

/**
 * @openapi
 * /referrals/outgoing:
 *   get:
 *     summary: List outgoing referrals for user's facility (or all if ADMIN)
 *     tags:
 *       - Referrals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of outgoing referrals
 */
router.get('/outgoing', getOutgoingReferrals);

/**
 * @openapi
 * /referrals/incoming:
 *   get:
 *     summary: List incoming referrals for user's facility (or all if ADMIN)
 *     tags:
 *       - Referrals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming referrals
 */
router.get('/incoming', getIncomingReferrals);

/**
 * @openapi
 * /referrals/metrics:
 *   get:
 *     summary: Get overall referral statistics (ADMIN only)
 *     tags:
 *       - Metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metric counters grouped by referral status
 */
router.get('/metrics', authorizeRoles(Role.ADMIN), getAdminMetrics);

/**
 * @openapi
 * /referrals/{id}:
 *   get:
 *     summary: Get referral details with full audit history
 *     tags:
 *       - Referrals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral details record
 *       403:
 *         description: Tenant authorization failed
 *       404:
 *         description: Referral not found
 */
router.get('/:id', getReferralDetails);

/**
 * @openapi
 * /referrals/{id}/status:
 *   patch:
 *     summary: Transition referral status (State Machine logic enforced)
 *     tags:
 *       - Referrals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStatus
 *             properties:
 *               newStatus:
 *                 $ref: '#/components/schemas/ReferralStatus'
 *               notes:
 *                 type: string
 *                 example: Patient accepted and ambulance dispatched.
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status transition sequence
 */
router.patch('/:id/status', validateBody(updateStatusSchema), updateReferralStatus);

export default router;