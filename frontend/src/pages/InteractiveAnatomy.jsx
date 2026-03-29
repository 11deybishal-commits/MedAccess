import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiSearch, FiShield, FiHeart, FiAlertTriangle, FiMapPin, FiLayers } from 'react-icons/fi';
import { GiBrain, GiHeartOrgan } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import { hospitalService } from '../services/authService';
import HospitalCard from '../components/HospitalCard';

const anatomyData = {
  neurology: {
    id: 'neurology',
    title: 'Neuropathology & Brain',
    icon: <GiBrain />,
    modelUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/brain-4712861-3914848.png',
    color: 'from-purple-500 to-indigo-600',
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    diseases: [
      {
        name: 'Alzheimer’s Disease',
        symptoms: ['Memory loss', 'Confusion', 'Difficulty recognizing family'],
        causes: 'Plaques and tangles forming in the brain leading to cell death.',
        precautions: ['Mental exercises', 'Healthy cardiovascular diet', 'Quality sleep'],
        cures: 'No cure. Management via Cholinesterase inhibitors and continuous therapy.'
      },
      {
        name: 'Migraine',
        symptoms: ['Severe throbbing pain', 'Nausea', 'Sensitivity to light'],
        causes: 'Genetic and environmental factors; abnormal brain activity affecting nerve signals.',
        precautions: ['Avoid known triggers', 'Hydrate', 'Manage stress'],
        cures: 'Pain-relieving medications (Triptans) and preventive therapies.'
      },
      {
        name: 'Multiple Sclerosis (MS)',
        symptoms: ['Vision loss', 'Pain', 'Fatigue', 'Impaired coordination'],
        causes: 'Immune system attacks the protective myelin sheath covering nerve fibers.',
        precautions: ['Stress management', 'Adequate Vitamin D', 'Moderate exercise'],
        cures: 'Immunosuppressants, physical therapy, and muscle relaxants.'
      }
    ]
  },
  cardiology: {
    id: 'cardiology',
    title: 'Cardiovascular System',
    icon: <GiHeartOrgan />,
    modelUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/heart-5374026-4496229.png',
    color: 'from-rose-500 to-red-600',
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50',
    diseases: [
      {
        name: 'Coronary Artery Disease',
        symptoms: ['Chest pain (Angina)', 'Shortness of breath', 'Fatigue'],
        causes: 'Plaque buildup narrows coronary arteries, decreasing blood flow.',
        precautions: ['Heart-healthy diet', 'Regular cardiovascular exercise', 'No smoking'],
        cures: 'Statins, Beta-blockers; surgical interventions like Angioplasty or bypass.'
      },
      {
        name: 'Arrhythmia',
        symptoms: ['Fluttering in chest', 'Racing heartbeat', 'Dizziness'],
        causes: 'Electrical impulses coordinating heartbeats don’t work properly.',
        precautions: ['Limit caffeine/alcohol', 'Maintain healthy weight'],
        cures: 'Anti-arrhythmic drugs, Pacemakers, or catheter ablation procedures.'
      },
      {
        name: 'Heart Failure',
        symptoms: ['Shortness of breath with activity', 'Swelling in legs', 'Rapid heartbeat'],
        causes: 'Heart muscle doesn\'t pump blood as well as it should (often due to CAD).',
        precautions: ['Monitor fluid intake', 'Low sodium diet', 'Daily weight checks'],
        cures: 'ACE inhibitors, Diuretics, and sometimes surgical heart pumps or transplants.'
      }
    ]
  },
  radiology: {
    id: 'radiology',
    title: 'Orthopedics & Muscular System',
    icon: <FiLayers />,
    modelUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/skeleton-hand-7472099-6014457.png',
    color: 'from-slate-600 to-slate-800',
    iconColor: 'text-slate-800',
    bgColor: 'bg-slate-100',
    diseases: [
      {
        name: 'Osteoarthritis',
        symptoms: ['Joint pain', 'Stiffness', 'Loss of flexibility', 'Bone spurs'],
        causes: 'Gradual wearing down of protective cartilage at the ends of bones.',
        precautions: ['Maintain healthy weight', 'Low-impact exercises', 'Protect joints'],
        cures: 'Pain management (NSAIDs), physical therapy, or joint replacement surgery.'
      },
      {
        name: 'Muscular Dystrophy',
        symptoms: ['Frequent falls', 'Difficulty rising', 'Muscle pain', 'Stiffness'],
        causes: 'Genetic mutations interfering with the production of proteins needed to form healthy muscle.',
        precautions: ['Physical therapy', 'Low-impact stretching', 'Avoid overexertion'],
        cures: 'No cure. Corticosteroids, heart medications, and physical/respiratory therapy.'
      },
      {
        name: 'Osteoporosis',
        symptoms: ['Back pain', 'Loss of height over time', 'Bone fractures'],
        causes: 'Bones lose mass and density over time, becoming brittle.',
        precautions: ['Calcium & Vitamin D intake', 'Weight-bearing exercises'],
        cures: 'Bisphosphonates, hormone therapies to preserve bone density.'
      }
    ]
  }
};

