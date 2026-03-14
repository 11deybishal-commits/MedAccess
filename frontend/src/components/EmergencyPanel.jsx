import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMapPin, FiDroplet, FiShare2 } from 'react-icons/fi';

const EmergencyPanel = ({ onEmergency, location }) => {
  const emergencyActions = [
    {
      id: 'ambulance',
      label: 'Call Ambulance',
      icon: FiPhone,
      action: () => window.location.href = 'tel:102',
      bgColor: 'bg-red-600',
    },
    {
      id: 'hospital',
      label: 'Find Hospital',
      icon: FiMapPin,
      action: () => onEmergency?.('hospital'),
      bgColor: 'bg-blue-600',
    },
    {
      id: 'blood',
      label: 'Blood Request',
      icon: FiDroplet,
      action: () => onEmergency?.('blood'),
      bgColor: 'bg-red-500',
    },
    {
      id: 'share',
      label: 'Share Location',
      icon: FiShare2,
      action: () => {
        if (navigator.share && location) {
          navigator.share({
            title: 'My Emergency Location',
            text: `I need help! My location: ${location.latitude}, ${location.longitude}`,
            url: window.location.href,
          });
        }
      },
      bgColor: 'bg-green-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-xl p-6 border-2 border-red-200"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          ⚠️ Emergency Quick Access
        </h2>
        <p className="text-gray-600 text-sm mt-1">Get immediate help when you need it most</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              onClick={action.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.bgColor} text-white p-4 rounded-lg font-semibold flex flex-col items-center gap-2 hover:shadow-lg transition-shadow`}
            >
              <Icon className="text-2xl" />
              <span className="text-xs text-center">{action.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>🚨 In a life-threatening emergency:</strong> Call local emergency services immediately (102 for Ambulance, 100 for Police)
        </p>
      </div>
    </motion.div>
  );
};

export default EmergencyPanel;
