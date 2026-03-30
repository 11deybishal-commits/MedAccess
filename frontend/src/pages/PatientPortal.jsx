import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { reportService, appointmentService, biometricService } from '../services/authService.js';

const PatientPortal = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [latestBiometrics, setLatestBiometrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const [formData, setFormData] = useState({ title: '', category: 'General', file: null });

  useEffect(() => {
    fetchReports();
    fetchAppointments();
    fetchBiometrics();
  }, []);

  const fetchBiometrics = async () => {
    try {
      const res = await biometricService.getLatest();
      setLatestBiometrics(res.data.data);
    } catch (error) {
       console.error('Error fetching biometrics');
    }
  };

  const handleSyncBiometrics = async () => {
    try {
      setAnalyzing(true); // Reuse analyzing state for "Syncing"
      const mockData = {
        heartRate: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
        oxygenLevel: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
        steps: Math.floor(Math.random() * 10000),
        bloodPressure: { systolic: 120, diastolic: 80 }
      };
      await biometricService.record(mockData);
      toast.success('Health Data Synced');
      fetchBiometrics();
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMine();
      setAppointments(res.data.data);
    } catch (error) {
       console.error('Error fetching appointments');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getMyReports();
      setReports(res.data.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) {
      return toast.warning('Please provide a title and select a file');
    }
    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', formData.file);
      data.append('title', formData.title);
      data.append('category', formData.category);

      await reportService.uploadReport(data);
      toast.success('Report uploaded securely');
      setIsModalOpen(false);
      setFormData({ title: '', category: 'General', file: null });
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setAnalyzing(true);
      const res = await reportService.analyzeReport(id);
      setSelectedAnalysis(res.data.data);
      toast.success('AI Analysis Complete');
    } catch (error) {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getAPIUrl = (path) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    return baseUrl.replace('/api', '') + path;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const date = e.target.date.value;
    const type = e.target.type.value;
    if (!date) return toast.warning('Please select a date');
    
    try {
      setLoading(true);
      await appointmentService.book({ appointmentDate: date, type });
      toast.success('Appointment Requested');
      setIsBookingOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body pt-24 pb-12">
      {/* ... (rest of the component) */}

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2"></div>
              <h2 className="text-2xl font-extrabold font-headline text-slate-800 mb-6">Schedule Consultation</h2>
              <form onSubmit={handleBooking} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Visit Type</label>
                  <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors">
                    <option>Annual Check-up</option>
                    <option>Specialist Consultation</option>
                    <option>Lab Work Referral</option>
                    <option>Tele-health Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date & Time</label>
                  <input type="datetime-local" name="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsBookingOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Close</button>
                  <button type="submit" className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-colors">
                    Book Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface">Patient Portal</h1>
            <p className="text-on-surface-variant mt-2 max-w-xl">Curated health records and biometric reporting exclusively for {user?.name}.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white font-bold font-headline px-8 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">upload_file</span>
            Upload Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lab Results Area */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-6 text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lab_profile</span>
              Your Medical Records
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-40 bg-surface-container-low rounded-[2rem]"></div>)}
              </div>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={report._id} 
                    className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-primary/20 rounded-bl-[4rem] group-hover:scale-150 transition-transform">
                      <span className="material-symbols-outlined text-8xl">clinical_notes</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="inline-block px-3 py-1 bg-tertiary-container/30 text-tertiary text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 self-start border border-tertiary/10">
                        {report.category}
                      </div>
                      <h3 className="font-extrabold font-headline text-xl text-slate-800 mb-1">{report.title}</h3>
                      <p className="text-sm text-slate-500 mb-6">{new Date(report.dateConducted).toLocaleDateString()}</p>
                      <div className="mt-auto flex gap-3">
                        <a 
                          href={getAPIUrl(report.fileUrl)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-sm py-2 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                        >
                           <span className="material-symbols-outlined text-sm">visibility</span> View
                        </a>
                        <button 
                          onClick={() => handleAnalyze(report._id)}
                          disabled={analyzing}
                          className="flex-1 bg-gradient-to-r from-tertiary to-teal-500 hover:from-teal-500 hover:to-tertiary text-white font-bold text-sm py-2 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                        >
                           <span className="material-symbols-outlined text-sm">auto_awesome</span> 
                           {analyzing ? '...' : 'Analyze'}
                        </button>
                      </div>
                      
                      {report.aiAnalysis && !selectedAnalysis && (
                        <button 
                          onClick={() => setSelectedAnalysis(report.aiAnalysis)}
                          className="mt-3 text-xs font-bold text-tertiary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">history</span>
                          View Previous Analysis
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant p-16 rounded-[3rem] text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">folder_open</span>
                <p className="text-slate-500 font-medium">No medical reports found. Upload your diagnostics securely.</p>
              </div>
            )}
          </div>

          {/* Biometrics & Checks */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div>
                   <h3 className="font-extrabold font-headline text-2xl">AI Biometric Sync</h3>
                   <p className="text-white/80 text-xs mt-1">Connecting to wearable data.</p>
                 </div>
                 <button 
                  onClick={handleSyncBiometrics}
                  disabled={analyzing}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                 >
                   <span className={`material-symbols-outlined text-sm ${analyzing ? 'animate-spin' : ''}`}>sync</span>
                 </button>
               </div>

               <div className="space-y-4 relative z-10">
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                      <span>Heart Rate</span> <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span> Live</span>
                    </div>
                    <div className="text-3xl font-extrabold font-headline">{latestBiometrics?.heartRate || '--'} <span className="text-sm font-normal opacity-60">bpm</span></div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">O2 Saturation</div>
                      <div className="text-xl font-bold">{latestBiometrics?.oxygenLevel || '--'}<span className="text-xs ml-0.5">%</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Daily Steps</div>
                      <div className="text-xl font-bold">{latestBiometrics?.steps?.toLocaleString() || '--'}</div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-extrabold font-headline text-xl text-slate-800 flex items-center gap-2">
                   <span className="material-symbols-outlined text-tertiary">calendar_clock</span>
                   Upcoming Events
                 </h3>
                 <button onClick={() => setIsBookingOpen(true)} className="text-primary font-bold text-xs hover:underline">Book New</button>
               </div>
               
               <div className="space-y-4">
                 {appointments.length > 0 ? appointments.slice(0, 3).map(app => (
                   <div key={app._id} className="bg-surface-container-low rounded-2xl p-4 flex gap-4 items-center group hover:bg-surface-container transition-colors">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-0.5">{new Date(app.appointmentDate).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-black leading-none">{new Date(app.appointmentDate).getDate()}</span>
                     </div>
                     <div className="flex-1">
                       <h4 className="font-bold text-slate-800 text-sm">{app.type}</h4>
                       <p className="text-[10px] text-slate-500 font-medium">{app.doctorName}</p>
                     </div>
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${app.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{app.status}</span>
                   </div>
                 )) : (
                   <p className="text-xs text-slate-400 italic text-center py-4">No upcoming appointments scheduled.</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-2xl font-extrabold font-headline text-slate-800 mb-6 relative z-10">Upload Medical File</h2>
              <form onSubmit={handleUpload} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Report Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g., Complete Blood Count" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                    <option>General</option>
                    <option>MRI</option>
                    <option>CT Scan</option>
                    <option>ECG</option>
                    <option>Blood Test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">File</label>
                  <input type="file" onChange={e => setFormData({...formData, file: e.target.files[0]})} className="w-full text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-colors disabled:opacity-50">
                    {uploading ? 'Processing...' : 'Upload Data'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Analysis Results Modal */}
      <AnimatePresence>
        {selectedAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl shadow-2xl border border-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                   <div className="flex items-center gap-2 text-tertiary font-bold uppercase tracking-widest text-[10px] mb-2">
                     <span className="material-symbols-outlined text-sm">verified_user</span>
                     AI Diagnostic Insights
                   </div>
                   <h2 className="text-3xl font-extrabold font-headline text-slate-800">Clinical Analysis</h2>
                </div>
                <button 
                  onClick={() => setSelectedAnalysis(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-tighter mb-2">Summary</h4>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">{selectedAnalysis.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">list_alt</span>
                      Key Findings
                    </h4>
                    <ul className="space-y-3">
                      {selectedAnalysis.findings.map((f, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                           {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-tertiary">tips_and_updates</span>
                      Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {selectedAnalysis.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
                           <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0"></span>
                           {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <span className="text-xl font-black text-slate-800">{(selectedAnalysis.confidenceScore * 100).toFixed(0)}<span className="text-xs font-bold">%</span></span>
                     </div>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
                   </div>
                   <button 
                     onClick={() => setSelectedAnalysis(null)}
                     className="bg-slate-900 text-white font-bold font-headline px-10 py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
                   >
                     Understood
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientPortal;
