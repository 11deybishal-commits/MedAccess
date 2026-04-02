import express from 'express';
import {
  registerPharmacy,
  loginPharmacy,
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getPriceComparison,
  getNearbyPharmacies,
  getNearbyEmergencyServices,
} from '../controllers/pharmacyController.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerPharmacy);
router.post('/login', loginPharmacy);

// Medicine Management Routes
router.post('/medicines', addMedicine);
router.get('/medicines/:pharmacyId', getMedicines);
router.put('/medicines/:medicineId', updateMedicine);
router.delete('/medicines/:medicineId', deleteMedicine);

// Price Comparator Route
router.post('/price-comparison', getPriceComparison);

// Existing Routes
router.get('/nearby', getNearbyPharmacies);
router.get('/emergency', getNearbyEmergencyServices);

export default router;
