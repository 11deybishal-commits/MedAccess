import express from 'express';
import {
  register,
  registerHospital,
  login,
  getProfile,
  updateProfile,
  getRegisteredHospitals,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-hospital', registerHospital);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/hospitals', getRegisteredHospitals);   // Public: all registered hospitals

export default router;
