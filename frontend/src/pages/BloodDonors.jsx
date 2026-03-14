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
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Blood Donors Network</h1>
            <p className="text-gray-600">Find available blood donors near you</p>
          </div>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(hasRegistered ? '/blood-donors' : '/blood-donor-form')}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <FiPlus /> {hasRegistered ? 'Update Profile' : 'Register as Donor'}
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

            <input
              type="text"
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={() => {
                setBloodGroup('');
                setFilterCity('');
                fetchDonors();
              }}
              className="ml-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Donors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <FiLoader className="text-4xl text-red-600 animate-spin" />
          </div>
        ) : donors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          <div className="bg-white p-12 rounded-lg text-center text-gray-600">
            <p className="text-xl mb-4">No donors found matching your criteria</p>
            <button
              onClick={fetchDonors}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              View All Donors
            </button>
          </div>
        )}

        {donors.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Found <strong>{donors.length}</strong> available donors</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BloodDonors;
