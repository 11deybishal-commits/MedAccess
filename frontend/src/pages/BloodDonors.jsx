import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFilter, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import DonorCard from '../components/DonorCard.jsx';
import { donorService } from '../services/authService.js';

const BloodDonors = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    fetchDonors();
    checkDonorStatus();
  }, []);

  useEffect(() => {
    if (bloodGroup || filterCity) {
      searchDonors();
    } else {
      fetchDonors();
    }
  }, [bloodGroup, filterCity]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await donorService.getAllDonors();
      setDonors(response.data.donors);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  const searchDonors = async () => {
    try {
      setLoading(true);
      const response = await donorService.searchDonors({
        bloodGroup,
        city: filterCity,
      });
      setDonors(response.data.donors);
    } catch (error) {
      console.error('Error searching donors:', error);
      toast.error('Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  const checkDonorStatus = async () => {
    if (!isAuthenticated) return;
    try {
      await donorService.getMyProfile();
      setHasRegistered(true);
    } catch (error) {
      setHasRegistered(false);
    }
  };

  const handleContactDonor = (donor) => {
    const message = `Hi ${donor.name}, I would like to request blood type ${donor.bloodGroup}. Please contact me.`;
    window.open(
      `https://wa.me/${donor.phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface font-body pt-24 pb-12 px-6"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-primary/5 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[80%] rounded-full bg-red-500/5 blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-3">
              <span className="material-symbols-outlined text-sm">water_drop</span>
              Community Network
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-slate-800 leading-tight">Blood Donors</h1>
            <p className="text-slate-500 font-medium mt-2">Find and connect with available blood donors near you.</p>
          </div>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(hasRegistered ? '/blood-donors' : '/blood-donor-form')}
              className="bg-primary hover:bg-blue-700 text-white font-bold font-headline px-8 py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">{hasRegistered ? 'edit' : 'add'}</span>
              {hasRegistered ? 'Update Profile' : 'Register as Donor'}
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-6 mb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl text-slate-400 shrink-0 hidden md:flex">
               <span className="material-symbols-outlined">filter_list</span>
            </div>
            
            <div className="flex-1 w-full relative">
               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">water_drop</span>
               <select
                 value={bloodGroup}
                 onChange={(e) => setBloodGroup(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none transition-colors cursor-pointer"
               >
                 <option value="">All Blood Groups</option>
                 {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                   <option key={group} value={group}>
                     {group}
                   </option>
                 ))}
               </select>
            </div>

            <div className="flex-1 w-full relative">
               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
               <input
                 type="text"
                 placeholder="Filter by city..."
                 value={filterCity}
                 onChange={(e) => setFilterCity(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
               />
            </div>

            <button
              onClick={() => {
                setBloodGroup('');
                setFilterCity('');
                fetchDonors();
              }}
              className="w-full md:w-auto bg-slate-900 text-white font-bold font-headline px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">clear_all</span>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Donors Grid */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            </div>
          ) : donors.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {donors.map((donor) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <DonorCard
                    donor={donor}
                    onContact={() => handleContactDonor(donor)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center text-slate-500 shadow-xl shadow-slate-200/30">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <span className="material-symbols-outlined text-4xl">search_off</span>
              </div>
              <p className="text-xl font-bold font-headline text-slate-800 mb-2">No Donors Found</p>
              <p className="mb-6">We couldn't find any donors matching your current filters.</p>
              <button
                onClick={fetchDonors}
                className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                View All Donors
              </button>
            </div>
          )}

          {donors.length > 0 && (
            <div className="mt-12 text-center">
              <span className="inline-flex bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-500 border border-slate-100 uppercase tracking-widest object-center">
                 Found <span className="text-primary mx-2 px-2 bg-primary/10 rounded-lg">{donors.length}</span> Active Donors
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BloodDonors;
