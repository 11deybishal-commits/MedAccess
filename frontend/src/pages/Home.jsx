import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiActivity, FiHeart, FiZap, FiShield } from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import InteractiveOrganViewer from '../components/InteractiveOrganViewer.jsx';
import { hospitalService } from '../services/authService.js';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min.js';

/* ─── Real organ images (public domain medical illustration CDN) ─────────────── */
const ORGANS = [
  {
    key: 'neuro',
    title: 'Neurology',
    subtitle: 'Brain & Neural System',
    icon: 'psychology',
    color: 'from-indigo-700/90 via-purple-800/80',
    borderColor: 'border-indigo-400/30',
    glowColor: 'shadow-indigo-500/40',
    bgAccent: 'bg-indigo-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/PurkinjeCell.jpg/800px-PurkinjeCell.jpg',
    diseases: [
      { name: 'Stroke', icon: '⚡', stat: '15M cases/yr' },
      { name: "Alzheimer's", icon: '🧠', stat: 'Affects 50M globally' },
      { name: 'Epilepsy', icon: '🔬', stat: '50M patients' },
    ],
  },
  {
    key: 'cardio',
    title: 'Cardiology',
    subtitle: 'Heart & Vessels',
    icon: 'favorite',
    color: 'from-rose-700/90 via-red-800/80',
    borderColor: 'border-rose-400/30',
    glowColor: 'shadow-rose-500/40',
    bgAccent: 'bg-rose-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/SEM_blood_cells.jpg/800px-SEM_blood_cells.jpg',
    diseases: [
      { name: 'Coronary Artery', icon: '🫀', stat: '#1 cause of death' },
      { name: 'Arrhythmia', icon: '📈', stat: '59M affected' },
      { name: 'Heart Failure', icon: '⚠️', stat: '64M worldwide' },
    ],
  },
  {
    key: 'ortho',
    title: 'Orthopedics',
    subtitle: 'Bones & Joints',
    icon: 'biotech',
    color: 'from-slate-700/90 via-slate-800/80',
    borderColor: 'border-slate-400/30',
    glowColor: 'shadow-slate-500/40',
    bgAccent: 'bg-slate-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/800px-Camponotus_flavomarginatus_ant.jpg',
    diseases: [
      { name: 'Osteoarthritis', icon: '🦴', stat: '530M cases' },
      { name: 'Osteoporosis', icon: '⚗️', stat: '200M affected' },
      { name: 'Muscular Dystrophy', icon: '🔬', stat: '250K in India' },
    ],
  },
];

