import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  bookAppointment,
  getMyAppointments,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, getMyAppointments);

router.route('/:id')
  .put(protect, updateAppointment)
  .delete(protect, cancelAppointment);

export default router;
