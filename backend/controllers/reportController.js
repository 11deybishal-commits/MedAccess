import Report from '../models/Report.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';

// @desc    Upload new medical report
// @route   POST /api/reports
// @access  Private
export const uploadReport = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { title, category, dateConducted } = req.body;

  const report = await Report.create({
    patient: req.user.id,
    title,
    category: category || 'General',
    fileUrl: `/uploads/reports/${req.file.filename}`,
    fileName: req.file.originalname,
    dateConducted: dateConducted || Date.now()
  });

  res.status(201).json({
    success: true,
    data: report
  });
});

// @desc    Get user's reports
// @route   GET /api/reports
// @access  Private
export const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ patient: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    data: reports
  });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  if (report.patient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this report');
  }

  // delete file from disk
  const filePath = path.join(process.cwd(), report.fileUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await report.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
