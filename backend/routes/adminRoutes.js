import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getHospitalAppointments,
  updateAppointmentStatus,
  updateHospitalProfile,
  getHospitalPatients,
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware: all routes require auth + must be hospital_admin
const hospitalAdminOnly = (req, res, next) => {
  if (req.user.role !== 'hospital_admin') {
    return res.status(403).json({ success: false, message: 'Hospital admin access required' });
  }
  next();
};

// Dashboard overview
router.get('/dashboard', protect, hospitalAdminOnly, getDashboardStats);

// Appointments management
router.get('/appointments', protect, hospitalAdminOnly, getHospitalAppointments);
router.put('/appointments/:id', protect, hospitalAdminOnly, updateAppointmentStatus);

// Hospital profile
router.put('/profile', protect, hospitalAdminOnly, updateHospitalProfile);

// Patients
router.get('/patients', protect, hospitalAdminOnly, getHospitalPatients);

export default router;
