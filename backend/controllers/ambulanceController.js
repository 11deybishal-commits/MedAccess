import Ambulance from '../models/Ambulance.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import axios from 'axios';

export const registerAmbulance = asyncHandler(async (req, res) => {
  const { ambulanceNumber, driverName, driverPhone, hospital } = req.body;

  if (!ambulanceNumber || !driverName || !driverPhone || !hospital) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const ambulance = new Ambulance({
    ambulanceNumber,
    driverId: req.user.id,
    driverName,
    driverPhone,
    hospital,
    status: 'available',
  });

  await ambulance.save();

  res.status(201).json({
    success: true,
    message: 'Ambulance registered successfully',
    ambulance,
  });
});

export const updateAmbulanceLocation = asyncHandler(async (req, res) => {
  const { ambulanceId } = req.params;
  const { latitude, longitude, address } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Location coordinates required' });
  }

  const ambulance = await Ambulance.findByIdAndUpdate(
    ambulanceId,
    {
      'currentLocation.latitude': latitude,
      'currentLocation.longitude': longitude,
      'currentLocation.address': address || '',
      $push: {
        route: {
          latitude,
          longitude,
          timestamp: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!ambulance) {
    return res.status(404).json({ message: 'Ambulance not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Location updated',
    ambulance,
  });
});

export const updateAmbulanceStatus = asyncHandler(async (req, res) => {
  const { ambulanceId } = req.params;
  const { status, destination, patientInfo, estimatedTime } = req.body;

  const validStatuses = ['available', 'on-duty', 'in-transit', 'arrived', 'busy'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (destination) updateData.destination = destination;
  if (patientInfo) updateData.patientInfo = patientInfo;
  if (estimatedTime) updateData.estimatedTime = estimatedTime;

  const ambulance = await Ambulance.findByIdAndUpdate(ambulanceId, updateData, {
    new: true,
  });

  if (!ambulance) {
    return res.status(404).json({ message: 'Ambulance not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Status updated',
    ambulance,
  });
});

export const getNearbyAmbulances = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Location required' });
  }

  // Find available ambulances
  const ambulances = await Ambulance.find({
    isActive: true,
    status: 'available',
  });

  // Calculate distance and filter
  const nearbyAmbulances = ambulances
    .map((ambulance) => {
      if (!ambulance.currentLocation?.latitude) return null;

      const distance = calculateDistance(
        latitude,
        longitude,
        ambulance.currentLocation.latitude,
        ambulance.currentLocation.longitude
      );

      return {
        ...ambulance.toObject(),
        distance: Math.round(distance * 100) / 100,
      };
    })
    .filter((a) => a && a.distance <= radius / 1000)
    .sort((a, b) => a.distance - b.distance);

  res.status(200).json({
    success: true,
    ambulances: nearbyAmbulances,
    count: nearbyAmbulances.length,
  });
});

export const trackAmbulance = asyncHandler(async (req, res) => {
  const { ambulanceId } = req.params;

  const ambulance = await Ambulance.findById(ambulanceId);

  if (!ambulance) {
    return res.status(404).json({ message: 'Ambulance not found' });
  }

  res.status(200).json({
    success: true,
    ambulance,
  });
});

export const callAmbulance = asyncHandler(async (req, res) => {
  const { ambulanceId } = req.params;
  const { pickupLocation, dropLocation, patientInfo, emergencyNumber } = req.body;

  if (!pickupLocation || !dropLocation) {
    return res.status(400).json({ message: 'Pickup and drop locations required' });
  }

  const ambulance = await Ambulance.findByIdAndUpdate(
    ambulanceId,
    {
      status: 'on-duty',
      destination: dropLocation,
      patientInfo,
      emergencyNumber,
      estimatedTime: 5, // Default 5 minutes
    },
    { new: true }
  );

  if (!ambulance) {
    return res.status(404).json({ message: 'Ambulance not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Ambulance has been called',
    ambulance,
  });
});

export const getAllAmbulances = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    ambulances,
    count: ambulances.length,
  });
});

// Helper function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
