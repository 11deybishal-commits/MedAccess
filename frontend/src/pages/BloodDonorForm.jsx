import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiDroplet, FiMapPin, FiPhone, FiCalendar, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { LocationContext } from '../context/LocationContext.jsx';
import { donorService } from '../services/authService.js';

const BloodDonorForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { location, getLocation } = useContext(LocationContext);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    city: user?.city || '',
    phone: user?.phone || '',
    lastDonationDate: '',
    availability: true,
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
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
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
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
      await donorService.registerDonor({
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      toast.success('Successfully registered as blood donor!');
      navigate('/blood-donors');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register as donor';
      toast.error(message);
      console.error('Error registering donor:', error);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register as Blood Donor</h1>
            <p className="text-gray-600">Help save lives by becoming a blood donor</p>
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

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiPhone /> Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FiCalendar /> Last Donation Date
              </label>
              <input
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="availability" className="text-gray-700 font-semibold">
                I am available to donate blood
              </label>
            </div>

            {/* Location Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Sharing your location helps other users find donors more easily (optional)
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
                  <FiLoader className="animate-spin" /> Registering...
                </>
              ) : (
                'Register as Donor'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BloodDonorForm;
