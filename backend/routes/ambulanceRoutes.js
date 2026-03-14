import express from 'express';
import {
  registerAmbulance,
  updateAmbulanceLocation,
  updateAmbulanceStatus,
  getNearbyAmbulances,
  trackAmbulance,
  callAmbulance,
  getAllAmbulances,
} from '../controllers/ambulanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerAmbulance);
router.put('/:ambulanceId/location', updateAmbulanceLocation);
router.put('/:ambulanceId/status', updateAmbulanceStatus);
router.get('/nearby', getNearbyAmbulances);
router.get('/:ambulanceId/track', trackAmbulance);
router.post('/:ambulanceId/call', callAmbulance);
router.get('/', getAllAmbulances);

export default router;
