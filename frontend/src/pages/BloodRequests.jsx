import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import BloodRequestCard from '../components/BloodRequestCard.jsx';
import { bloodRequestService } from '../services/authService.js';

const BloodRequests = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { location } = useContext(LocationContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [urgency, setUrgency] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (bloodGroup || urgency) {
      searchRequests();
    } else {
      fetchRequests();
    }
  }, [bloodGroup, urgency]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await bloodRequestService.getRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch blood requests');
    } finally {
      setLoading(false);
    }
  };

  const searchRequests = async () => {
    try {
      setLoading(true);
      const response = await bloodRequestService.getRequests({
        bloodGroup,
        urgency,
      });
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error searching requests:', error);
      toast.error('Failed to search requests');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (request) => {
    const message = `I can help with blood type ${request.bloodGroup}`;
    window.open(
      `https://wa.me/${request.contact}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface font-body pt-24 pb-12 px-6 relative"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[80%] rounded-full bg-red-500/5 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-rose-500/5 blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-[10px] mb-3">
              <span className="material-symbols-outlined text-sm">emergency</span>
              Urgent Requirements
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-slate-800 leading-tight">Blood Requests</h1>
            <p className="text-slate-500 font-medium mt-2">Help fulfill critical blood shortages in your community.</p>
          </div>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/blood-request-form')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold font-headline px-8 py-4 rounded-2xl shadow-xl shadow-red-500/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_alert</span>
              Create Request
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
                 className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 appearance-none transition-colors cursor-pointer"
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
               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">priority_high</span>
               <select
                 value={urgency}
                 onChange={(e) => setUrgency(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 appearance-none transition-colors cursor-pointer"
               >
                 <option value="">All Urgency Levels</option>
                 <option value="critical">Critical</option>
                 <option value="high">High</option>
                 <option value="medium">Medium</option>
                 <option value="low">Low</option>
               </select>
            </div>

            <button
              onClick={() => {
                setBloodGroup('');
                setUrgency('');
                fetchRequests();
              }}
              className="w-full md:w-auto bg-slate-900 text-white font-bold font-headline px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">clear_all</span>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <span className="material-symbols-outlined text-4xl text-red-500 animate-spin">progress_activity</span>
            </div>
          ) : requests.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BloodRequestCard
                    request={request}
                    onContact={() => handleContact(request)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center text-slate-500 shadow-xl shadow-slate-200/30">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <span className="material-symbols-outlined text-4xl">search_off</span>
              </div>
              <p className="text-xl font-bold font-headline text-slate-800 mb-2">No Active Requests</p>
              <p className="mb-6">There are currently no blood requests matching your criteria.</p>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/blood-request-form')}
                  className="bg-red-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Create a Request
                </button>
              )}
            </div>
          )}

          {requests.length > 0 && (
            <div className="mt-12 text-center">
              <span className="inline-flex bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-500 border border-slate-100 uppercase tracking-widest object-center">
                 Found <span className="text-red-500 mx-2 px-2 bg-red-50 rounded-lg">{requests.length}</span> Active Requests
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BloodRequests;
