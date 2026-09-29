import { Router } from 'express';
import { getUsers, createUser } from './user.controller';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const router = Router();

// Only admins can manage users in MVP
router.use(authenticateJWT, authorizeRoles('ADMIN'));

router.get('/', getUsers);
router.post('/', createUser);

export { router as userRoutes };
