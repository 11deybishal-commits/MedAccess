import React from 'react';
import { FiDroplet, FiPhone, FiMail } from 'react-icons/fi';

const bloodGroupColors = {
  'A+': 'bg-red-100 text-red-800',
  'A-': 'bg-red-100 text-red-800',
  'B+': 'bg-blue-100 text-blue-800',
  'B-': 'bg-blue-100 text-blue-800',
  'O+': 'bg-orange-100 text-orange-800',
  'O-': 'bg-orange-100 text-orange-800',
  'AB+': 'bg-purple-100 text-purple-800',
  'AB-': 'bg-purple-100 text-purple-800',
};

const DonorCard = ({ donor, onContact }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{donor.name}</h3>
        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${bloodGroupColors[donor.bloodGroup]}`}>
          {donor.bloodGroup}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FiDroplet className="text-red-500" />
          <span>Donations: <strong>{donor.donationCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FiPhone />
          <a href={`tel:${donor.phone}`} className="text-blue-600 hover:underline">
            {donor.phone}
          </a>
        </div>
        {donor.email && (
          <div className="flex items-center gap-2 text-gray-700">
            <FiMail />
            <a href={`mailto:${donor.email}`} className="text-blue-600 hover:underline text-xs">
              {donor.email}
            </a>
          </div>
        )}
        {donor.city && (
          <div className="text-gray-600">
            <span>Location: <strong>{donor.city}</strong></span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onContact && onContact(donor)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Contact
        </button>
        <div
          className={`flex-1 py-2 rounded-lg text-center font-medium text-sm ${
            donor.availability
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {donor.availability ? 'Available' : 'Unavailable'}
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
