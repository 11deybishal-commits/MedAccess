import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSettings, FiArrowLeft, FiSave, FiX, FiPhone, FiMapPin,
  FiCheckCircle, FiAlertCircle, FiChevronRight, FiGift,
  FiTrendingUp, FiBriefcase
} from 'react-icons/fi';
import { GiHospitalCross, GiBed } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    hospitalDescription: '',
    hospitalSpecialties: [],
    totalBeds: 0,
    availableBeds: 0,
    hospitalLat: '',
    hospitalLng: '',
  });

  const SPECIALTIES_LIST = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Oncology',
    'Pediatrics', 'Gynecology', 'Dermatology', 'Psychiatry', 'General Surgery',
    'Emergency Medicine', 'Ophthalmology', 'ENT', 'Urology', 'Nephrology',
    'Pulmonology', 'Gastroenterology', 'Endocrinology', 'Rheumatology', 'Geriatrics',
    'Pathology', 'Anesthesia', 'Rehabilitation', 'Dentistry', 'ICU Services'
  ];

  // Role check
  useEffect(() => {
    if (!user || user.role !== 'hospital_admin') {
      navigate('/login');
      return;
    }

    // Initialize form with user data
    setFormData({
      hospitalName: user.hospitalName || '',
      hospitalAddress: user.hospitalAddress || '',
      hospitalPhone: user.hospitalPhone || '',
      hospitalDescription: user.hospitalDescription || '',
      hospitalSpecialties: user.hospitalSpecialties || [],
      totalBeds: user.totalBeds || 0,
      availableBeds: user.availableBeds || 0,
      hospitalLat: user.hospitalLat || '',
      hospitalLng: user.hospitalLng || '',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      hospitalSpecialties: prev.hospitalSpecialties.includes(specialty)
        ? prev.hospitalSpecialties.filter((s) => s !== specialty)
        : [...prev.hospitalSpecialties, specialty],
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const data = await response.json();
      
      // Update local auth context
      if (updateUser) {
        updateUser(data.data);
      }

      toast.success('Hospital profile updated successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'hospital_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FiArrowLeft className="text-2xl text-slate-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <FiSettings /> Hospital Settings
              </h1>
              <p className="text-slate-400">Manage your hospital information and configuration</p>
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>

        {/* Verification Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-lg border flex items-center gap-3 ${
            user.isVerified
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
          }`}
        >
          {user.isVerified ? (
            <>
              <FiCheckCircle className="text-2xl" />
              <div>
                <p className="font-semibold">Hospital Verified</p>
                <p className="text-sm">Your hospital registration has been verified by MediAccess</p>
              </div>
            </>
          ) : (
            <>
              <FiAlertCircle className="text-2xl" />
              <div>
                <p className="font-semibold">Verification Pending</p>
                <p className="text-sm">Your hospital details are under review. This usually takes 24-48 hours.</p>
              </div>
            </>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'basic', label: 'Basic Info', icon: GiHospitalCross },
                  { id: 'services', label: 'Services', icon: FiBriefcase },
                  { id: 'capacity', label: 'Capacity', icon: GiBed },
                  { id: 'location', label: 'Location', icon: FiMapPin },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon /> {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Basic Hospital Information</h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Hospital Address</label>
                  <input
                    type="text"
                    name="hospitalAddress"
                    value={formData.hospitalAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="hospitalPhone"
                      value={formData.hospitalPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Hospital Rating</label>
                    <input
                      type="text"
                      value={`⭐ ${user.rating || 4.5}/5`}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-700 text-slate-400 rounded-lg border border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                  <textarea
                    name="hospitalDescription"
                    value={formData.hospitalDescription}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your hospital, facilities, and special services..."
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Medical Specialties</h2>
                <p className="text-slate-400 mb-6">Select all specialties available at your hospital</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {SPECIALTIES_LIST.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.hospitalSpecialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                      <span className="text-white font-medium">{specialty}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold">Selected:</span> {formData.hospitalSpecialties.length} specialties
                  </p>
                </div>
              </motion.div>
            )}

            {/* Capacity Tab */}
            {activeTab === 'capacity' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Hospital Capacity</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Total Beds</label>
                    <input
                      type="number"
                      name="totalBeds"
                      value={formData.totalBeds}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Available Beds</label>
                    <input
                      type="number"
                      name="availableBeds"
                      value={formData.availableBeds}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bed Status Visualization */}
                <div className="mt-6 p-6 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400 mb-4">Bed Status Overview</p>
                  <div className="flex items-end gap-4 mb-4 h-32">
                    <div className="flex-1 bg-blue-600 rounded-t-lg" style={{ height: `${(formData.availableBeds / Math.max(formData.totalBeds, 1)) * 100}%` }}>
                      <p className="text-white text-center pt-2 font-bold">{formData.availableBeds}</p>
                    </div>
                    <div className="flex-1 bg-red-600 rounded-t-lg" style={{ height: `${((formData.totalBeds - formData.availableBeds) / Math.max(formData.totalBeds, 1)) * 100}%` }}>
                      <p className="text-white text-center pt-2 font-bold">{formData.totalBeds - formData.availableBeds}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Available</span>
                    <span>Used</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Hospital Location</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Latitude</label>
                    <input
                      type="number"
                      name="hospitalLat"
                      value={formData.hospitalLat}
                      onChange={handleChange}
                      step="0.0001"
                      placeholder="e.g. 28.7041"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Longitude</label>
                    <input
                      type="number"
                      name="hospitalLng"
                      value={formData.hospitalLng}
                      onChange={handleChange}
                      step="0.0001"
                      placeholder="e.g. 77.1025"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300 mb-2">
                    <span className="font-semibold">💡 Tip:</span> Use Google Maps to find your exact coordinates
                  </p>
                  <p className="text-xs text-blue-300">
                    Right-click on Google Maps and select "What's here?" to get coordinates in the correct format.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
