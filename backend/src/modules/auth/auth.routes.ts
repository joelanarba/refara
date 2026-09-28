import { Router } from 'express';
import { registerUser, loginUser } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validation';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Jane Doe
 *               email:
 *                 type: string
 *                 example: jane.doe@hospital.org
 *               password:
 *                 type: string
 *                 example: StrongP@ssw0rd!
 *               role:
 *                 $ref: '#/components/schemas/UserRole'
 *               facilityId:
 *                 type: string
 *                 nullable: true
 *                 example: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation Error
 *       409:
 *         description: Email already registered
 */
router.post(
  '/register',
  authenticateJWT,
  authorizeRoles(UserRole.ADMIN),
  validateBody(registerSchema),
  registerUser,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user & issue JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane.doe@hospital.org
 *               password:
 *                 type: string
 *                 example: StrongP@ssw0rd!
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateBody(loginSchema), loginUser);

export default router;
