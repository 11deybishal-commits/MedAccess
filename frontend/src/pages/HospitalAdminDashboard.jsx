import React, { useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiCalendar, FiUsers, FiSettings, FiLogOut, FiCheck, FiX,
  FiClock, FiActivity, FiDatabase, FiStar, FiEdit2, FiUser, FiPhone,
  FiMapPin, FiSave, FiRefreshCw
} from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { adminService } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

const SPECIALTIES_LIST = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Oncology',
  'Pediatrics', 'Gynecology', 'Dermatology', 'Psychiatry', 'General Surgery',
  'Emergency Medicine', 'Ophthalmology', 'ENT', 'Urology', 'Nephrology',
  'Pulmonology', 'Gastroenterology', 'Endocrinology', 'Rheumatology', 'Geriatrics'
];

const STATUS_COLORS = {
  Scheduled:   'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled:   'bg-red-50 text-red-700 border-red-200',
  Completed:   'bg-blue-50 text-blue-700 border-blue-200',
  Rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
      <Icon className="text-xl" />
    </div>
    <div className="text-3xl font-extrabold font-headline text-slate-800 mb-1">{value ?? '—'}</div>
    <div className="text-sm text-slate-500 font-medium">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </motion.div>
);

const HospitalAdminDashboard = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [profileData, setProfileData] = useState({
    hospitalName: user?.hospitalName || '',
    hospitalAddress: user?.hospitalAddress || '',
    hospitalPhone: user?.hospitalPhone || '',
    hospitalDescription: user?.hospitalDescription || '',
    hospitalSpecialties: user?.hospitalSpecialties || [],
    totalBeds: user?.totalBeds || 0,
    availableBeds: user?.availableBeds || 0,
    hospitalLat: user?.hospitalLat || '',
    hospitalLng: user?.hospitalLng || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Redirect if not hospital admin
  useEffect(() => {
    if (!user || user.role !== 'hospital_admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminService.getDashboard();
      setStats(res.data.data);
    } catch (e) {
      console.error('Stats fetch failed:', e);
      // Mock fallback
      setStats({ total: 0, confirmed: 0, pending: 0, cancelled: 0, todayCount: 0, availableBeds: user?.availableBeds || 0, totalBeds: user?.totalBeds || 0, rating: user?.rating || 4.5 });
    }
  }, [user]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAppointments(filterStatus);
      setAppointments(res.data.data || []);
    } catch (e) {
      console.error('Appointments fetch failed:', e);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getPatients();
      setPatients(res.data.data || []);
    } catch (e) {
      console.error('Patients fetch failed:', e);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'appointments') fetchAppointments();
    if (activeTab === 'patients') fetchPatients();
  }, [activeTab, fetchAppointments, fetchPatients]);

  const handleUpdateStatus = async (id, status, notes = '') => {
    try {
      await adminService.updateAppointment(id, { status, hospitalNotes: notes });
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
      fetchStats();
    } catch (e) {
      toast.error('Failed to update appointment');
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await adminService.updateProfile({
        ...profileData,
        totalBeds: Number(profileData.totalBeds),
        availableBeds: Number(profileData.availableBeds),
        hospitalLat: profileData.hospitalLat ? Number(profileData.hospitalLat) : null,
        hospitalLng: profileData.hospitalLng ? Number(profileData.hospitalLng) : null,
      });
      updateUser({ ...profileData });
      toast.success('Hospital profile updated!');
    } catch (e) {
      toast.error('Profile update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const toggleSpecialty = (spec) => {
    setProfileData(prev => ({
      ...prev,
      hospitalSpecialties: prev.hospitalSpecialties.includes(spec)
        ? prev.hospitalSpecialties.filter(s => s !== spec)
        : [...prev.hospitalSpecialties, spec],
    }));
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'patients', label: 'Patients', icon: FiUsers },
    { id: 'profile', label: 'Profile Settings', icon: FiSettings },
  ];

  const bedPct = stats ? Math.round(((stats.totalBeds - stats.availableBeds) / Math.max(stats.totalBeds, 1)) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40 shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <GiCaduceus className="text-white text-2xl" />
            </div>
            <div>
              <div className="font-bold text-white text-sm font-headline">MediAccess</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Hospital Admin</div>
            </div>
          </div>
        </div>

        {/* Hospital Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Hospital</div>
          <div className="text-sm font-bold text-white truncate">{user?.hospitalName || 'Your Hospital'}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${user?.isVerified ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span className={`text-[10px] font-semibold uppercase ${user?.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
              {user?.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="text-lg flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto min-h-screen">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-slate-900 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' :
               activeTab === 'appointments' ? 'Appointments' :
               activeTab === 'patients' ? 'Patient Records' : 'Profile Settings'}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUser />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{user?.name}</div>
              <div className="text-xs text-slate-500">Hospital Administrator</div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ────── OVERVIEW ────── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={FiCalendar} label="Total Appointments" value={stats?.total} color="bg-blue-50 text-blue-600" />
                <StatCard icon={FiCheck} label="Confirmed" value={stats?.confirmed} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={FiClock} label="Pending" value={stats?.pending} color="bg-amber-50 text-amber-600" />
                <StatCard icon={FiX} label="Cancelled" value={stats?.cancelled} color="bg-red-50 text-red-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Today's Appointments */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold opacity-80 uppercase tracking-wider">Today</div>
                    <FiActivity className="text-white/60" />
                  </div>
                  <div className="text-5xl font-extrabold font-headline mb-2">{stats?.todayCount ?? 0}</div>
                  <div className="text-blue-200 text-sm">Appointments scheduled</div>
                  <button onClick={() => setActiveTab('appointments')} className="mt-4 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all">
                    View All →
                  </button>
                </div>

                {/* Bed Occupancy */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</div>
                    <FiDatabase className="text-slate-400" />
                  </div>
                  <div className="text-4xl font-extrabold font-headline text-slate-800 mb-1">{bedPct}%</div>
                  <div className="text-slate-500 text-sm mb-4">{stats?.availableBeds ?? 0} / {stats?.totalBeds ?? 0} available</div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bedPct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-3 rounded-full ${bedPct > 80 ? 'bg-red-500' : bedPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hospital Rating</div>
                    <FiStar className="text-amber-400" />
                  </div>
                  <div className="text-5xl font-extrabold font-headline text-slate-800 mb-2">{stats?.rating?.toFixed(1) ?? '—'}</div>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} className={`text-lg ${s <= Math.round(stats?.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('appointments')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    View Appointments
                  </button>
                  <button onClick={() => setActiveTab('patients')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                    View Patients
                  </button>
                  <button onClick={() => setActiveTab('profile')} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── APPOINTMENTS ────── */}
          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Filter Bar */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {['', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      filterStatus === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {s || 'All'}
                  </button>
                ))}
                <button onClick={fetchAppointments} className="ml-auto p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all">
                  <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />)}</div>
              ) : appointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
                  <FiCalendar className="text-5xl text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-600">No appointments found</h3>
                  <p className="text-slate-400 text-sm mt-1">Appointments will appear here when patients book with your hospital.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(apt => (
                    <motion.div
                      key={apt._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                            <FiUser />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{apt.patient?.name || 'Patient'}</div>
                            <div className="text-slate-500 text-xs">{apt.patient?.email}</div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                                <FiCalendar className="text-[10px]" /> {apt.appointmentDate?.slice(0,10) || apt.date}
                              </span>
                              {apt.appointmentTime && (
                                <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                                  <FiClock className="text-[10px]" /> {apt.appointmentTime}
                                </span>
                              )}
                              {apt.reason && <span className="text-xs text-slate-400 italic truncate max-w-[200px]">"{apt.reason}"</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[apt.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {apt.status}
                          </span>
                          {apt.status === 'Scheduled' && (
                            <>
                              <button onClick={() => handleUpdateStatus(apt._id, 'Confirmed')} className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                                <FiCheck /> Confirm
                              </button>
                              <button onClick={() => handleUpdateStatus(apt._id, 'Cancelled')} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5">
                                <FiX /> Cancel
                              </button>
                            </>
                          )}
                          {apt.status === 'Confirmed' && (
                            <button onClick={() => handleUpdateStatus(apt._id, 'Completed')} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ────── PATIENTS ────── */}
          {activeTab === 'patients' && (
            <motion.div key="patients" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-slate-500">{patients.length} unique patient{patients.length !== 1 ? 's' : ''} on record</div>
                <button onClick={fetchPatients} className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all">
                  <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
                </div>
              ) : patients.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
                  <FiUsers className="text-5xl text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-600">No patients yet</h3>
                  <p className="text-slate-400 text-sm mt-1">Patient records will appear after they book appointments.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((pt, idx) => (
                    <motion.div
                      key={pt._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(pt.name || 'P')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 truncate">{pt.name}</div>
                          <div className="text-xs text-slate-400 truncate">{pt.email}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-500">
                        {pt.phone && <div className="flex items-center gap-1.5"><FiPhone className="text-slate-300" /> {pt.phone}</div>}
                        {pt.city && <div className="flex items-center gap-1.5"><FiMapPin className="text-slate-300" /> {pt.city}</div>}
                        {pt.bloodGroup && (
                          <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-bold">
                            {pt.bloodGroup}
                          </div>
                        )}
                        {pt.lastAppointment && <div className="flex items-center gap-1.5 text-slate-400"><FiCalendar className="text-slate-300" /> Last: {new Date(pt.lastAppointment).toLocaleDateString()}</div>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ────── PROFILE SETTINGS ────── */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><FiEdit2 className="text-blue-500" /> Hospital Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospital Name</label>
                        <input value={profileData.hospitalName} onChange={e => setProfileData(p => ({...p, hospitalName: e.target.value}))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                        <input value={profileData.hospitalAddress} onChange={e => setProfileData(p => ({...p, hospitalAddress: e.target.value}))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                          <input value={profileData.hospitalPhone} onChange={e => setProfileData(p => ({...p, hospitalPhone: e.target.value}))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Beds</label>
                          <input type="number" value={profileData.totalBeds} onChange={e => setProfileData(p => ({...p, totalBeds: e.target.value}))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Available Beds</label>
                          <input type="number" value={profileData.availableBeds} onChange={e => setProfileData(p => ({...p, availableBeds: e.target.value}))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Latitude</label>
                          <input value={profileData.hospitalLat} onChange={e => setProfileData(p => ({...p, hospitalLat: e.target.value}))}
                            placeholder="e.g. 28.6139"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea rows={3} value={profileData.hospitalDescription} onChange={e => setProfileData(p => ({...p, hospitalDescription: e.target.value}))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FiActivity className="text-blue-500" /> Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES_LIST.map(spec => (
                        <button key={spec} type="button" onClick={() => toggleSpecialty(spec)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            profileData.hospitalSpecialties.includes(spec) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
                          }`}>
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {profileLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><FiSave /> Save Changes</>}
                  </button>
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4">Account Info</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Admin Name</span>
                        <span className="font-bold text-slate-800">{user?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email</span>
                        <span className="font-bold text-slate-800 truncate ml-2 max-w-[140px]">{user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Role</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">Hospital Admin</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user?.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {user?.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                    <h4 className="font-bold mb-2">Need Help?</h4>
                    <p className="text-blue-200 text-sm mb-4">Our support team is available 24/7 to assist you with setting up your hospital profile.</p>
                    <a href="mailto:support@mediaccess.com" className="text-xs bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition-colors inline-block">
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default HospitalAdminDashboard;
