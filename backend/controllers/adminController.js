import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard  — Stats snapshot for the hospital admin
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboardStats = asyncHandler(async (req, res) => {
  const hospitalId = req.user.id;

  const [total, confirmed, pending, cancelled, hospital] = await Promise.all([
    Appointment.countDocuments({ hospital: hospitalId }),
    Appointment.countDocuments({ hospital: hospitalId, status: 'Confirmed' }),
    Appointment.countDocuments({ hospital: hospitalId, status: 'Scheduled' }),
    Appointment.countDocuments({ hospital: hospitalId, status: 'Cancelled' }),
    User.findById(hospitalId),
  ]);

  // Today's appointments
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const todayCount = await Appointment.countDocuments({
    hospital: hospitalId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      confirmed,
      pending,
      cancelled,
      todayCount,
      availableBeds: hospital?.availableBeds || 0,
      totalBeds: hospital?.totalBeds || 0,
      rating: hospital?.rating || 4.5,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/appointments — All appointments for this hospital
// ─────────────────────────────────────────────────────────────────────────────
export const getHospitalAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = { hospital: req.user.id };
  if (status) query.status = status;

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone city bloodGroup')
    .sort({ appointmentDate: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Appointment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: appointments,
    pagination: { page: Number(page), limit: Number(limit), total },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/appointments/:id — Accept / Reject / Complete appointment
// ─────────────────────────────────────────────────────────────────────────────
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, hospitalNotes } = req.body;
  const allowedStatuses = ['Confirmed', 'Cancelled', 'Completed', 'Rescheduled'];

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    hospital: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  if (status) appointment.status = status;
  if (hospitalNotes) appointment.hospitalNotes = hospitalNotes;
  await appointment.save();

  const populated = await appointment.populate('patient', 'name email phone');

  res.status(200).json({ success: true, data: populated });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/profile — Update hospital profile / bed count / description
// ─────────────────────────────────────────────────────────────────────────────
export const updateHospitalProfile = asyncHandler(async (req, res) => {
  const {
    hospitalName, hospitalAddress, hospitalPhone, hospitalDescription,
    hospitalSpecialties, totalBeds, availableBeds, hospitalLat, hospitalLng,
  } = req.body;

  const updates = {};
  if (hospitalName) updates.hospitalName = hospitalName;
  if (hospitalAddress) updates.hospitalAddress = hospitalAddress;
  if (hospitalPhone) updates.hospitalPhone = hospitalPhone;
  if (hospitalDescription) updates.hospitalDescription = hospitalDescription;
  if (hospitalSpecialties) updates.hospitalSpecialties = hospitalSpecialties;
  if (totalBeds !== undefined) updates.totalBeds = totalBeds;
  if (availableBeds !== undefined) updates.availableBeds = availableBeds;
  if (hospitalLat !== undefined) updates.hospitalLat = hospitalLat;
  if (hospitalLng !== undefined) updates.hospitalLng = hospitalLng;

  const hospital = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });

  res.status(200).json({ success: true, data: hospital });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/patients — Unique patients who have booked at this hospital
// ─────────────────────────────────────────────────────────────────────────────
export const getHospitalPatients = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ hospital: req.user.id })
    .populate('patient', 'name email phone bloodGroup city createdAt')
    .sort({ createdAt: -1 });

  // Unique patients
  const seen = new Set();
  const patients = [];
  for (const appt of appointments) {
    if (appt.patient && !seen.has(String(appt.patient._id))) {
      seen.add(String(appt.patient._id));
      patients.push({ ...appt.patient.toObject(), lastAppointment: appt.appointmentDate });
    }
  }

  res.status(200).json({ success: true, data: patients, total: patients.length });
});
