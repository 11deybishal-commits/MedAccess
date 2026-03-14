import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPhone, FiMapPin, FiZap } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import { hospitalService, pharmacyService } from '../services/authService.js';

const Emergency = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchEmergencyFacilities();
    }
  }, [location.latitude, location.longitude]);

  const fetchEmergencyFacilities = async () => {
    try {
      setLoading(true);
      const [hospitalsRes, pharmaciesRes] = await Promise.all([
        hospitalService.getNearbyHospitals(location.latitude, location.longitude, 5000),
        pharmacyService.getNearbyPharmacies(location.latitude, location.longitude, 5000),
      ]);

      setHospitals(hospitalsRes.data.hospitals.slice(0, 3));
      setPharmacies(pharmaciesRes.data.pharmacies.slice(0, 3));
    } catch (error) {
      console.error('Error fetching emergency facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAction = (action) => {
    if (action === 'hospital') {
      navigate('/hospitals');
    } else if (action === 'blood') {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        navigate('/blood-requests');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/*Emergency Banner*/}
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-500 text-white p-8 rounded-lg shadow-lg mb-8 border-4 border-red-700"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <FiAlertCircle className="text-4xl animate-pulse" />
            <h1 className="text-3xl font-bold">Emergency Services</h1>
          </div>
          <p className="text-red-100 text-lg">Quick access to critical emergency services in your area</p>
        </motion.div>

        {/* Emergency Panel */}
        <div className="mb-12">
          <EmergencyPanel onEmergency={handleEmergencyAction} location={location} />
        </div>

        {/* Emergency Numbers */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {[
            { label: 'Ambulance', number: '102', color: 'bg-red-600' },
            { label: 'Police', number: '100', color: 'bg-blue-600' },
            { label: 'Fire', number: '101', color: 'bg-orange-600' },
            { label: 'Disaster Management', number: '1070', color: 'bg-purple-600' },
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`${service.color} text-white p-6 rounded-lg text-center shadow-lg`}
            >
              <p className="text-sm font-medium mb-2">{service.label}</p>
              <p className="text-3xl font-bold">{service.number}</p>
              <a
                href={`tel:${service.number}`}
                className="text-white underline hover:text-gray-100 mt-2 block text-sm"
              >
                Call Now
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiMapPin className="text-red-600" />
            Nearest Hospitals ({hospitals.length})
          </h2>

          {hospitals.length > 0 ? (
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
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              <p>No hospitals found. Enable location access.</p>
            </div>
          )}
        </motion.div>

        {/* Blood Banks Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiZap className="text-red-600" />
            Blood Emergency Support
          </h2>
          <p className="text-gray-700 mb-4">
            If you need blood urgently, you can:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Search for available blood donors</li>
            <li>✓ Create an urgent blood request</li>
            <li>✓ Contact nearby blood banks</li>
            <li>✓ Connect with the donor network</li>
          </ul>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate('/blood-donors')}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Find Blood Donors
            </button>
            <button
              onClick={() => navigate('/blood-requests')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Create Blood Request
            </button>
          </div>
        </motion.div>

        {/* Critical Warning */}
        <motion.div
          className="mt-12 bg-yellow-50 border-2 border-yellow-500 p-6 rounded-lg"
        >
          <p className="text-yellow-800 font-bold flex items-center gap-2">
            <FiAlertCircle />
            In life-threatening emergencies, always call 102 (Ambulance) or 100 (Police) immediately
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Emergency;
