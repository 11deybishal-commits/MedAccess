import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadReport,
  getMyReports,
  deleteReport
} from '../controllers/reportController.js';
import { analyzeReport } from '../controllers/aiController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/reports';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15000000 }, // 15MB max file size
});

router.route('/')
  .post(protect, upload.single('file'), uploadReport)
  .get(protect, getMyReports);

router.route('/:id')
  .delete(protect, deleteReport);

router.post('/:id/analyze', protect, analyzeReport);

export default router;
