import React from 'react';
import { FiDroplet, FiPhone, FiCalendar, FiAlertCircle } from 'react-icons/fi';

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

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const BloodRequestCard = ({ request, onContact }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{request.hospital}</h3>
          <p className="text-sm text-gray-600">{request.city}</p>
        </div>
        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${bloodGroupColors[request.bloodGroup]}`}>
          {request.bloodGroup}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <FiAlertCircle className="text-orange-500" />
          <span className={`px-3 py-1 rounded-full font-semibold ${urgencyColors[request.urgency]}`}>
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <FiDroplet className="text-red-500" />
          <span>Units needed: <strong>{request.unitsNeeded}</strong></span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <FiPhone />
          <a href={`tel:${request.contact}`} className="text-blue-600 hover:underline">
            {request.contact}
          </a>
        </div>

        {request.createdAt && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <FiCalendar />
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full text-center ${
              request.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : request.status === 'fulfilled'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          <button
            onClick={() => onContact && onContact(request)}
            className="bg-blue-600 text-white py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestCard;
