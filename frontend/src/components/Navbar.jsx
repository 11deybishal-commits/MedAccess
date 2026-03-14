import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiSearch } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue}`);
      setSearchValue('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 navbar">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="text-xl hover:bg-gray-100 p-2 rounded transition-colors"
          >
            <FiMenu />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:inline">MedAccess</h1>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search hospitals, pharmacies..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <FiSearch />
            </button>
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <FiUser className="text-gray-600" />
                <span className="text-sm text-gray-700 truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FiLogOut className="text-lg" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