const RotatingOrganCard = ({ organ, onClick }) => {
  const [activeDiseaseIdx, setActiveDiseaseIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDiseaseIdx(i => (i + 1) % organ.diseases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [organ.diseases.length]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl h-[520px] cursor-pointer border ${organ.borderColor} shadow-2xl ${organ.glowColor}`}
      style={{ perspective: '1000px' }}
    >
      {/* Real Rotating Organ Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={organ.image}
          alt={organ.title}
          className="w-full h-full object-cover"
          animate={{
            rotateY: isHovered ? [0, 8, -8, 0] : [0, 3, -3, 0],
            scale: isHovered ? 1.12 : 1.05,
          }}
          transition={{
            rotateY: { duration: isHovered ? 2 : 6, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.5 },
          }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        {/* Slow continuous rotation overlay for 3D effect */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${organ.color} to-transparent`} />

      {/* Scan Line Animation */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner Glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${organ.bgAccent} opacity-20 rounded-bl-full blur-2xl`} />

      {/* Top Badge */}
      <div className="absolute top-5 left-5 z-20">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <span className={`w-1.5 h-1.5 rounded-full ${organ.bgAccent} animate-pulse`} />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Live Analysis</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
        {/* Icon + Title */}
        <div className="mb-4 inline-block p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
          <span className="material-symbols-outlined text-3xl text-white">{organ.icon}</span>
        </div>
        <h3 className="text-3xl font-bold font-headline text-white mb-1">{organ.title}</h3>
        <p className="text-white/60 text-sm mb-4">{organ.subtitle}</p>

        {/* Live Disease Ticker */}
        <div className="h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDiseaseIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{organ.diseases[activeDiseaseIdx].icon}</span>
                <span className="text-white font-bold text-sm">{organ.diseases[activeDiseaseIdx].name}</span>
              </div>
              <span className="text-white/60 text-xs font-medium">{organ.diseases[activeDiseaseIdx].stat}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Disease Dots */}
        <div className="flex gap-1.5 mt-3">
          {organ.diseases.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setActiveDiseaseIdx(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeDiseaseIdx ? 'bg-white w-4' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Vanta Net init
  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x1d4ed8,
          backgroundColor: 0xf8fafc,
          points: 14,
          maxDistance: 22.0,
          spacing: 18.0,
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) fetchNearbyHospitals();
  }, [location.latitude, location.longitude]);

  const fetchNearbyHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getNearbyHospitals(location.latitude, location.longitude, 5000);
      setHospitals(response.data.hospitals.slice(0, 3));
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = (type) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/${type === 'hospital' ? 'hospitals' : 'blood-requests'}`);
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen pt-28">

      {/* ── HERO ── Vanta Net Background + CSS Gradient Mesh */}
      <section ref={vantaRef} className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">
        {/* Unicorn-studio-style holographic gradient mesh overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[80px] opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        </div>

        {/* Neuron dot pattern */}
        <div className="absolute inset-0 neuron-pattern z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 text-blue-700 font-semibold text-xs uppercase tracking-widest border border-blue-200/50 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              World-Class Diagnostic Care
            </div>
            <h1 className="text-5xl md:text-[5.5rem] font-extrabold font-headline leading-[1.03] tracking-tight text-on-surface">
              Curating <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 animate-pulse">
                Precision
              </span> <br />
              Medicine.
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
              Where advanced clinical research meets empathetic patient care. Experience a medical journey designed around your unique biological blueprint.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/hospitals')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-base md:text-lg shadow-xl shadow-blue-600/30 hover:shadow-indigo-600/40 transition-all"
              >
                Find Hospitals
              </motion.button>
              <button onClick={() => navigate('/register')} className="flex items-center gap-2 font-headline font-bold text-primary group">
                Join MedAccess
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Live Stats Bar */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: FiShield, val: '500+', label: 'Hospitals' },
                { icon: FiHeart, val: '2M+', label: 'Patients' },
                { icon: FiZap, val: '0.4s', label: 'AI Diagnosis' },
                { icon: FiActivity, val: '24/7', label: 'Emergency' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Icon className="text-sm" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-800 text-sm leading-none">{val}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-widest">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual — Animated Rings + Floating Cards */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative flex justify-center items-center w-full min-h-[520px]">
            <div className="relative w-full aspect-square max-w-xl">
              {/* Outer rings */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-blue-300/25 rounded-full border-dashed" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 border border-indigo-400/30 rounded-full" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-16 border-2 border-cyan-400/40 rounded-full" />

              {/* Center — glowing pulse core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-36 h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_80px_30px_rgba(59,130,246,0.35)]"
                >
                  <GiCaduceus className="text-white text-6xl" style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' }} />
                </motion.div>
              </div>

              {/* Floating info cards */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-0 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-blue-50 z-20 min-w-[140px]">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">AI Diagnostic Speed</div>
                <div className="text-2xl font-bold text-blue-600">0.4s <span className="text-indigo-500 text-sm">/ scan</span></div>
              </motion.div>

              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-10 left-0 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-rose-50 z-20 min-w-[140px]">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Hospitals Network</div>
                <div className="text-xl font-bold text-rose-500">500+ <span className="text-slate-400 text-xs font-normal">facilities</span></div>
              </motion.div>

              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-20 right-2 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-emerald-50 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="text-[9px] text-emerald-700 font-bold uppercase">Live Emergency</div>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">24 / 7</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Emergency Panel ── */}
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          <EmergencyPanel onEmergency={handleEmergency} location={location} />
        </div>
      </section>
      {/* Interactive Organ Viewer */}
      <InteractiveOrganViewer />
      {/* ── CORE DISCIPLINES — Real Rotating Organ Images ── */}
      <section className="py-32 bg-slate-950 overflow-hidden relative">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 block">Core Disciplines</span>
              <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tight">
                Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Organ Systems</span>
              </h2>
              <p className="text-slate-400 max-w-md mt-3">Live rotating anatomy with real-time disease statistics. Click any card to explore the full interactive anatomy teacher.</p>
            </div>
            <button onClick={() => navigate('/interactive-anatomy')} className="flex items-center gap-2 text-blue-400 font-bold hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full border border-white/10 flex-shrink-0">
              Explore all <FiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ORGANS.map(organ => (
              <RotatingOrganCard key={organ.key} organ={organ} onClick={() => navigate('/interactive-anatomy')} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY HOSPITALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Location Based</span>
              <h2 className="text-4xl font-extrabold font-headline mb-4">Nearby Hospitals</h2>
            </div>
            <button onClick={() => navigate('/hospitals')} className="text-primary font-bold hover:underline flex items-center gap-2">
              View All <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="bg-surface-container h-80 rounded-3xl animate-pulse" />)}
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="hover:scale-[1.02] transition-transform">
                  <HospitalCard hospital={hospital} userLocation={location} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-low p-12 rounded-3xl text-center text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">location_off</span>
              <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">Location Access Required</h3>
              <p className="max-w-md mx-auto mb-6">We need your location to find the best healthcare facilities near you.</p>
              <button onClick={getLocation} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
                Enable Location
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── SPECIALISTS ── */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Elite Faculty</span>
            <h2 className="text-5xl font-extrabold font-headline mb-6">Meet Our Specialists</h2>
            <div className="w-20 h-1 bg-tertiary rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Julian Sterling', role: 'Chief of Neurosurgery', school: 'Harvard Medical School', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi0zBjgSgULjJJ3FlF5vGdXOthCgfQUFJeT0uq0cIrM94cLcVMrpPZtlIs6IucE6fU5PwL92EnobbuNEc6sO0Kt73eK-c4MzJFiDCyRxAtxCeePM3sGkQay1tTMFdpqiTBoIq8Sc_NurJHZHGTWzQgJB6jCmdKog0YQ07c5ctw5dUomqx3BBxu4hYpAHLAA8aqalM5_WrcA80HvKBxSBNdvVO0TiGs0xGqNordVZjPbtyIOjAvGEavHClFhhK_df2JoGVD4-hq5aI', onDuty: true },
              { name: 'Dr. Elena Vance', role: 'Cardiology Director', school: 'Yale School of Medicine', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMK5OH2gtcb2LCncMBUZyY9EAEsG25qGjXxNpxbGmvnzl4GMbYV9Wcy1p_bFwkEsDL5D7nSGkVfEyqblAdCsmtttriQ9S5S3VaMhluqiGn7QvaY7-1QIJ9BCAHFBYRTsFXcDd7rqduGDgSOsJpzkaiU4H7n8UoplriHHx3Q1AKOryiF6u-zHCLUhvkd8OYXPB0uIUiAyo7RdhJ2bs07ERuw-C-DSduOI9y2rChwD3GjqISh_g2Zu81kJlqxhfgwo8m5gVtrgXdzaI', onDuty: false },
              { name: 'Dr. Marcus Chen', role: 'Molecular Radiologist', school: 'Stanford Medicine', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9GCxNS1eggJX-NyB1KRWh37VXA48KeUZnbMLBi50FREseQVqKvLEmeTb0IZqcFUjDhJ2clyEPnCoMo2OAZsX-cE0lbwmTna8IWZKZr2AkjfXuY1O3heDe5GVxa3RNOgZ7YEFyIg3T2_jc9dMaQB6LQenUNt37rjwnKSRQEepsHiYog06Iv0EGGL203TJYkaEZx29PRNQaqPceQNsm0K0_odF4uiVTgns8WwRHA77k_QI-7Z1JTPQGvqqVmqQlG3Hzz1PDLi1ISYA', onDuty: true },
              { name: 'Dr. Sarah Laine', role: 'Genomics Researcher', school: 'Johns Hopkins', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhYBvRHN4RfhoVYgOWZniUceBf9mFZnDxsqpsjx2tuCk4qmJPc-eYR0e6sD53wrqZM3LF9ikiFO6-I96zosgWHZ2ol-JvUklVKBkU7pGD27SJXVmweTd71DvLTtTljBH6g4l6YJFT4UVf7VYWtMXRMkQGf25SRm65qBch1fSyO867mOnZvWTvhXWAjPSzngmmzzcK0IR9FgkxLAMGw5FBl7W2qF83IB8hvAfGxAACThanvaExuOI1RCCie1i1HGXY8AoVUP3TkeE', onDuty: false },
            ].map(doc => (
              <div key={doc.name} className="group">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                  <img alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={doc.img} />
                  {doc.onDuty && (
                    <div className="absolute bottom-4 right-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      ON DUTY
                    </div>
                  )}
                </div>
                <h4 className="text-xl font-bold font-headline text-on-surface">{doc.name}</h4>
                <p className="text-primary text-sm font-semibold mb-2">{doc.role}</p>
                <p className="text-xs text-on-surface-variant italic">{doc.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATIENT PORTAL PREVIEW ── */}
      <section className="py-24 bg-surface-container-high overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 relative">
              <div className="relative z-10 p-8 rounded-[2rem] bg-white shadow-2xl border border-white/50">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Welcome Back</div>
                    <div className="text-2xl font-bold font-headline">{user?.name || 'Patient #CC-9421'}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-surface-container-low flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">calendar_today</span>
                      </div>
                      <div>
                        <div className="font-bold">Annual Check-up</div>
                        <div className="text-xs text-slate-500">Oct 24, 2024 at 10:00 AM</div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/annual-checkup')} className="text-primary font-bold text-sm tracking-wide hover:underline">Reschedule</button>
                  </div>
                  <div className="p-6 rounded-2xl bg-surface-container-low flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined">lab_research</span>
                      </div>
                      <div>
                        <div className="font-bold">Lab Results Ready</div>
                        <div className="text-xs text-slate-500">Metabolic Panel Available</div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/appointments')} className="bg-tertiary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform">View Rx</button>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-tertiary/20 rounded-full blur-3xl -z-0" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <h2 className="text-4xl font-extrabold font-headline mb-6 text-on-surface">Your Health, <br /><span className="text-primary">Fully Curated.</span></h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Our proprietary patient portal offers real-time access to clinical data, genetic insights, and direct communication with your care team. Total transparency for total peace of mind.
              </p>
              <ul className="space-y-4 mb-10">
                {['Biometric health tracking integration', 'Secure multi-factor data encryption', 'Direct-to-Specialist messaging'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
                className="bg-primary-container text-white px-10 py-4 rounded-full font-headline font-bold shadow-xl shadow-primary-container/20 hover:bg-primary transition-colors"
              >
                Access Patient Portal
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOSPITAL CTA Banner ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-white mb-4">
            Is your hospital <span className="text-cyan-400">on the network?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
            Join thousands of healthcare providers on MediAccess. Register your hospital and start managing appointments, patients, and resources with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register-hospital')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-blue-500/30 text-lg"
            >
              Register Your Hospital
            </motion.button>
            <button onClick={() => navigate('/hospitals')} className="border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/5 transition-colors text-lg">
              Browse Hospitals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Home;
