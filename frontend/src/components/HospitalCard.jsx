import React from 'react';
import { FiMapPin, FiStar, FiPhone, FiExternalLink } from 'react-icons/fi';
import { openGoogleMapsDirections, calculateDistance } from '../services/mapService.js';

const HospitalCard = ({ hospital, userLocation }) => {
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospital.lat,
        hospital.lng
      ).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-24 flex items-center justify-center">
        <div className="text-white text-center">
          <h3 className="font-bold text-lg">{hospital.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <FiMapPin className="text-red-500 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-700">{hospital.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" />
            <span className="font-medium">{hospital.rating}</span>
          </div>
          {distance && (
            <div className="text-gray-600">
              <span className="font-medium">{distance} km</span>
            </div>
          )}
        </div>

        {hospital.openNow !== undefined && (
          <div className="mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                hospital.openNow
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {hospital.openNow ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}

        <button
          onClick={() => openGoogleMapsDirections(hospital.lat, hospital.lng)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiExternalLink />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
