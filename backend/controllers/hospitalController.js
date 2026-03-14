import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNearbyHospitals = asyncHandler(async (req, res) => {
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
          type: 'hospital',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

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
    console.error('Error fetching hospitals:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching hospitals',
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
