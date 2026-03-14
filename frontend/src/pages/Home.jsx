import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiMapPin, FiDroplet } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import { hospitalService } from '../services/authService.js';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Healthcare at Your Fingertips
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Find hospitals, pharmacies, blood donors, and emergency services in real-time
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/hospitals')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <FiMapPin />
              Find Hospitals
              <FiArrowRight />
            </motion.button>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/register')}
                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Get Started
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Emergency Panel */}
        <div className="mb-12">
          <EmergencyPanel onEmergency={handleEmergency} location={location} />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: FiMapPin,
              title: 'Find Hospitals',
              desc: 'Locate nearby hospitals with ratings and real-time status',
            },
            {
              icon: FiDroplet,
              title: 'Blood Donors',
              desc: 'Connect with available blood donors in your area',
            },
            {
              icon: FiZap,
              title: 'Emergency Services',
              desc: 'Quick access to ambulances and emergency resources',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Icon className="text-3xl text-blue-600 mb-3" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Nearby Hospitals Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Nearby Hospitals</h2>
            <button
              onClick={() => navigate('/hospitals')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
            >
              View All <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  userLocation={location}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
              <p>No hospitals found in your area. Enable location to see nearby hospitals.</p>
              <button
                onClick={getLocation}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Enable Location
              </button>
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-lg text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Become a Blood Donor</h2>
          <p className="mb-6 text-blue-100">Help save lives by registering as a blood donor</p>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/blood-donors')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Register as Donor
            </button>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Sign Up Now
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
