import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x1d4ed8,
          midtoneColor: 0x3b82f6,
          lowlightColor: 0x1e3a8a,
          baseColor: 0x0f172a,
          blurFactor: 0.60,
          speed: 1.50,
          zoom: 1.50
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = response.data;
      login(user, token);
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={vantaRef} className="min-h-screen pt-28 pb-12 flex items-center justify-center px-4 overflow-hidden relative">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30"
            >
              <GiCaduceus />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 font-headline tracking-tight">Welcome Back</h1>
            <p className="text-blue-200/80 font-medium">Empowering your medical journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@mediaccess.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-white/30"
                />
              </div>
              {errors.email && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-red-400 text-sm mt-2 ml-1">
                  <FiAlertCircle /> {errors.email}
                </motion.div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                 <label className="block text-white/90 text-sm font-semibold">Password</label>
                 <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-white/30"
                />
              </div>
              {errors.password && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-red-400 text-sm mt-2 ml-1">
                  <FiAlertCircle /> {errors.password}
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3.5 mt-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Authenticating...
                </span>
              ) : 'Sign In Securely'}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/70">
              New to MediAccess?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all ml-1"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;














































































































































































































































