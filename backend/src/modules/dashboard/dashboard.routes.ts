import { Router } from 'express';
import { authenticateJWT } from '../../middleware/auth';
import { getDashboardStats, getRecentReferrals, getReferralActivity } from './dashboard.controller';

const router = Router();

// Base path will be /api/v1/dashboard
router.use(authenticateJWT);

router.get('/:scope/stats', getDashboardStats);
router.get('/:scope/recent-referrals', getRecentReferrals);
router.get('/:scope/referral-activity', getReferralActivity);

export { router as dashboardRoutes };
