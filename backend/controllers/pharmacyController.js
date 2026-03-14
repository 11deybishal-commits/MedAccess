import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNearbyPharmacies = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'pharmacy',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    const pharmacies = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      openNow: place.opening_hours?.open_now,
      types: place.types,
    }));

    res.status(200).json({
      success: true,
      pharmacies,
      count: pharmacies.length,
    });
  } catch (error) {
    console.error('Error fetching pharmacies:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching pharmacies',
    });
  }
});

export const getNearbyEmergencyServices = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000, type = 'police' } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: type,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    const services = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      openNow: place.opening_hours?.open_now,
    }));

    res.status(200).json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error) {
    console.error('Error fetching emergency services:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency services',
    });
  }
});
