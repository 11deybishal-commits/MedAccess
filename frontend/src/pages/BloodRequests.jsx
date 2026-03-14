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
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Blood Requests</h1>
            <p className="text-gray-600">Help someone in need</p>
          </div>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/blood-request-form')}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <FiPlus /> Create Request
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <FiFilter className="text-gray-600" />
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Urgency Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={() => {
                setBloodGroup('');
                setUrgency('');
                fetchRequests();
              }}
              className="ml-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : requests.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          <div className="bg-white p-12 rounded-lg text-center text-gray-600">
            <p className="text-xl mb-4">No active blood requests at this time</p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/blood-request-form')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Create a Request
              </button>
            )}
          </div>
        )}

        {requests.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Found <strong>{requests.length}</strong> active blood requests</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BloodRequests;
