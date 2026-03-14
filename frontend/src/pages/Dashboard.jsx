import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { LocationContext } from '../context/LocationContext.jsx';
import MapComponent from '../components/MapComponent.jsx';
import HospitalCard from '../components/HospitalCard.jsx';
import PharmacyCard from '../components/PharmacyCard.jsx';
import { hospitalService, pharmacyService } from '../services/authService.js';

const Dashboard = () => {
  const { location, getLocation } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.latitude || !location.longitude) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchNearbyFacilities();
    }
  }, [location.latitude, location.longitude]);

  const fetchNearbyFacilities = async () => {
    try {
      setLoading(true);
      const [hospitalsRes, pharmaciesRes] = await Promise.all([
        hospitalService.getNearbyHospitals(location.latitude, location.longitude),
        pharmacyService.getNearbyPharmacies(location.latitude, location.longitude),
      ]);

      setHospitals(hospitalsRes.data.hospitals);
      setPharmacies(pharmaciesRes.data.pharmacies);
    } catch (error) {
      console.error('Error fetching facilities:', error);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">View all nearby healthcare facilities</p>
        </div>

        {/* Map Section */}
        {location.latitude && location.longitude && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-4 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Live Map</h2>
            <MapComponent
              hospitals={hospitals}
              pharmacies={pharmacies}
              center={{
                lat: location.latitude,
                lng: location.longitude,
              }}
            />
          </motion.div>
        )}

        {/* Hospitals Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Nearby Hospitals ({hospitals.length})
            </h2>
            {loading && <FiLoader className="animate-spin text-blue-600" />}
          </div>

          {hospitals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p>No hospitals found. Enable location to see nearby hospitals.</p>
            </div>
          )}
        </motion.div>

        {/* Pharmacies Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Nearby Pharmacies ({pharmacies.length})
            </h2>
          </div>

          {pharmacies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  userLocation={location}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              <p>No pharmacies found in your area.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
