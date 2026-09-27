import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/schemas';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post('/register', authenticateJWT, authorizeRoles(Role.ADMIN), validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);

export default router;