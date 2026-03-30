import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFilter, FiRefreshCw, FiCheckCircle, FiClock, FiX, FiChevronDown,
  FiCalendar, FiUser, FiPhone, FiMail, FiEdit2, FiSave, FiArrowLeft
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Role check
  useEffect(() => {
    if (!user || user.role !== 'hospital_admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const query = statusFilter ? `?status=${statusFilter}` : '';

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/appointments${query}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch appointments');

      const data = await response.json();
      let appts = data.data || [];

      // Apply sorting
      if (sortBy === 'date') {
        appts.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      } else if (sortBy === 'status') {
        appts.sort((a, b) => a.status.localeCompare(b.status));
      }

      setAppointments(appts);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus, notes) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/appointments${query}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            hospitalNotes: notes,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update appointment');

      toast.success('Appointment updated successfully');
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast.error('Failed to update appointment');
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'Confirmed': 'bg-green-500/20 text-green-300 border border-green-500/30',
      'Scheduled': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'Completed': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      'Cancelled': 'bg-red-500/20 text-red-300 border border-red-500/30',
      'Rescheduled': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || colors['Scheduled']}`}>
        {status}
      </span>
    );
  };

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
              <h1 className="text-4xl font-bold text-white">Appointments</h1>
              <p className="text-slate-400">Manage all hospital appointments</p>
            </div>
          </div>
          <button
            onClick={() => fetchAppointments()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiRefreshCw /> Refresh
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-4 flex-wrap"
        >
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <FiFilter /> Status
              <FiChevronDown />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10 hidden group-hover:block">
              <button onClick={() => setStatusFilter('')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-white">All</button>
              <button onClick={() => setStatusFilter('Confirmed')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-white">Confirmed</button>
              <button onClick={() => setStatusFilter('Scheduled')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-white">Scheduled</button>
              <button onClick={() => setStatusFilter('Completed')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-white">Completed</button>
              <button onClick={() => setStatusFilter('Cancelled')} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-white">Cancelled</button>
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>

          <div className="ml-auto text-slate-400">
            Total: <span className="font-bold text-white">{appointments.length}</span>
          </div>
        </motion.div>

        {/* Appointments List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-6 animate-pulse h-32" />
            ))
          ) : appointments.length > 0 ? (
            appointments.map((apt, idx) => (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
              >
                {editingId === apt._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Status</label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Rescheduled">Rescheduled</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-slate-400">Hospital Notes</label>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
                          rows="2"
                          placeholder="Add notes for this appointment..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt._id, editingStatus, editingNotes)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        <FiSave /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                          <FiUser className="text-blue-300 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{apt.patient?.name || 'Unknown Patient'}</h3>
                          <p className="text-sm text-slate-400">Patient ID: {apt.patient?._id?.slice(-8)}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Date & Time</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <FiCalendar /> {new Date(apt.appointmentDate).toLocaleDateString()}
                          </p>
                          <p className="text-slate-400">{new Date(apt.appointmentDate).toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Phone</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <FiPhone /> {apt.patient?.phone || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Email</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <FiMail /> {apt.patient?.email || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Blood Group</p>
                          <p className="text-white font-semibold">{apt.patient?.bloodGroup || 'N/A'}</p>
                        </div>
                      </div>

                      {apt.hospitalNotes && (
                        <div className="mt-4 p-3 bg-slate-700/50 rounded border border-slate-600">
                          <p className="text-xs text-slate-400 mb-1">Hospital Notes</p>
                          <p className="text-white text-sm">{apt.hospitalNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={apt.status} />
                      <button
                        onClick={() => {
                          setEditingId(apt._id);
                          setEditingStatus(apt.status);
                          setEditingNotes(apt.hospitalNotes || '');
                        }}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FiCalendar className="mx-auto text-5xl mb-3 opacity-50" />
              <p className="text-lg">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
