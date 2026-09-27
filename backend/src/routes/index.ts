import { Router, Request, Response } from 'express';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Future route modules will be mounted here:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/facilities', facilityRoutes);
// router.use('/referrals', referralRoutes);
// router.use('/dashboard', dashboardRoutes);

export default router;
