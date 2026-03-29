import Biometric from '../models/Biometric.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Record biometric data
// @route   POST /api/biometrics
// @access  Private
export const recordBiometrics = asyncHandler(async (req, res) => {
  const { heartRate, bloodPressure, oxygenLevel, steps } = req.body;

  const biometric = await Biometric.create({
    patient: req.user.id,
    heartRate,
    bloodPressure,
    oxygenLevel,
    steps
  });

  res.status(201).json({
    success: true,
    data: biometric
  });
});

// @desc    Get user's biometric trends
// @route   GET /api/biometrics
// @access  Private
export const getMyBiometrics = asyncHandler(async (req, res) => {
  const biometrics = await Biometric.find({ patient: req.user.id })
    .sort('-createdAt')
    .limit(30);
  
  res.status(200).json({
    success: true,
    data: biometrics
  });
});

// @desc    Get latest biometric snapshot
// @route   GET /api/biometrics/latest
// @access  Private
export const getLatestBiometrics = asyncHandler(async (req, res) => {
  const biometric = await Biometric.findOne({ patient: req.user.id })
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    data: biometric
  });
});
