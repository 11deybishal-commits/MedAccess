import React from 'react';
import { FiMapPin, FiPhone, FiCalendar } from 'react-icons/fi';

const resourceTypeColors = {
  oxygen: 'bg-blue-100 text-blue-800',
  icuBeds: 'bg-red-100 text-red-800',
  blood: 'bg-red-200 text-red-900',
  medicalSupplies: 'bg-green-100 text-green-800',
  camp: 'bg-yellow-100 text-yellow-800',
};

const resourceTypeLabels = {
  oxygen: 'Oxygen Available',
  icuBeds: 'ICU Beds',
  blood: 'Blood Available',
  medicalSupplies: 'Medical Supplies',
  camp: 'Medical Camp',
};

const ResourceCard = ({ resource }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{resource.address}</h3>
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${resourceTypeColors[resource.type]}`}>
          {resourceTypeLabels[resource.type]}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FiMapPin className="text-red-500" />
          <span>{resource.city}</span>
        </div>
        {resource.quantity && (
          <div className="text-gray-700">
            <span>Quantity: <strong>{resource.quantity}</strong></span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700">
          <FiPhone />
          <a href={`tel:${resource.contact}`} className="text-blue-600 hover:underline">
            {resource.contact}
          </a>
        </div>
        {resource.notes && (
          <div className="text-gray-600 italic">
            <span>"{resource.notes}"</span>
          </div>
        )}
        {resource.createdAt && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <FiCalendar />
            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            resource.status === 'verified'
              ? 'bg-green-100 text-green-800'
              : resource.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;
