import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers, FiSearch, FiRefreshCw, FiPhone, FiMail, FiMapPin,
  FiDroplet, FiCalendar, FiArrowLeft, FiChevronDown
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminPatients = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);

  // Role check
  useEffect(() => {
    if (!user || user.role !== 'hospital_admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/patients`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch patients');

      const data = await response.json();
      setPatients(data.data || []);
      setFilteredPatients(data.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Filter patients
  useEffect(() => {
    let filtered = patients;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
      );
    }

    if (filterBloodGroup) {
      filtered = filtered.filter((p) => p.bloodGroup === filterBloodGroup);
    }

    setFilteredPatients(filtered);
  }, [searchQuery, filterBloodGroup, patients]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const PatientCard = ({ patient, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
    >
      <div
        onClick={() => setExpandedPatient(expandedPatient === patient._id ? null : patient._id)}
        className="p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{patient.name}</h3>
            <p className="text-sm text-slate-400">Added {new Date(patient.createdAt).toLocaleDateString()}</p>
          </div>
          <motion.div
            animate={{ rotate: expandedPatient === patient._id ? 180 : 0 }}
            className="text-blue-400"
          >
            <FiChevronDown />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Blood Group</p>
            <p className="text-lg font-bold text-red-400 flex items-center gap-2">
              <FiDroplet /> {patient.bloodGroup || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">City</p>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <FiMapPin /> {patient.city || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Phone</p>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <FiPhone className="text-green-400" /> {patient.phone || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Last Visit</p>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <FiCalendar /> {patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : 'No visits'}
            </p>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedPatient === patient._id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-700 space-y-3"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Email Address</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <FiMail className="text-blue-400" /> {patient.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Patient ID</p>
                <p className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded">
                  {patient._id}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">Quick Actions</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  View History
                </button>
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors">
                  Send Message
                </button>
                <button className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition-colors">
                  Download Records
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (!user || user.role !== 'hospital_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
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
                <FiUsers /> Patients
              </h1>
              <p className="text-slate-400">Manage and view all hospital patients</p>
            </div>
          </div>
          <button
            onClick={fetchPatients}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiRefreshCw /> Refresh
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Patients</p>
            <p className="text-3xl font-bold">{patients.length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Blood Group O+</p>
            <p className="text-3xl font-bold">{patients.filter((p) => p.bloodGroup === 'O+').length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Blood Group A+</p>
            <p className="text-3xl font-bold">{patients.filter((p) => p.bloodGroup === 'A+').length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">New This Month</p>
            <p className="text-3xl font-bold">
              {patients.filter((p) => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </motion.div>

        {/* Patients List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-6 animate-pulse h-32" />
            ))
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient, idx) => (
              <PatientCard key={patient._id} patient={patient} index={idx} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FiUsers className="mx-auto text-5xl mb-3 opacity-50" />
              <p className="text-lg">No patients found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
