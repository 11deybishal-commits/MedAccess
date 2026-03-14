import express from 'express';
import {
  getNearbyPharmacies,
  getNearbyEmergencyServices,
} from '../controllers/pharmacyController.js';

const router = express.Router();

router.get('/nearby', getNearbyPharmacies);
router.get('/emergency', getNearbyEmergencyServices);

export default router;
