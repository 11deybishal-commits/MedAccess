import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiActivity, FiSearch, FiShield, FiAlertTriangle, FiMapPin,
  FiLayers, FiHeart, FiChevronLeft, FiChevronRight, FiWind, FiCpu
} from 'react-icons/fi';
import { GiBrain } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import { hospitalService } from '../services/authService';
import HospitalCard from '../components/HospitalCard';

/* ─── Real Organ Image Data ──────────────────────────────────────────────────── */
const anatomyData = {
  neurology: {
    id: 'neurology',
    title: 'Neuropathology & Brain',
    icon: <GiBrain className="text-4xl" />,
    // High-quality real brain anatomy image (Wikimedia CC)
    realImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/PurkinjeCell.jpg/640px-PurkinjeCell.jpg',
    overlayImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/BrainCaudal.jpg/640px-BrainCaudal.jpg',
    color: 'from-purple-600 to-indigo-700',
    glowColor: 'rgba(99,102,241,0.5)',
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    accent: '#6366f1',
    tags: ['#1 Cause: Stroke', '15M cases/yr', 'Neuroplasticity'],
    diseases: [
      {
        name: "Alzheimer's Disease",
        symptoms: ['Memory loss', 'Confusion', 'Difficulty recognizing family'],
        causes: 'Amyloid plaques and neurofibrillary tangles form in the brain, causing progressive neuron death and disruption of cognitive function.',
        precautions: ['Mental exercises daily', 'Heart-healthy cardiovascular diet', 'Quality sleep 7-9 hrs', 'Social engagement'],
        cures: 'No cure exists. Management via Cholinesterase inhibitors (Donepezil), Memantine, and continuous cognitive-behavioral therapy.',
        affectedArea: 'Hippocampus & Prefrontal Cortex',
        severity: 'Chronic/Progressive',
      },
      {
        name: 'Migraine',
        symptoms: ['Severe throbbing pain', 'Nausea', 'Sensitivity to light', 'Visual aura'],
        causes: "Genetic and environmental factors cause abnormal brain activity affecting trigeminal nerve signal pathways and serotonin regulation.",
        precautions: ['Identify & avoid triggers', 'Stay hydrated', 'Manage stress levels', 'Regular sleep schedule'],
        cures: 'Triptans for acute relief, CGRP-antagonists for prevention, biofeedback therapy for long-term management.',
        affectedArea: 'Trigeminal Nerve Pathways',
        severity: 'Episodic',
      },
      {
        name: 'Multiple Sclerosis (MS)',
        symptoms: ['Vision loss', 'Chronic pain', 'Fatigue', 'Impaired coordination', 'Muscle weakness'],
        causes: 'The immune system erroneously attacks the protective myelin sheath covering nerve fibers in the brain and spinal cord.',
        precautions: ['Stress management techniques', 'Adequate Vitamin D (sun exposure)', 'Moderate exercise', 'Anti-inflammatory diet'],
        cures: 'Immunosuppressants (Ocrelizumab), physical therapy, and muscle relaxants for symptom management.',
        affectedArea: 'Myelin Sheath (CNS)',
        severity: 'Auto-immune/Chronic',
      },
    ],
  },
  cardiology: {
    id: 'cardiology',
    title: 'Cardiovascular System',
    icon: <FiHeart className="text-4xl" />,
    realImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/SEM_blood_cells.jpg/640px-SEM_blood_cells.jpg',
    overlayImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Blausen_0451_Heart_TomographicAnatomy.jpg/640px-Blausen_0451_Heart_TomographicAnatomy.jpg',
    color: 'from-rose-500 to-red-700',
    glowColor: 'rgba(239,68,68,0.5)',
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50',
    accent: '#f43f5e',
    tags: ['#1 Global Killer', '18M deaths/yr', 'Preventable 80%'],
    diseases: [
      {
        name: 'Coronary Artery Disease',
        symptoms: ['Chest pain (Angina)', 'Shortness of breath', 'Fatigue', 'Cold sweats', 'Nausea'],
        causes: "Atherosclerosis — plaque buildup (cholesterol, fat, calcium) narrows coronary arteries, severely restricting oxygenated blood flow to heart muscle.",
        precautions: ['Heart-healthy Mediterranean diet', 'Regular cardiovascular exercise 150 min/week', 'No smoking', 'Monitor blood pressure & cholesterol'],
        cures: 'Statins, Beta-blockers, Aspirin therapy; Angioplasty (balloon), Coronary Artery Bypass Grafting (CABG) for severe cases.',
        affectedArea: 'Coronary Arteries & Myocardium',
        severity: 'Life-threatening',
      },
      {
        name: 'Arrhythmia',
        symptoms: ['Fluttering in chest', 'Racing or slow heartbeat', 'Dizziness', 'Shortness of breath', 'Fainting'],
        causes: "Electrical impulses coordinating heartbeats function abnormally due to electrolyte imbalances, structural heart disease, or genetic mutations.",
        precautions: ['Limit caffeine & alcohol', 'Maintain healthy weight', 'Manage stress', 'Avoid stimulant medications'],
        cures: 'Anti-arrhythmic drugs, Pacemakers, Implantable Cardioverter-Defibrillators (ICD), or catheter ablation procedures.',
        affectedArea: 'Electrical Conduction System',
        severity: 'Moderate to Severe',
      },
      {
        name: 'Heart Failure',
        symptoms: ['Shortness of breath with activity', 'Leg & ankle swelling', 'Rapid heartbeat', 'Chronic cough', 'Extreme fatigue'],
        causes: "The heart muscle is weakened and can't pump sufficient blood to meet the body's demands — often a consequence of untreated CAD or hypertension.",
        precautions: ['Monitor daily fluid & sodium intake', 'Track weight changes daily', 'Take medications faithfully', 'Elevate legs when resting'],
        cures: 'ACE inhibitors, ARBs, Diuretics, Digoxin; surgical LVAD (heart pump) or cardiac transplant in end-stage cases.',
        affectedArea: 'Left/Right Ventricular Muscle',
        severity: 'Chronic/Progressive',
      },
    ],
  },
  orthopedics: {
    id: 'orthopedics',
    title: 'Orthopedics & Musculoskeletal',
    icon: <FiLayers className="text-4xl" />,
    realImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Cement_arthroplasty.jpg/640px-Cement_arthroplasty.jpg',
    overlayImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Knee_diagram.svg/640px-Knee_diagram.svg',
    color: 'from-slate-600 to-slate-900',
    glowColor: 'rgba(100,116,139,0.5)',
    iconColor: 'text-slate-800',
    bgColor: 'bg-slate-100',
    accent: '#475569',
    tags: ['530M affected', 'Aging Population', 'Mobility Impact'],
    diseases: [
      {
        name: 'Osteoarthritis',
        symptoms: ['Joint pain & aching', 'Morning stiffness', 'Loss of flexibility', 'Bone spurs', 'Grating sensation'],
        causes: 'Gradual, irreversible wearing down of articular cartilage at the ends of bones, causing bone-on-bone friction and inflammation.',
        precautions: ['Maintain healthy body weight', 'Low-impact exercises (swimming, cycling)', 'Protect joints from injury', 'Physical therapy'],
        cures: 'NSAIDs (ibuprofen), Corticosteroid injections, Physical therapy, Hyaluronic acid injections; Total joint replacement surgery.',
        affectedArea: 'Articular Cartilage & Synovium',
        severity: 'Chronic/Degenerative',
      },
      {
        name: 'Muscular Dystrophy',
        symptoms: ['Frequent falls', 'Difficulty rising from seated/lying', 'Muscle pain & stiffness', 'Progressive weakness', 'Learning difficulties'],
        causes: 'Genetic mutations disrupt production of dystrophin — the protein that keeps muscle cells intact — causing progressive muscle fiber breakdown.',
        precautions: ['Structured physical therapy', 'Low-impact stretching routines', 'Avoid overexertion', 'Respiratory support as needed'],
        cures: 'No curative treatment. Corticosteroids (Prednisone), Eteplirsen (Exondys 51), heart & respiratory medications, and rigorous therapy.',
        affectedArea: 'Skeletal Muscle Fibers (Systemic)',
        severity: 'Genetic/Progressive',
      },
      {
        name: 'Osteoporosis',
        symptoms: ['Back pain from fractured vertebra', 'Gradual height loss', 'Stooped posture', 'Easily fractured bones', 'Bone fragility'],
        causes: 'Bones lose calcium and phosphate mineral density at a rate faster than new bone formation, making them porous and brittle.',
        precautions: ['Calcium (1200mg/day) & Vitamin D3 (800 IU/day)', 'Weight-bearing exercises', 'Avoid smoking & excess alcohol'],
        cures: 'Bisphosphonates (Alendronate), Denosumab, Hormone therapies (Estrogen for women), Teriparatide for severe osteoporosis.',
        affectedArea: 'Trabecular & Cortical Bone',
        severity: 'Chronic/Preventable',
      },
    ],
  },
  pulmonology: {
    id: 'pulmonology',
    title: 'Pulmonology & Lungs',
    icon: <FiWind className="text-4xl" />,
    realImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lungs_open.jpg/640px-Lungs_open.jpg',
    overlayImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Alveolus_diagram.svg/640px-Alveolus_diagram.svg',
    color: 'from-sky-500 to-blue-800',
    glowColor: 'rgba(14,165,233,0.5)',
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
    accent: '#0ea5e9',
    tags: ['COPD 328M', 'Asthma 339M', 'COVID variants'],
    diseases: [
      {
        name: 'COPD',
        symptoms: ['Chronic cough with mucus', 'Shortness of breath', 'Wheezing', 'Chest tightness', 'Frequent respiratory infections'],
        causes: 'Long-term exposure to irritants (primarily cigarette smoke) destroys alveoli and inflames bronchial tubes, permanently reducing airflow.',
        precautions: ['Quit smoking (primary)', 'Avoid air pollution & chemical fumes', 'Annual flu & pneumococcal vaccines'],
        cures: 'Bronchodilators (Salbutamol), Corticosteroids inhaled, Supplemental oxygen therapy, Pulmonary rehabilitation programs.',
        affectedArea: 'Bronchi & Alveoli',
        severity: 'Chronic/Irreversible',
      },
      {
        name: 'Asthma',
        symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Sleep-disrupting cough', 'Exercise intolerance'],
        causes: 'Chronic inflammation of bronchial tubes causes airway hyper-responsiveness to triggers like allergens, cold air, or exercise.',
        precautions: ['Identify & avoid personal triggers', 'Use air purifiers indoors', 'Annual flu vaccination', 'Monitor peak flow readings'],
        cures: 'Short-acting β2-agonists (SABA), Inhaled Corticosteroids (ICS), Leukotriene modifiers; Biologic therapies for severe cases.',
        affectedArea: 'Bronchial Airways',
        severity: 'Chronic/Manageable',
      },
      {
        name: 'Pneumonia',
        symptoms: ['High fever & chills', 'Productive cough', 'Chest pain when breathing', 'Rapid breathing', 'Low oxygen saturation'],
        causes: 'Bacterial (Streptococcus pneumoniae), viral, or fungal infection causes fluid & pus to fill the air sacs (alveoli) in one or both lungs.',
        precautions: ['Pneumococcal & flu vaccination', 'Regular handwashing', 'Avoid smoking', 'Maintain strong immune system'],
        cures: 'Antibiotics (Amoxicillin, Azithromycin for bacterial), antivirals, hospitalization with IV antibiotics & oxygen for severe cases.',
        affectedArea: 'Alveoli (Air Sacs)',
        severity: 'Acute/Potentially Fatal',
      },
    ],
  },
};

