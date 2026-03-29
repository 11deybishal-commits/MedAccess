import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNearbyHospitals = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mockHospitals = [
    {
      id: 'mock-1',
      name: 'City General Hospital',
      address: '123 Health Ave, Medical District',
      lat: parseFloat(latitude) + 0.01,
      lng: parseFloat(longitude) + 0.01,
      rating: 4.8,
      openNow: true,
      types: ['hospital', 'health']
    },
    {
      id: 'mock-2',
      name: 'St. Jude Medical Center',
      address: '456 Wellness Blvd, Downtown',
      lat: parseFloat(latitude) - 0.015,
      lng: parseFloat(longitude) + 0.005,
      rating: 4.6,
      openNow: true,
      types: ['hospital', 'health']
    },
    {
      id: 'mock-3',
      name: 'Hope Regional Clinic',
      address: '789 Care Lane, Suburbs',
      lat: parseFloat(latitude) + 0.005,
      lng: parseFloat(longitude) - 0.02,
      rating: 4.5,
      openNow: false,
      types: ['hospital', 'health']
    }
  ];

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'hospital',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'ZERO_RESULTS' || !response.data.results.length) {
      console.warn(`Google API returned ${response.data.status}. Resorting to mock data.`);
      return res.status(200).json({
        success: true,
        hospitals: mockHospitals,
        count: mockHospitals.length,
        isMock: true
      });
    }

    const hospitals = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.[0]?.photo_reference,
      types: place.types,
    }));

    res.status(200).json({
      success: true,
      hospitals,
      count: hospitals.length,
    });
  } catch (error) {
    console.warn('Error fetching hospitals via API, resorting to mock data:', error.message);
    res.status(200).json({
      success: true,
      hospitals: mockHospitals,
      count: mockHospitals.length,
      isMock: true
    });
  }
});

export const getHospitalDetails = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,formatted_phone_number,website,rating,reviews,photos,geometry',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    const place = response.data.result;

    res.status(200).json({
      success: true,
      hospital: {
        id: placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        reviews: place.reviews,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    });
  } catch (error) {
    console.error('Error fetching hospital details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching hospital details',
    });
  }
});
