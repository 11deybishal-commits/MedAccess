import express from 'express';
import {
  registerDonor,
  searchDonors,
  getMyDonorProfile,
  updateDonorProfile,
  getAllDonors,
} from '../controllers/donorController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerDonor);
router.get('/search', searchDonors);
router.get('/all', getAllDonors);
router.get('/my-profile', authenticateToken, getMyDonorProfile);
router.put('/update-profile', authenticateToken, updateDonorProfile);

export default router;
