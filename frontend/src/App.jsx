import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import './index.css';

// Pages
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Hospitals from './pages/Hospitals.jsx';
import Pharmacies from './pages/Pharmacies.jsx';
import BloodDonors from './pages/BloodDonors.jsx';
import BloodRequests from './pages/BloodRequests.jsx';
import ReportResource from './pages/ReportResource.jsx';
import Emergency from './pages/Emergency.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import BloodDonorForm from './pages/BloodDonorForm.jsx';
import BloodRequestForm from './pages/BloodRequestForm.jsx';
import ResourceForm from './pages/ResourceForm.jsx';
import PatientPortal from './pages/PatientPortal.jsx';
import AnnualCheckup from './pages/AnnualCheckup.jsx';
import Appointments from './pages/Appointments.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import InteractiveAnatomy from './pages/InteractiveAnatomy.jsx';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const noLayoutPaths = ['/login', '/register'];
  const showLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />}
      
      <div className="flex-1">
        {showLayout && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/blood-donors" element={<BloodDonors />} />
            <Route path="/blood-donor-form" element={<BloodDonorForm />} />
            <Route path="/blood-requests" element={<BloodRequests />} />
            <Route path="/blood-request-form" element={<BloodRequestForm />} />
            <Route path="/report-resource" element={<ReportResource />} />
            <Route path="/resource-form" element={<ResourceForm />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/interactive-anatomy" element={<InteractiveAnatomy />} />
            <Route path="/annual-checkup" element={<AnnualCheckup />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>

      {showLayout && <Footer />}
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
