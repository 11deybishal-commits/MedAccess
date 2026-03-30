import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiSearch, FiSettings } from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const isHospitalAdmin = user?.role === 'hospital_admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue}`);
      setSearchValue('');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] border-b border-white/50">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="text-xl hover:bg-slate-200 p-2 rounded transition-colors text-slate-700"
          >
            <FiMenu />
          </button>
          <Link to="/" className="flex items-center gap-2 group cursor-pointer text-blue-900 dark:text-blue-50 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center p-2 rounded-full bg-blue-100 text-blue-700 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <GiCaduceus className="text-3xl" />
            </div>
            <span className="text-2xl font-bold font-headline tracking-tighter">MediAccess</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search hospitals, pharmacies..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-sm"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary">
              <FiSearch />
            </button>
          </div>
        </form>

        <div className="hidden md:flex gap-6 font-headline text-sm font-medium tracking-wide items-center">
          {/* Show different nav based on role */}
          {isHospitalAdmin ? (
            <>
              <Link to="/hospital-admin" className="text-slate-600 hover:text-blue-800 transition-all">Admin Dashboard</Link>
              <Link to="/hospitals" className="text-slate-600 hover:text-blue-800 transition-all">Network</Link>
            </>
          ) : (
            <>
              <Link to="/hospitals" className="text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all">Services</Link>
              <Link to="/pharmacies" className="text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all">Pharmacies</Link>
              <Link to="/ai-assistant" className="text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all">AI Assistant</Link>
              <Link to="/patient-portal" className="text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-bold border-b-2 border-primary/20">Patient Portal</Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-2">
              {isHospitalAdmin && (
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Hospital Admin
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <FiUser className="text-primary" />
                <span className="text-sm text-primary font-bold truncate max-w-[100px]">{user?.name}</span>
              </div>
              {isHospitalAdmin && (
                <button onClick={() => navigate('/hospital-admin')} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-bold text-xs">
                  <FiSettings className="text-sm" />
                  Settings
                </button>
              )}
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors font-bold text-sm">
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <button onClick={() => navigate('/login')} className="text-primary font-bold hover:text-primary-container transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/register-hospital')}
                className="text-slate-600 font-bold hover:text-blue-700 transition-colors text-sm border-b border-dashed border-slate-300 hover:border-blue-400">
                Hospital Registration
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-full font-headline text-sm font-semibold hover:scale-95 active:scale-100 transition-transform shadow-lg shadow-primary/10"
              >
                Book Consultation
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
