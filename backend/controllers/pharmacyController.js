import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNearbyPharmacies = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mockPharmacies = [
    {
      id: 'mock-pharm-1',
      name: 'MediCare Heights Pharmacy',
      address: '42 Health St, Medical District',
      lat: parseFloat(latitude) + 0.005,
      lng: parseFloat(longitude) + 0.008,
      rating: 4.9,
      openNow: true,
      types: ['pharmacy', 'health', 'store']
    },
    {
      id: 'mock-pharm-2',
      name: '24/7 LifeSavers Drug Store',
      address: '101 Wellness Blvd, Downtown',
      lat: parseFloat(latitude) - 0.012,
      lng: parseFloat(longitude) + 0.003,
      rating: 4.7,
      openNow: true,
      types: ['pharmacy', 'health', 'store']
    },
    {
      id: 'mock-pharm-3',
      name: 'Community Care Apothecary',
      address: '778 Care Lane, Suburbs',
      lat: parseFloat(latitude) + 0.002,
      lng: parseFloat(longitude) - 0.015,
      rating: 4.5,
      openNow: false,
      types: ['pharmacy', 'health', 'store']
    }
  ];

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

    if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'ZERO_RESULTS' || !response.data.results.length) {
      console.warn(`Google API returned ${response.data.status} for pharmacies. Resorting to mock data.`);
      return res.status(200).json({
        success: true,
        pharmacies: mockPharmacies,
        count: mockPharmacies.length,
        isMock: true
      });
    }

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
    console.warn('Error fetching pharmacies via API, resorting to mock data:', error.message);
    res.status(200).json({
      success: true,
      pharmacies: mockPharmacies,
      count: mockPharmacies.length,
      isMock: true
    });
  }
});

export const getNearbyEmergencyServices = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000, type = 'police' } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mockServices = [
    {
      id: 'mock-em-1',
      name: `Central ${type.charAt(0).toUpperCase() + type.slice(1)} Department`,
      address: '1 Emergency Way, District Center',
      lat: parseFloat(latitude) + 0.007,
      lng: parseFloat(longitude) + 0.002,
      rating: 4.6,
      openNow: true,
    },
    {
      id: 'mock-em-2',
      name: `Northside ${type.charAt(0).toUpperCase() + type.slice(1)} Station`,
      address: '55 Response Rd, North District',
      lat: parseFloat(latitude) - 0.009,
      lng: parseFloat(longitude) - 0.008,
      rating: 4.8,
      openNow: true,
    }
  ];

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

    if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'ZERO_RESULTS' || !response.data.results.length) {
      console.warn(`Google API returned ${response.data.status} for emergency. Resorting to mock data.`);
      return res.status(200).json({
        success: true,
        services: mockServices,
        count: mockServices.length,
        isMock: true
      });
    }

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
    console.warn('Error fetching emergency services via API, resorting to mock data:', error.message);
    res.status(200).json({
      success: true,
      services: mockServices,
      count: mockServices.length,
      isMock: true
    });
  }
});
