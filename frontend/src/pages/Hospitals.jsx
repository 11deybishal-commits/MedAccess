import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiRefreshCw, FiMap, FiList } from 'react-icons/fi';
import { LocationContext } from '../context/LocationContext.jsx';
import MapComponent from '../components/MapComponent.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import { hospitalService } from '../services/authService.js';

const Hospitals = () => {
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    if (!location.latitude || !location.longitude) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchHospitals();
    }
  }, [location.latitude, location.longitude, radius]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getNearbyHospitals(
        location.latitude,
        location.longitude,
        radius
      );
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapLocations = hospitals.map((hospital) => ({
    name: hospital.name,
    lat: hospital.lat || hospital.latitude,
    lng: hospital.lng || hospital.longitude,
    address: hospital.address,
    phone: hospital.phone,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Nearby Hospitals</h1>
          <p className="text-gray-600">Find hospitals near your location</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-600" />
              <label className="text-gray-700 font-medium">Search Radius (km):</label>
            </div>
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={25000}>25 km</option>
            </select>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiList /> List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiMap /> Map
              </button>
            </div>

            <button
              onClick={fetchHospitals}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 h-96">
            <MapComponent
              hospitals={mapLocations}
              center={location.latitude ? { lat: location.latitude, lng: location.longitude } : null}
            />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-200 h-80 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : hospitals.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {hospitals.map((hospital) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <HospitalCard hospital={hospital} userLocation={location} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white p-12 rounded-lg text-center text-gray-600">
                <p className="text-xl mb-4">No hospitals found in selected radius</p>
                <button
                  onClick={() => setRadius(25000)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Expand Search Area
                </button>
              </div>
            )}

            {hospitals.length > 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p>Total hospitals found: <strong>{hospitals.length}</strong></p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Hospitals;
