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
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/', id: 'dashboard' },
    { icon: FiMapPin, label: 'Nearby Hospitals', path: '/hospitals', id: 'hospitals' },
    { icon: FiTrendingUp, label: 'Pharmacies', path: '/pharmacies', id: 'pharmacies' },
    { icon: FiDroplet, label: 'Blood Donors', path: '/blood-donors', id: 'donors' },
    { icon: FiAlertCircle, label: 'Blood Requests', path: '/blood-requests', id: 'requests' },
    { icon: FiUploadCloud, label: 'Report Resource', path: '/report-resource', id: 'report' },
    { icon: FiAlertCircle, label: 'Emergency', path: '/emergency', id: 'emergency' },
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Click only, no hover */}
      <aside
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-blue-50 to-white shadow-xl transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="p-4 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FiX className="text-xl text-red-600" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all mb-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info and Logout */}
          {isAuthenticated && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">Logged in as</p>
                <p className="text-gray-800 font-semibold truncate">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors mb-2"
              >
                <FiUser />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
