import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  recordBiometrics,
  getMyBiometrics,
  getLatestBiometrics
} from '../controllers/biometricController.js';

const router = express.Router();

router.route('/')
  .post(protect, recordBiometrics)
  .get(protect, getMyBiometrics);

router.get('/latest', protect, getLatestBiometrics);

export default router;
