import React from 'react';
import { motion } from 'framer-motion';

const bloodGroupColors = {
  'A+': 'from-red-500 to-rose-600',
  'A-': 'from-red-400 to-rose-500',
  'B+': 'from-blue-500 to-cyan-600',
  'B-': 'from-blue-400 to-cyan-500',
  'O+': 'from-orange-500 to-amber-600',
  'O-': 'from-orange-400 to-amber-500',
  'AB+': 'from-purple-500 to-fuchsia-600',
  'AB-': 'from-purple-400 to-fuchsia-500',
};

const DonorCard = ({ donor, onContact }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 scale-150 group-hover:bg-primary/10 transition-colors duration-500"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold font-headline text-slate-800 group-hover:text-primary transition-colors">{donor.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {donor.city}
            </p>
          </div>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${bloodGroupColors[donor.bloodGroup] || 'from-slate-400 to-slate-500'} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-slate-200`}>
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Group</span>
          <span className="text-xl font-black leading-none">{donor.bloodGroup}</span>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">water_drop</span>
            <span className="text-sm font-bold text-slate-600">Donations</span>
          </div>
          <span className="text-lg font-black text-slate-800">{donor.donationCount}</span>
        </div>
        
        <div className="flex items-center gap-4 px-2">
           <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${donor.availability ? 'text-emerald-500' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${donor.availability ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {donor.availability ? 'Active Now' : 'Away'}
           </div>
        </div>
      </div>

      <div className="flex gap-4 relative z-10">
        <button
          onClick={() => onContact && onContact(donor)}
          className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold font-headline py-4 rounded-2xl transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 group/btn"
        >
          Contact Donor
          <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">send</span>
        </button>
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl flex items-center justify-center">
            <a href={`tel:${donor.phone}`} className="w-full h-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">call</span>
            </a>
        </div>
      </div>
    </motion.div>
  );
};

export default DonorCard;

