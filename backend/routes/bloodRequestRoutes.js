import express from 'express';
import {
  createBloodRequest,
  getBloodRequests,
  getMyBloodRequests,
  updateBloodRequest,
  deleteBloodRequest,
} from '../controllers/bloodRequestController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createBloodRequest);
router.get('/', getBloodRequests);
router.get('/my-requests', authenticateToken, getMyBloodRequests);
router.put('/:id', authenticateToken, updateBloodRequest);
router.delete('/:id', authenticateToken, deleteBloodRequest);

export default router;
