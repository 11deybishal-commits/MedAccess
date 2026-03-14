import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { LocationContext } from '../context/LocationContext.jsx';
import PharmacyCard from '../components/PharmacyCard.jsx';
import { pharmacyService } from '../services/authService.js';

const Pharmacies = () => {
  const { location, getLocation } = useContext(LocationContext);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000);

  useEffect(() => {
    if (!location.latitude || !location.longitude) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchPharmacies();
    }
  }, [location.latitude, location.longitude, radius]);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const response = await pharmacyService.getNearbyPharmacies(
        location.latitude,
        location.longitude,
        radius
      );
      setPharmacies(response.data.pharmacies);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Nearby Pharmacies</h1>
          <p className="text-gray-600">Find pharmacies near your location</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-600" />
              <label className="text-gray-700 font-medium">Search Radius (km):</label>
            </div>
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={25000}>25 km</option>
            </select>
            <button
              onClick={fetchPharmacies}
              className="flex items-center gap-2 ml-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {/* Pharmacies Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-gray-200 h-80 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : pharmacies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pharmacies.map((pharmacy) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PharmacyCard pharmacy={pharmacy} userLocation={location} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center text-gray-600">
            <p className="text-xl mb-4">No pharmacies found in selected radius</p>
            <button
              onClick={() => setRadius(25000)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Expand Search Area
            </button>
          </div>
        )}

        {pharmacies.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Total pharmacies found: <strong>{pharmacies.length}</strong></p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Pharmacies;
