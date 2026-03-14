import express from 'express';
import {
  getNearbyHospitals,
  getHospitalDetails,
} from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/nearby', getNearbyHospitals);
router.get('/details/:placeId', getHospitalDetails);

export default router;
