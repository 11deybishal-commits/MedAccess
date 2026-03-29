import React from 'react';
import { motion } from 'framer-motion';

const EmergencyPanel = ({ onEmergency, location }) => {
  const emergencyActions = [
    {
      id: 'ambulance',
      label: 'Call Ambulance',
      icon: 'emergency', // Material symbol
      action: () => window.location.href = 'tel:102',
      gradient: 'from-red-500 to-red-600',
      shadow: 'hover:shadow-[0_15px_35px_rgba(239,68,68,0.4)]',
      delay: 0.1
    },
    {
      id: 'hospital',
      label: 'Find Hospital',
      icon: 'local_hospital',
      action: () => onEmergency?.('hospital'),
      gradient: 'from-blue-600 to-blue-700',
      shadow: 'hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)]',
      delay: 0.2
    },
    {
      id: 'blood',
      label: 'Blood Request',
      icon: 'bloodtype',
      action: () => onEmergency?.('blood'),
      gradient: 'from-rose-500 to-rose-600',
      shadow: 'hover:shadow-[0_15px_35px_rgba(244,63,94,0.4)]',
      delay: 0.3
    },
    {
      id: 'share',
      label: 'Share Location',
      icon: 'my_location',
      action: () => {
        if (navigator.share && location) {
          navigator.share({
            title: 'My Emergency Location',
            text: `I need help! My location: ${location.latitude}, ${location.longitude}`,
            url: window.location.href,
          });
        }
      },
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'hover:shadow-[0_15px_35px_rgba(16,185,129,0.4)]',
      delay: 0.4
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-8 border border-white/60 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-extrabold font-headline text-slate-800 flex items-center justify-center md:justify-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-4xl animate-pulse">warning</span>
          Emergency Quick Access
        </h2>
        <p className="text-slate-500 font-medium text-sm mt-2 ml-1">Get immediate, accurate help when you need it most.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {emergencyActions.map((action) => (
          <motion.button
            key={action.id}
            onClick={action.action}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: action.delay, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group bg-gradient-to-br ${action.gradient} text-white p-6 rounded-3xl font-headline font-bold flex flex-col items-center gap-4 transition-all duration-300 ${action.shadow} overflow-hidden`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl drop-shadow-md">{action.icon}</span>
            </div>
            <span className="text-sm tracking-wide text-center drop-shadow-sm">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 p-5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100/50 rounded-2xl flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-red-600 animate-bounce">call</span>
        </div>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          <strong className="text-red-700 block text-base mb-1">In a life-threatening emergency:</strong> 
          Do not wait. Dial <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">102</span> for Ambulance or <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">100</span> for Police immediately.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmergencyPanel;