/* ─── Live Typing Ticker Hook ────────────────────────────────────────────────── */
const useTypewriter = (text, speed = 35) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
};

/* ─── Pulse Ring Component ───────────────────────────────────────────────────── */
const PulseRings = ({ color }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {[1, 1.5, 2].map((scale, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{ borderColor: color, width: '60%', height: '60%' }}
        animate={{ scale: [scale, scale + 0.4], opacity: [0.5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
      />
    ))}
  </div>
);

const SYSTEM_KEYS = Object.keys(anatomyData);

const InteractiveAnatomy = () => {
  const [activeTab, setActiveTab] = useState('neurology');
  const [activeDisease, setActiveDisease] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  const currentSystem = anatomyData[activeTab];
  const disease = currentSystem.diseases[activeDisease];
  const typedCauses = useTypewriter(disease.causes, 25);

  useEffect(() => { if (!location.latitude) getLocation(); }, []);
  useEffect(() => {
    setImgLoaded(false);
    setActiveDisease(0);
    setOverlayVisible(false);
  }, [activeTab]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      hospitalService.getNearbyHospitals(location.latitude, location.longitude, 50000)
        .then(r => setHospitals(r.data.hospitals.slice(0, 3)))
        .catch(e => console.error(e));
    }
  }, [location.latitude, activeTab]);

  const currentIdx = SYSTEM_KEYS.indexOf(activeTab);
  const goPrev = () => setActiveTab(SYSTEM_KEYS[(currentIdx - 1 + SYSTEM_KEYS.length) % SYSTEM_KEYS.length]);
  const goNext = () => setActiveTab(SYSTEM_KEYS[(currentIdx + 1) % SYSTEM_KEYS.length]);

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 font-body text-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-widest text-xs mb-6 border border-blue-100/50">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Live Interactive 3D Teacher</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold font-headline text-slate-900 tracking-tight">
            Virtual Anatomy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Explorer</span>
          </motion.h1>
          <p className="max-w-xl mx-auto mt-6 text-slate-500 font-medium text-lg">
            Real organ imagery with live rotating 3D views, AI-powered disease analysis, and pinpointed specialist recommendations.
          </p>
        </div>

        {/* System Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {Object.values(anatomyData).map(sys => (
            <button
              key={sys.id}
              onClick={() => setActiveTab(sys.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-full font-bold transition-all border-2 shadow-sm text-sm
                ${activeTab === sys.id
                  ? `bg-gradient-to-r ${sys.color} text-white border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.15)] scale-105`
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <div className="text-3xl flex items-center">{sys.icon}</div>
              <span>{sys.title}</span>
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className={`rounded-[3rem] p-6 md:p-12 border ${currentSystem.bgColor} border-white shadow-2xl transition-colors duration-500`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* ── LEFT: Real Rotating 3D Organ Image ── */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="relative"
                style={{ perspective: '1200px' }}
              >
                {/* Image Container */}
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/60"
                  style={{ boxShadow: `0 30px 80px ${currentSystem.glowColor}, 0 0 0 1px rgba(255,255,255,0.5)` }}>

                  {/* Blur Placeholder */}
                  {!imgLoaded && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentSystem.color} animate-pulse`} />
                  )}

                  {/* 🔵 Real Organ Image — continuous 3D rotation */}
                  <motion.img
                    src={currentSystem.realImage}
                    alt={currentSystem.title}
                    onLoad={() => setImgLoaded(true)}
                    className="w-full h-full object-cover"
                    animate={{
                      rotateY: [0, 12, 0, -12, 0],
                      rotateX: [0, 4, 0, -4, 0],
                      scale: [1, 1.04, 1, 1.04, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentSystem.color} opacity-30 pointer-events-none`} />

                  {/* Scan Line */}
                  <motion.div
                    className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent ${currentSystem.color.includes('indigo') ? 'via-indigo-400/60' : currentSystem.color.includes('rose') ? 'via-rose-400/60' : 'via-blue-400/60'} to-transparent`}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Pulse Rings */}
                  <PulseRings color={currentSystem.accent} />

                  {/* Overlay Toggle Btn */}
                  <button onClick={() => setOverlayVisible(v => !v)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 border border-white shadow-lg hover:bg-white transition-colors flex items-center gap-1.5 z-20">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${overlayVisible ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    {overlayVisible ? 'Diagram View' : 'Anatomy View'}
                  </button>

                  {/* Overlay Image Fade */}
                  <AnimatePresence>
                    {overlayVisible && (
                      <motion.img
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        src={currentSystem.overlayImage}
                        alt="anatomy diagram"
                        className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* System Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentSystem.tags.map(tag => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${currentSystem.color} text-white shadow-sm`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Prev / Next system nav */}
                <div className="flex justify-between mt-4">
                  <button onClick={goPrev} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors">
                    <FiChevronLeft /> Prev System
                  </button>
                  <button onClick={goNext} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors">
                    Next System <FiChevronRight />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── RIGHT: Disease Info & Live Analysis ── */}
            <div className="space-y-6">
              {/* Disease Selector Tabs */}
              <div className="flex gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex-wrap">
                {currentSystem.diseases.map((d, i) => (
                  <button key={i} onClick={() => setActiveDisease(i)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      activeDisease === i ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {d.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeDisease + activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="space-y-5">
                  <div>
                    <h2 className="text-3xl font-extrabold font-headline text-slate-900">{disease.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-100">{disease.affectedArea}</span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        disease.severity.includes('fatal') || disease.severity.includes('Progressive') ? 'bg-red-50 text-red-700 border border-red-100' :
                        disease.severity.includes('Chronic') ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>{disease.severity}</span>
                    </div>
                  </div>

                  {/* Live Typewriter Causes */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                        <FiAlertTriangle />
                      </div>
                      <h4 className="font-bold text-slate-800">Biological Cause</h4>
                      <span className="ml-auto flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live Analysis
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm min-h-[60px]">
                      {typedCauses}
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
                    </p>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><FiSearch /></div>
                      <h4 className="font-bold text-slate-800">Identifying Symptoms</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {disease.symptoms.map(sym => (
                        <motion.span key={sym} whileHover={{ scale: 1.05 }} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-default">{sym}</motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Prevention & Treatment Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm"><FiShield className="text-blue-500" /> Prevention</h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 marker:text-blue-400">
                        {disease.precautions.map(pre => <li key={pre}>{pre}</li>)}
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm"><FiActivity className="text-emerald-500" /> Treatment</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{disease.cures}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button onClick={() => navigate('/appointments')}
                    className={`w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${currentSystem.color} shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] text-sm`}>
                    Book Specialist Consultation →
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="mt-24">
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
              {hospitals.map(h => <HospitalCard key={h.id} hospital={h} userLocation={location} />)}
            </div>
          ) : (
            <div className="bg-slate-50 p-12 rounded-[2rem] text-center border border-slate-100 flex flex-col items-center">
              <FiSearch className="text-4xl text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Enable location to find specialized treatment facilities near you.</p>
              <button onClick={getLocation} className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 shadow-lg">
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
