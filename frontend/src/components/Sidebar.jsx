import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiMapPin,
  FiTrendingUp,
  FiDroplet,
  FiAlertCircle,
  FiUploadCloud,
  FiUser,
  FiLogOut,
  FiX,
  FiCpu,
  FiCalendar
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const menuItems = [
    { icon: FiHome, label: 'Home Feed', path: '/', id: 'home' },
    { icon: FiCpu, label: 'AI Health Assistant', path: '/ai-assistant', id: 'ai' },
    { icon: FiCalendar, label: 'Appointments & Rx', path: '/appointments', id: 'appointments' },
    { icon: FiUser, label: 'Patient Portal', path: '/patient-portal', id: 'portal' },
    { icon: FiMapPin, label: 'Nearby Hospitals', path: '/hospitals', id: 'hospitals' },
    { icon: FiTrendingUp, label: 'Pharmacies', path: '/pharmacies', id: 'pharmacies' },
    { icon: FiDroplet, label: 'Blood Donors', path: '/blood-donors', id: 'donors' },
    { icon: FiAlertCircle, label: 'Blood Requests', path: '/blood-requests', id: 'requests' },
    { icon: FiUploadCloud, label: 'Resource Center', path: '/report-resource', id: 'report' },
    { icon: FiAlertCircle, label: 'Emergency Help', path: '/emergency', id: 'emergency' },
  ];


  const handleNavigation = (path) => {
    if (!isAuthenticated && path !== '/' && path !== '/hospitals' && path !== '/pharmacies') {
      navigate('/login');
    } else {
      navigate(path);
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Premium Glassmorphic */}
      <aside
        className={`fixed right-0 top-0 h-screen w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl shadow-[-20px_0_40px_rgba(0,0,0,0.05)] border-l border-white/50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-6">
          {/* Header & Close Button */}
          <div className="px-6 pb-6 flex justify-between items-center border-b border-slate-200/50">
            <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-slate-100 tracking-tight">Menu</h2>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all text-slate-500"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-primary hover:translate-x-1'
                  }`}
                >
                  <Icon className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info and Logout */}
          {isAuthenticated && (
            <div className="p-6 bg-gradient-to-t from-slate-50 to-white/0 border-t border-slate-200/50">
              <div className="mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
                  <p className="text-slate-800 font-bold truncate max-w-[150px]">{user?.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50/80 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-bold shadow-sm"
                >
                  <FiUser className="text-lg" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50/80 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold shadow-sm"
                >
                  <FiLogOut className="text-lg" />
                  <span>Secure Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
