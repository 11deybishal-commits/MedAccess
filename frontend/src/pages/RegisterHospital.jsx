import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle,
  FiHeart, FiCheckCircle, FiChevronRight, FiChevronLeft, FiFile,
  FiHome, FiGrid, FiActivity
} from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min.js';

const SPECIALTIES_LIST = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Oncology',
  'Pediatrics', 'Gynecology', 'Dermatology', 'Psychiatry', 'General Surgery',
  'Emergency Medicine', 'Ophthalmology', 'ENT', 'Urology', 'Nephrology',
  'Pulmonology', 'Gastroenterology', 'Endocrinology', 'Rheumatology', 'Geriatrics'
];

const STEPS = [
  { id: 1, label: 'Admin Info', icon: FiUser },
  { id: 2, label: 'Hospital Details', icon: FiHome },
  { id: 3, label: 'Services & Capacity', icon: FiGrid },
];

const RegisterHospital = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Step 2
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    registrationNumber: '',
    hospitalLat: '',
    hospitalLng: '',
    hospitalDescription: '',
    // Step 3
    hospitalSpecialties: [],
    totalBeds: '',
    availableBeds: '',
  });

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          highlightColor: 0x0ea5e9,
          midtoneColor: 0x2563eb,
          lowlightColor: 0x1e3a8a,
          baseColor: 0x050e1a,
          blurFactor: 0.55,
          speed: 1.2,
          zoom: 1.3,
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleSpecialty = (spec) => {
    setFormData(prev => ({
      ...prev,
      hospitalSpecialties: prev.hospitalSpecialties.includes(spec)
        ? prev.hospitalSpecialties.filter(s => s !== spec)
        : [...prev.hospitalSpecialties, spec],
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password || formData.password.length < 6) newErrors.password = 'Min. 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }
    if (currentStep === 2) {
      if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
      if (!formData.hospitalAddress.trim()) newErrors.hospitalAddress = 'Address is required';
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    }
    if (currentStep === 3) {
      if (formData.hospitalSpecialties.length === 0) newErrors.hospitalSpecialties = 'Select at least one specialty';
      if (!formData.totalBeds) newErrors.totalBeds = 'Total beds required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        hospitalPhone: formData.hospitalPhone || formData.phone,
        registrationNumber: formData.registrationNumber,
        hospitalDescription: formData.hospitalDescription,
        hospitalSpecialties: formData.hospitalSpecialties,
        totalBeds: Number(formData.totalBeds) || 0,
        availableBeds: Number(formData.availableBeds) || 0,
        hospitalLat: formData.hospitalLat ? Number(formData.hospitalLat) : null,
        hospitalLng: formData.hospitalLng ? Number(formData.hospitalLng) : null,
      };
      const response = await authService.registerHospital(payload);
      const { token, user } = response.data;
      login(user, token);
      toast.success('🏥 Hospital registered successfully! Welcome aboard.');
      navigate('/hospital-admin');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, error }) => (
    <div>
      <label className="block text-white/80 text-xs font-bold mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300/70 group-focus-within:text-sky-400 transition-colors text-sm" />}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white/5 border ${error ? 'border-red-400/60' : 'border-white/10'} text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/10 transition-all placeholder-white/25 text-sm`}
        />
      </div>
      {error && (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
          <FiAlertCircle className="flex-shrink-0" /> {error}
        </motion.div>
      )}
    </div>
  );

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000d1a]/30 to-[#000d1a]/70 pointer-events-none z-0" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10 my-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-blue-500/40"
          >
            <GiCaduceus />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white font-headline tracking-tight">Register Your Hospital</h1>
          <p className="text-sky-200/70 font-medium mt-1.5 text-sm">Join the MediAccess healthcare network</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' :
                  isDone ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-white/30'
                }`}>
                  {isDone ? <FiCheckCircle /> : <Icon />}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-px flex-1 max-w-[40px] ${currentStep > step.id ? 'bg-sky-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.5)] p-8">
          <AnimatePresence mode="wait">
            {/* ── STEP 1 ── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiUser className="text-sky-400" /> Administrator Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name" name="name" placeholder="Dr. John Smith" icon={FiUser} error={errors.name} />
                  <InputField label="Email Address" name="email" type="email" placeholder="admin@hospital.com" icon={FiMail} error={errors.email} />
                </div>
                <InputField label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" icon={FiPhone} error={errors.phone} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Password" name="password" type="password" placeholder="Min. 6 characters" icon={FiLock} error={errors.password} />
                  <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" icon={FiLock} error={errors.confirmPassword} />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiHome className="text-sky-400" /> Hospital Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Hospital Name" name="hospitalName" placeholder="City General Hospital" icon={FiHome} error={errors.hospitalName} />
                  <InputField label="Registration Number" name="registrationNumber" placeholder="REG-2024-XXXX" icon={FiFile} error={errors.registrationNumber} />
                </div>
                <InputField label="Hospital Address" name="hospitalAddress" placeholder="123 Healthcare Ave, Medical District" icon={FiMapPin} error={errors.hospitalAddress} />
                <InputField label="Hospital Phone" name="hospitalPhone" type="tel" placeholder="+91 XXXXX XXXXX" icon={FiPhone} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Latitude (optional)" name="hospitalLat" placeholder="e.g. 28.6139" icon={FiMapPin} />
                  <InputField label="Longitude (optional)" name="hospitalLng" placeholder="e.g. 77.2090" icon={FiMapPin} />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold mb-1.5 uppercase tracking-wider">Description (optional)</label>
                  <textarea
                    name="hospitalDescription"
                    value={formData.hospitalDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your hospital, facilities, and specializations..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-white/10 transition-all placeholder-white/25 text-sm resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiGrid className="text-sky-400" /> Services & Capacity</h2>

                <div>
                  <label className="block text-white/80 text-xs font-bold mb-3 uppercase tracking-wider">Specialties Offered</label>
                  {errors.hospitalSpecialties && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs mb-2"><FiAlertCircle /> {errors.hospitalSpecialties}</div>
                  )}
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {SPECIALTIES_LIST.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          formData.hospitalSpecialties.includes(spec)
                            ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                            : 'bg-white/5 text-white/60 border-white/10 hover:border-sky-400/40 hover:text-white/90'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                  {formData.hospitalSpecialties.length > 0 && (
                    <p className="text-sky-400 text-xs mt-2 font-medium">{formData.hospitalSpecialties.length} specialty/ies selected</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Total Beds" name="totalBeds" type="number" placeholder="e.g. 200" icon={FiActivity} error={errors.totalBeds} />
                  <InputField label="Available Beds" name="availableBeds" type="number" placeholder="e.g. 80" icon={FiActivity} />
                </div>

                <div className="p-4 bg-sky-500/10 border border-sky-400/20 rounded-xl">
                  <h4 className="text-sky-300 font-bold text-sm mb-2 flex items-center gap-2"><FiCheckCircle /> Summary Preview</h4>
                  <div className="text-white/70 text-xs space-y-1">
                    <p><span className="text-white/50">Hospital:</span> {formData.hospitalName || '—'}</p>
                    <p><span className="text-white/50">Admin:</span> {formData.name || '—'}</p>
                    <p><span className="text-white/50">Beds:</span> {formData.totalBeds || '—'} total</p>
                    <p><span className="text-white/50">Specialties:</span> {formData.hospitalSpecialties.join(', ') || '—'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiChevronLeft /> Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02]"
              >
                Next Step <FiChevronRight />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
                ) : (
                  <><FiCheckCircle /> Complete Registration</>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            Already registered?{' '}
            <button onClick={() => navigate('/login')} className="text-sky-400 font-bold hover:text-sky-300 hover:underline transition-all">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterHospital;
