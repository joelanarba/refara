import { Router } from 'express';
import { getFacilities, createFacility, getFacilityById, updateFacility, deleteFacility } from './facility.controller';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getFacilities);
router.get('/:id', getFacilityById);

// Only admins can create, edit, delete facilities
router.post('/', authorizeRoles('ADMIN'), createFacility);
router.put('/:id', authorizeRoles('ADMIN'), updateFacility);
router.delete('/:id', authorizeRoles('ADMIN'), deleteFacility);

export { router as facilityRoutes };
