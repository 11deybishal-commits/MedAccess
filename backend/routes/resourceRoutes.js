import express from 'express';
import {
  reportResource,
  getVerifiedResources,
  getPendingResources,
  verifyResource,
  rejectResource,
  getMyReports,
  deleteResource,
} from '../controllers/resourceController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, reportResource);
router.get('/verified', getVerifiedResources);
router.get('/pending', authenticateToken, authorizeAdmin, getPendingResources);
router.get('/my-reports', authenticateToken, getMyReports);
router.put('/:id/verify', authenticateToken, authorizeAdmin, verifyResource);
router.put('/:id/reject', authenticateToken, authorizeAdmin, rejectResource);
router.delete('/:id', authenticateToken, deleteResource);

export default router;
