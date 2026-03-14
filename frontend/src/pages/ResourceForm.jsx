import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiMapPin, FiPhone, FiHome, FiInfo, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { LocationContext } from '../context/LocationContext.jsx';
import { resourceService } from '../services/authService.js';

const ResourceForm = () => {
  const navigate = useNavigate();
  const { location, getLocation } = useContext(LocationContext);
  const [formData, setFormData] = useState({
    type: '',
    address: '',
    city: '',
    quantity: '',
    contact: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resourceTypes = [
    { value: 'oxygen', label: 'Oxygen Available' },
    { value: 'icuBeds', label: 'ICU Beds' },
    { value: 'blood', label: 'Blood Available' },
    { value: 'medicalSupplies', label: 'Medical Supplies' },
    { value: 'camp', label: 'Medical Camp' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEnableLocation = () => {
    getLocation();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Resource type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await resourceService.reportResource({
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      toast.success('Resource reported successfully! Thank you for helping the community.');
      navigate('/report-resource');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to report resource';
      toast.error(message);
      console.error('Error reporting resource:', error);
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
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Medical Resource</h1>
            <p className="text-gray-600">Help the community by sharing available medical resources</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiUploadCloud className="text-blue-600" /> Resource Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Resource Type</option>
                {resourceTypes.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiHome /> Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the resource location"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiMapPin /> City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiInfo /> Quantity/Availability
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10 units, 50 beds, Plenty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiPhone /> Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Details</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information that might be helpful"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Sharing your location helps community members find resources easily (optional)
              </p>
              {location.latitude && location.longitude ? (
                <p className="text-sm text-green-600 font-semibold">
                  ✓ Location enabled: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleEnableLocation}
                  className="text-blue-600 underline hover:text-blue-800 text-sm"
                >
                  Enable location
                </button>
              )}
            </div>

            {/* Note about Verification */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> All reports are verified by our admin team before being published to the community.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Reporting...
                </>
              ) : (
                'Report Resource'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResourceForm;
