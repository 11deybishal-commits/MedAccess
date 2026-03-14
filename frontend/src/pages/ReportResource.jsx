import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFilter, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import { resourceService } from '../services/authService.js';

const ReportResource = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchResources();
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeFilter) {
      searchResources();
    } else {
      fetchResources();
    }
  }, [typeFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getVerifiedResources();
      setResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const searchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getVerifiedResources({
        type: typeFilter,
      });
      setResources(response.data.resources);
    } catch (error) {
      console.error('Error searching resources:', error);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Report Medical Resource</h1>
            <p className="text-gray-600">Help the community by reporting available resources</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/resource-form')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <FiPlus /> Report Resource
          </motion.button>
        </div>

        {/* My Reports Button */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <button
            onClick={() => navigate('/my-reports')}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View My Reports
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <FiFilter className="text-gray-600" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Resources</option>
              <option value="oxygen">Oxygen Available</option>
              <option value="icuBeds">ICU Beds</option>
              <option value="blood">Blood Available</option>
              <option value="medicalSupplies">Medical Supplies</option>
              <option value="camp">Medical Camp</option>
            </select>

            <button
              onClick={() => {
                setTypeFilter('');
                fetchResources();
              }}
              className="ml-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <FiLoader className="text-4xl text-blue-600 animate-spin" />
          </div>
        ) : resources.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center text-gray-600">
            <p className="text-xl mb-4">No resources reported yet</p>
            <button
              onClick={() => navigate('/resource-form')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Be the First to Report
            </button>
          </div>
        )}

        {resources.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Found <strong>{resources.length}</strong> verified resources</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportResource;