const InteractiveAnatomy = () => {
  const [activeTab, setActiveTab] = useState('neurology');
  const [activeDisease, setActiveDisease] = useState(0);
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  const currentSystem = anatomyData[activeTab];
  const disease = currentSystem.diseases[activeDisease];

  useEffect(() => {
    // Attempt to get location quietly so we can show hospitals
    if (!location.latitude) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchHospitals();
    }
  }, [location.latitude, activeTab]);

  const fetchHospitals = async () => {
    try {
      const response = await hospitalService.getNearbyHospitals(location.latitude, location.longitude, 50000); // 50km radius
      setHospitals(response.data.hospitals.slice(0, 3));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 font-body text-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-widest text-xs mb-6 border border-blue-100/50"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Interactive 3D Teacher</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold font-headline text-slate-900 tracking-tight"
          >
            Virtual Anatomy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Explorer</span>
          </motion.h1>
          <p className="max-w-xl mx-auto mt-6 text-slate-500 font-medium text-lg">
            Immerse yourself in our AI-powered anatomical studies. Learn about critical biological systems, their vulnerabilities, and modern medical cures.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {Object.values(anatomyData).map((sys) => (
            <button
              key={sys.id}
              onClick={() => { setActiveTab(sys.id); setActiveDisease(0); }}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all border-2 shadow-sm 
                ${activeTab === sys.id 
                  ? `bg-gradient-to-r ${sys.color} text-white border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.15)] scale-105` 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <div className="text-4xl flex items-center">{sys.icon}</div>
              <span className="text-lg">{sys.title}</span>
            </button>
          ))}
        </div>

        {/* 3D Display & Info Panel */}
        <div className={`rounded-[3rem] p-8 md:p-12 border ${currentSystem.bgColor} border-white shadow-2xl transition-colors duration-500`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* 3D Animation Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                className="relative aspect-square rounded-full flex items-center justify-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSystem.color} opacity-10 rounded-full blur-[100px]`}></div>
                <div className="relative w-[80%] h-[80%] rounded-[4rem] bg-white/40 backdrop-blur-xl border border-white flex items-center justify-center overflow-hidden shadow-inner">
                  {/* Floating Giant Icon as 3D Model substitute */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      scale: [1, 1.05, 1],
                      rotateX: [0, 5, -5, 0],
                      rotateY: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`text-[12rem] ${currentSystem.iconColor} drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] flex items-center justify-center filter brightness-110 contrast-125`}
                  >
                    {currentSystem.icon}
                  </motion.div>
                  {/* Glowing Scanner Line */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className={`absolute left-0 right-0 h-1 bg-gradient-to-r ${currentSystem.color} opacity-40 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Disease Information Data */}
            <div className="space-y-8">
              {/* Select Disease sub-tabs */}
              <div className="flex gap-2 p-2 bg-white/50 backdrop-blur-md rounded-2xl w-max border border-white">
                {currentSystem.diseases.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDisease(i)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      activeDisease === i ? 'bg-white shadow-md text-slate-900 border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDisease + activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl font-extrabold font-headline">{disease.name}</h2>
                  
                  <div className="space-y-6">
                    {/* Causes Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                        <FiAlertTriangle className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Biological Cause</h4>
                        <p className="text-slate-600 leading-relaxed text-sm">{disease.causes}</p>
                      </div>
                    </div>

                    {/* Symptoms Grid */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                          <FiSearch />
                        </div>
                        <h4 className="font-bold text-slate-800">Identifying Symptoms</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {disease.symptoms.map(sym => (
                          <span key={sym} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Precautions & Cures */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                          <FiShield className="text-blue-500" /> Prevention
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-blue-400">
                          {disease.precautions.map(pre => (
                            <li key={pre}>{pre}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                          <FiActivity className="text-emerald-500" /> Treatment
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{disease.cures}</p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Nearby Hospitals Hook */}
        <div className="mt-32">
          <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Relevant Care</span>
              <h3 className="text-3xl font-extrabold font-headline">Nearby Facilities for {currentSystem.title}</h3>
            </div>
            <button onClick={getLocation} className="text-sm font-bold text-primary flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
              <FiMapPin /> Update Location
            </button>
          </div>
          
          {hospitals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {hospitals.map(h => (
                <HospitalCard key={h.id} hospital={h} userLocation={location} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 p-12 rounded-[2rem] text-center border border-slate-100 flex flex-col items-center">
              <FiSearch className="text-4xl text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Please enable location tracking to find specialized treatment facilities near you.</p>
              <button 
                onClick={getLocation}
                className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 shadow-lg"
              >
                Find Hospitals
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InteractiveAnatomy;
