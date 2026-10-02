import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from './user.controller';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const router = Router();

// Only admins can manage users in MVP
router.use(authenticateJWT, authorizeRoles('ADMIN'));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export { router as userRoutes };
