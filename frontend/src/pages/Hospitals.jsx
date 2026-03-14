import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiRefreshCw, FiMap, FiList, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { LocationContext } from '../context/LocationContext.jsx';
import MapComponent from '../components/MapComponent.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import { hospitalService } from '../services/authService.js';

const Hospitals = () => {
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    console.log('Hospitals page loaded, location:', location);
    if (!location.latitude || !location.longitude) {
      console.log('Getting location...');
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      console.log('Location available, fetching hospitals...', {
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      });
      fetchHospitals();
    }
  }, [location.latitude, location.longitude, radius]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Calling hospitalService.getNearbyHospitals...');
      const response = await hospitalService.getNearbyHospitals(
        location.latitude,
        location.longitude,
        radius
      );
      console.log('Hospital API Response:', response.data);
      setHospitals(response.data.hospitals || []);
      if (response.data.hospitals && response.data.hospitals.length > 0) {
        toast.success(`Found ${response.data.hospitals.length} hospitals nearby!`);
      } else {
        toast.info('No hospitals found in this radius. Try expanding the search area.');
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError(error.message || 'Failed to fetch hospitals');
      toast.error('Error fetching hospitals. Check console for details.');
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
    rating: hospital.rating,
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
          {location.latitude && location.longitude && (
            <p className="text-sm text-gray-500 mt-2">
              📍 Current location: ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-4 mb-8 flex items-start gap-3">
            <FiAlertCircle className="text-red-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Hospitals</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchHospitals}
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

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

            <div className="flex gap-2 ml-auto flex-wrap">
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
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> 
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 h-96">
            {hospitals.length > 0 ? (
              <MapComponent
                hospitals={mapLocations}
                center={location.latitude ? { lat: location.latitude, lng: location.longitude } : null}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMap className="mx-auto text-4xl mb-2" />
                  <p>No hospitals to display on map</p>
                </div>
              </div>
            )}
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
                {hospitals.map((hospital, index) => (
                  <motion.div
                    key={hospital.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <HospitalCard hospital={hospital} userLocation={location} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white p-12 rounded-lg text-center text-gray-600">
                <FiAlertCircle className="mx-auto text-4xl mb-4" />
                <p className="text-xl mb-4">No hospitals found in selected radius</p>
                <p className="text-sm mb-6">Try expanding your search area or checking your location permissions</p>
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
