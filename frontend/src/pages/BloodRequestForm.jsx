import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDroplet, FiMapPin, FiPhone, FiHome, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { LocationContext } from '../context/LocationContext.jsx';
import { bloodRequestService } from '../services/authService.js';

const BloodRequestForm = () => {
  const navigate = useNavigate();
  const { location, getLocation } = useContext(LocationContext);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    hospital: '',
    city: '',
    urgency: 'medium',
    contact: '',
    unitsNeeded: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.hospital) newErrors.hospital = 'Hospital name is required';
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
      await bloodRequestService.createRequest({
        ...formData,
        unitsNeeded: parseInt(formData.unitsNeeded),
        latitude: location.latitude,
        longitude: location.longitude,
      });

      toast.success('Blood request created successfully!');
      navigate('/blood-requests');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create blood request';
      toast.error(message);
      console.error('Error creating request:', error);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Blood Request</h1>
            <p className="text-gray-600">Help connect patients with blood donors</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Group */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiDroplet className="text-red-600" /> Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>

            {/* Hospital */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiHome /> Hospital Name *
              </label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="Name of hospital"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.hospital && <p className="text-red-600 text-sm mt-1">{errors.hospital}</p>}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>

            {/* Units Needed */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Units Needed</label>
              <input
                type="number"
                name="unitsNeeded"
                value={formData.unitsNeeded}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiAlertCircle className="text-orange-600" /> Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                placeholder="Any additional information for donors"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Location Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Sharing your location helps nearby donors find your request faster (optional)
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Creating Request...
                </>
              ) : (
                'Create Blood Request'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BloodRequestForm;
