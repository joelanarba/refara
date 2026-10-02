import { Router } from 'express';
import { registerUser, loginUser, getMe } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validation';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/register',
  authenticateJWT,
  authorizeRoles(UserRole.ADMIN),
  validateBody(registerSchema),
  registerUser,
);

router.post('/login', validateBody(loginSchema), loginUser);

router.get('/me', authenticateJWT, getMe);

export default router;
