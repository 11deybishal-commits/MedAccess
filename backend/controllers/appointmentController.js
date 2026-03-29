import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorName, department, appointmentDate, notes, type } = req.body;

  if (!appointmentDate) {
    res.status(400);
    throw new Error('Please provide an appointment date');
  }

  const appointment = await Appointment.create({
    patient: req.user.id,
    doctorName,
    department,
    appointmentDate,
    notes,
    type
  });

  res.status(201).json({
    success: true,
    data: appointment
  });
});

// @desc    Get my appointments
// @route   GET /api/appointments
// @access  Private
export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user.id }).sort('appointmentDate');
  
  res.status(200).json({
    success: true,
    data: appointments
  });
});

// @desc    Update appointment status/date
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.patient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.patient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to cancel this appointment');
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
