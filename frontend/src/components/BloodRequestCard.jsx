import React from 'react';
import { motion } from 'framer-motion';

const bloodGroupColors = {
  'A+': 'bg-red-500',
  'A-': 'bg-rose-400',
  'B+': 'bg-blue-500',
  'B-': 'bg-cyan-400',
  'O+': 'bg-orange-500',
  'O-': 'bg-amber-400',
  'AB+': 'bg-purple-500',
  'AB-': 'bg-fuchsia-400',
};

const urgencyLevels = {
  low: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'check_circle' },
  medium: { color: 'text-amber-500', bg: 'bg-amber-50', icon: 'warning' },
  high: { color: 'text-orange-500', bg: 'bg-orange-50', icon: 'error' },
  critical: { color: 'text-red-500', bg: 'bg-red-50', icon: 'emergency' },
};

const BloodRequestCard = ({ request, onContact }) => {
  const urgency = urgencyLevels[request.urgency] || urgencyLevels.medium;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-white/90 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${bloodGroupColors[request.bloodGroup] || 'bg-slate-500'} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
           <div className={`flex items-center gap-2 ${urgency.color} font-black text-[10px] uppercase tracking-widest mb-3`}>
              <span className="material-symbols-outlined text-[16px]">{urgency.icon}</span>
              {request.urgency} Priority
           </div>
           <h3 className="text-2xl font-black font-headline text-slate-800 leading-tight">{request.hospital}</h3>
           <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">{request.city}</p>
        </div>
        <div className={`w-16 h-16 rounded-3xl ${bloodGroupColors[request.bloodGroup] || 'bg-slate-500'} flex flex-col items-center justify-center text-white shadow-xl shadow-slate-200`}>
           <span className="text-[10px] font-bold opacity-70">Type</span>
           <span className="text-2xl font-black">{request.bloodGroup}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100/50">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                  <span className="material-symbols-outlined">water_full</span>
               </div>
               <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units Needed</div>
                  <div className="text-xl font-black text-slate-800">{request.unitsNeeded} <span className="text-xs font-medium opacity-50">bottles</span></div>
               </div>
            </div>
            <div className={`px-4 py-2 rounded-2xl ${request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} text-[10px] font-black uppercase tracking-widest`}>
               {request.status}
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-2">
         <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {new Date(request.createdAt).toLocaleDateString()}
         </div>
         <button 
           onClick={() => onContact && onContact(request)}
           className="bg-primary hover:bg-blue-700 text-white font-black font-headline px-10 py-5 rounded-[2rem] shadow-xl shadow-primary/30 transition-all flex items-center gap-2 group/btn"
         >
            Lend Support
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">favorite</span>
         </button>
      </div>
    </motion.div>
  );
};

export default BloodRequestCard;

