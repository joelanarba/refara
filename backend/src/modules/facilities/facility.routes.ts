import { Router } from 'express';
import { getFacilities, createFacility } from './facility.controller';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const router = Router();

// Everyone can view facilities
router.get('/', authenticateJWT, getFacilities);

// Only admins can create facilities
router.post('/', authenticateJWT, authorizeRoles('ADMIN'), createFacility);

export { router as facilityRoutes };
