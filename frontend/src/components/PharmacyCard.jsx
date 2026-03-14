import React from 'react';
import { FiMapPin, FiStar, FiPhone, FiExternalLink } from 'react-icons/fi';
import { openGoogleMapsDirections, calculateDistance } from '../services/mapService.js';

const PharmacyCard = ({ pharmacy, userLocation }) => {
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pharmacy.lat,
        pharmacy.lng
      ).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-400 h-24 flex items-center justify-center">
        <div className="text-white text-center">
          <h3 className="font-bold text-lg">{pharmacy.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <FiMapPin className="text-red-500 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-700">{pharmacy.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" />
            <span className="font-medium">{pharmacy.rating}</span>
          </div>
          {distance && (
            <div className="text-gray-600">
              <span className="font-medium">{distance} km</span>
            </div>
          )}
        </div>

        {pharmacy.openNow !== undefined && (
          <div className="mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                pharmacy.openNow
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {pharmacy.openNow ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}

        <button
          onClick={() => openGoogleMapsDirections(pharmacy.lat, pharmacy.lng)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiExternalLink />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default PharmacyCard;
