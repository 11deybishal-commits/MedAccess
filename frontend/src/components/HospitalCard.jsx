import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,63,135,0.1)] transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col h-full"
    >
      <div className="relative h-32 bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center p-6 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-white text-center w-full">
          <h3 className="font-extrabold font-headline text-xl leading-tight line-clamp-2 drop-shadow-md">{hospital.name}</h3>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-red-500 text-sm">location_on</span>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 mt-1">{hospital.address}</p>
        </div>

        <div className="flex justify-between items-center mb-6 py-4 border-y border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Rating</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-yellow-400 text-lg">star</span>
              <span className="font-extrabold text-slate-800 text-lg">{hospital.rating || 'N/A'}</span>
            </div>
          </div>
          
          <div className="w-px h-10 bg-slate-100"></div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Distance</span>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-primary text-lg">{distance ? distance : '--'}</span>
              <span className="text-slate-500 font-medium text-sm">km</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {hospital.openNow !== undefined && (
            <div className="mb-5 flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm ${
                  hospital.openNow
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${hospital.openNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {hospital.openNow ? 'Open Now' : 'Closed'}
              </span>
            </div>
          )}

          <button
            onClick={() => openGoogleMapsDirections(hospital.lat, hospital.lng)}
            className="w-full bg-surface-container-low border-2 border-primary text-primary py-3.5 rounded-2xl font-headline font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_8px_20px_rgba(0,63,135,0.2)] active:scale-95"
          >
            Get Directions
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
