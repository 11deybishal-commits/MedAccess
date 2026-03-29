import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import { hospitalService } from '../services/authService.js';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchNearbyHospitals();
    }
  }, [location.latitude, location.longitude]);

  const fetchNearbyHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getNearbyHospitals(
        location.latitude,
        location.longitude,
        5000
      );
      setHospitals(response.data.hospitals.slice(0, 3));
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/${type === 'hospital' ? 'hospitals' : 'blood-requests'}`);
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen pt-28">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] pb-20 mt-4 flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 neuron-pattern -z-10"></div>
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-1/2 h-[80%] bg-gradient-to-l from-blue-50/50 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary-container/10 text-tertiary font-semibold text-xs uppercase tracking-widest border border-tertiary/10">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              World-Class Diagnostic Care
            </div>
            <h1 className="text-5xl md:text-[5rem] font-extrabold font-headline leading-[1.05] tracking-tight text-on-surface">
              Curating <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary">Precision</span> <br /> Medicine.
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
              Where advanced clinical research meets empathetic patient care. Experience a medical journey designed around your unique biological blueprint.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button onClick={() => navigate('/hospitals')} className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-base md:text-lg hover:bg-primary-container transition-all scale-100 active:scale-95 shadow-xl shadow-primary/20">
                Find Hospitals
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 font-headline font-bold text-primary group"
              >
                Join MedAccess
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center items-center w-full min-h-[500px]"
          >
            <div className="relative w-full aspect-square max-w-xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-tertiary/5 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-500">
                <div className="relative flex justify-center items-center w-full h-[500px]">
                  {/* Outer spinning ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-64 h-64 border-[1px] border-primary/40 rounded-full border-dashed"
                  ></motion.div>
                  {/* Inner reverse spinning ring */}
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border-[2px] border-tertiary/50 rounded-full"
                  ></motion.div>
                  
                  {/* Central glowing core / model substitute */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.05, 1],
                      rotateX: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative w-40 h-40 bg-gradient-to-br from-primary to-tertiary rounded-full shadow-[0_0_80px_rgba(59,130,246,0.5)] flex items-center justify-center backdrop-blur-2xl border-4 border-white/20"
                  >
                    {/* Fake DNA / Helix CSS bars inside */}
                    <div className="flex flex-col gap-2 w-16 opacity-80 mix-blend-overlay">
                       <motion.div animate={{ scaleX: [0.5, 1.5, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 bg-white rounded-full"></motion.div>
                       <motion.div animate={{ scaleX: [0.8, 1.2, 0.8] }} transition={{ duration: 2.2, repeat: Infinity }} className="h-2 bg-white rounded-full"></motion.div>
                       <motion.div animate={{ scaleX: [1.2, 0.8, 1.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="h-2 bg-white rounded-full"></motion.div>
                       <motion.div animate={{ scaleX: [1.5, 0.5, 1.5] }} transition={{ duration: 2.8, repeat: Infinity }} className="h-2 bg-white rounded-full"></motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute top-10 right-10 bg-white/90 p-4 rounded-xl shadow-xl backdrop-blur-xl border border-blue-50 z-20">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">AI Diagnostic Speed</div>
                  <div className="text-2xl font-bold text-primary">0.4s <span className="text-tertiary text-sm">/ scan</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Panel */}
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          <EmergencyPanel onEmergency={handleEmergency} location={location} />
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-4">Core Disciplines</h2>
              <p className="text-on-surface-variant max-w-md">Our specialized departments utilize the latest in molecular diagnostics and robotic intervention.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest h-[500px] transition-all hover:shadow-2xl cursor-pointer" onClick={() => navigate('/interactive-anatomy')}>
              <img alt="Neurology" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv8LGiRumM64Avbz3SJDk4nUvpNTE7n38MYi3sd9NOiwhX3ta_W8AC9rscSWHK2vYFFiI0_HgH_oJgihJNVPKEnOe9aIm3HWeZHFamhu0HXqA7sWT4B4wCkiej-vTaPtKG4UakIjf3GN6u5_MBKP5zwRb4Y29ibSDlSdqKhufcbiJele8CiHtaQK5xZknwppHzsNiyZSeCfye6TkSqRAt-tSKlbEBZfJT0wwL-Le2W6R6ZIymTR4f28p0YEg6wmDwrbrq_IFjrHPk" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-0 p-10 text-white">
                <div className="mb-4 inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="text-3xl font-bold font-headline mb-2">Neurology</h3>
                <p className="text-white/80 line-clamp-2">Pioneering neuro-regeneration therapies and advanced stroke care protocols.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest h-[500px] transition-all hover:shadow-2xl cursor-pointer" onClick={() => navigate('/interactive-anatomy')}>
              <img alt="Cardiology" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjm_0F4Zdmz7VzKtG-7E5Gqe8l6LFLq-5HFc64yv4v62JkoprHy8gVxu9SODPJTMsbeo-2R2A5BtNRTR54IrPilPikybp57_G70vIFdwsv8PGZEzc6PZdJBJnpIEMnyaD81GzTqQWi2UN7aY8zaOwB6W7ELW9Ht0wOOqXn_ygZg-lXYpSg4yRiXiiHVfsATzPdqqqKP2zjQZntXAk7BWcX5UPU-4gm8c8xqoL9-BHu35pjWIWbpuGm4c9sLlo8LucakX0ATcG_eNA" />
              <div className="absolute inset-0 bg-gradient-to-t from-tertiary/90 via-tertiary/20 to-transparent"></div>
              <div className="absolute bottom-0 p-10 text-white">
                <div className="mb-4 inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h3 className="text-3xl font-bold font-headline mb-2">Cardiology</h3>
                <p className="text-white/80 line-clamp-2">Non-invasive cardiac imaging and personalized cardiovascular health management.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest h-[500px] transition-all hover:shadow-2xl cursor-pointer" onClick={() => navigate('/interactive-anatomy')}>
              <img alt="Radiology" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ_BpMHIaE-f8mJ37yGt-6WQD5212YrEc-Fvvce3gipR9PWqJFnwzPlsIkm5EeTwmtCdzGO_7zKyaHWosigvJoeHWOqL7BXhEYTOW7bIrJsU-a8y1crVLlQXaa7CtKyVIos2YEiDwnIbPgX_D3P8jckFTh2WC3gprVp_U8ydmHI_QBAbIpyxFs1W9DHDpPbjJNfV_29nd7sgWjI62bHu-EdHt9s4betA5q8ldPKcrgyM2rEjegRgEKDkjQveFiUCiJjz9jZ2Afg6g" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent"></div>
              <div className="absolute bottom-0 p-10 text-white">
                <div className="mb-4 inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl">biotech</span>
                </div>
                <h3 className="text-3xl font-bold font-headline mb-2">Radiology</h3>
                <p className="text-white/80 line-clamp-2">Next-generation imaging including 7T MRI and low-dose molecular CT scans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Near By Hospitals Logic */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Location Based</span>
              <h2 className="text-4xl font-extrabold font-headline mb-4">Nearby Hospitals</h2>
            </div>
            <button
              onClick={() => navigate('/hospitals')}
              className="text-primary font-bold hover:underline flex items-center gap-2"
            >
              View All <FiArrowRight />
            </button>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-container h-80 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="hover:scale-[1.02] transition-transform">
                     <HospitalCard hospital={hospital} userLocation={location} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-low p-12 rounded-3xl text-center text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">location_off</span>
              <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">Location Access Required</h3>
              <p className="max-w-md mx-auto mb-6">We need your location to find the best healthcare facilities in your immediate vicinity.</p>
              <button
                onClick={getLocation}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
              >
                Enable Location
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Specialists Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Elite Faculty</span>
            <h2 className="text-5xl font-extrabold font-headline mb-6">Meet Our Specialists</h2>
            <div className="w-20 h-1 bg-tertiary rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                <img alt="Specialist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi0zBjgSgULjJJ3FlF5vGdXOthCgfQUFJeT0uq0cIrM94cLcVMrpPZtlIs6IucE6fU5PwL92EnobbuNEc6sO0Kt73eK-c4MzJFiDCyRxAtxCeePM3sGkQay1tTMFdpqiTBoIq8Sc_NurJHZHGTWzQgJB6jCmdKog0YQ07c5ctw5dUomqx3BBxu4hYpAHLAA8aqalM5_WrcA80HvKBxSBNdvVO0TiGs0xGqNordVZjPbtyIOjAvGEavHClFhhK_df2JoGVD4-hq5aI" />
                <div className="absolute bottom-4 right-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  ON DUTY
                </div>
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Dr. Julian Sterling</h4>
              <p className="text-primary text-sm font-semibold mb-2">Chief of Neurosurgery</p>
              <p className="text-xs text-on-surface-variant italic">Harvard Medical School Faculty</p>
            </div>
            <div className="group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                <img alt="Specialist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMK5OH2gtcb2LCncMBUZyY9EAEsG25qGjXxNpxbGmvnzl4GMbYV9Wcy1p_bFwkEsDL5D7nSGkVfEyqblAdCsmtttriQ9S5S3VaMhluqiGn7QvaY7-1QIJ9BCAHFBYRTsFXcDd7rqduGDgSOsJpzkaiU4H7n8UoplriHHx3Q1AKOryiF6u-zHCLUhvkd8OYXPB0uIUiAyo7RdhJ2bs07ERuw-C-DSduOI9y2rChwD3GjqISh_g2Zu81kJlqxhfgwo8m5gVtrgXdzaI" />
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Dr. Elena Vance</h4>
              <p className="text-primary text-sm font-semibold mb-2">Cardiology Director</p>
              <p className="text-xs text-on-surface-variant italic">Yale School of Medicine</p>
            </div>
            <div className="group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                <img alt="Specialist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9GCxNS1eggJX-NyB1KRWh37VXA48KeUZnbMLBi50FREseQVqKvLEmeTb0IZqcFUjDhJ2clyEPnCoMo2OAZsX-cE0lbwmTna8IWZKZr2AkjfXuY1O3heDe5GVxa3RNOgZ7YEFyIg3T2_jc9dMaQB6LQenUNt37rjwnKSRQEepsHiYog06Iv0EGGL203TJYkaEZx29PRNQaqPceQNsm0K0_odF4uiVTgns8WwRHA77k_QI-7Z1JTPQGvqqVmqQlG3Hzz1PDLi1ISYA" />
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Dr. Marcus Chen</h4>
              <p className="text-primary text-sm font-semibold mb-2">Molecular Radiologist</p>
              <p className="text-xs text-on-surface-variant italic">Stanford Medicine Alumni</p>
            </div>
            <div className="group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                <img alt="Specialist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIhYBvRHN4RfhoVYgOWZniUceBf9mFZnDxsqpsjx2tuCk4qmJPc-eYR0e6sD53wrqZM3LF9ikiFO6-I96zosgWHZ2ol-JvUklVKBkU7pGD27SJXVmweTd71DvLTtTljBH6g4l6YJFT4UVf7VYWtMXRMkQGf25SRm65qBch1fSyO867mOnZvWTvhXWAjPSzngmmzzcK0IR9FgkxLAMGw5FBl7W2qF83IB8hvAfGxAACThanvaExuOI1RCCie1i1HGXY8AoVUP3TkeE" />
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Dr. Sarah Laine</h4>
              <p className="text-primary text-sm font-semibold mb-2">Genomics Researcher</p>
              <p className="text-xs text-on-surface-variant italic">Johns Hopkins University</p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Portal Preview */}
      <section className="py-24 bg-surface-container-high overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative"
            >
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
                  <div className="p-6 rounded-2xl bg-surface-container-low flex justify-between items-center mt-4">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                         <span className="material-symbols-outlined">lab_research</span>
                       </div>
                       <div>
                         <div className="font-bold">Lab Results Ready</div>
                         <div className="text-xs text-slate-500">Metabolic Panel Available</div>
                       </div>
                     </div>
                     <button onClick={() => navigate('/appointments')} className="bg-tertiary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-tertiary/20 hover:scale-105 transition-transform">View Rx</button>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-tertiary/20 rounded-full blur-3xl -z-0"></div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="order-1 lg:order-2"
            >
               <h2 className="text-4xl font-extrabold font-headline mb-6 text-on-surface">Your Health, <br/><span className="text-primary">Fully Curated.</span></h2>
               <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                 Our proprietary patient portal offers real-time access to clinical data, genetic insights, and direct communication with your care team. Total transparency for total peace of mind.
               </p>
               <ul className="space-y-4 mb-10">
                 <li className="flex items-center gap-3 text-on-surface font-medium">
                   <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
                   Biometric health tracking integration
                 </li>
                 <li className="flex items-center gap-3 text-on-surface font-medium">
                   <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
                   Secure multi-factor data encryption
                 </li>
                 <li className="flex items-center gap-3 text-on-surface font-medium">
                   <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
                   Direct-to-Specialist messaging
                 </li>
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
    </div>
  );
};

export default Home;
