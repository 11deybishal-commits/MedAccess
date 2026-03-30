import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiVideo, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5001';

const doctorsList = [
  { id: 1, name: 'Dr. Julian Sterling', specialty: 'Neurosurgery', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi0zBjgSgULjJJ3FlF5vGdXOthCgfQUFJeT0uq0cIrM94cLcVMrpPZtlIs6IucE6fU5PwL92EnobbuNEc6sO0Kt73eK-c4MzJFiDCyRxAtxCeePM3sGkQay1tTMFdpqiTBoIq8Sc_NurJHZHGTWzQgJB6jCmdKog0YQ07c5ctw5dUomqx3BBxu4hYpAHLAA8aqalM5_WrcA80HvKBxSBNdvVO0TiGs0xGqNordVZjPbtyIOjAvGEavHClFhhK_df2JoGVD4-hq5aI' },
  { id: 2, name: 'Dr. Elena Vance', specialty: 'Cardiology', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMK5OH2gtcb2LCncMBUZyY9EAEsG25qGjXxNpxbGmvnzl4GMbYV9Wcy1p_bFwkEsDL5D7nSGkVfEyqblAdCsmtttriQ9S5S3VaMhluqiGn7QvaY7-1QIJ9BCAHFBYRTsFXcDd7rqduGDgSOsJpzkaiU4H7n8UoplriHHx3Q1AKOryiF6u-zHCLUhvkd8OYXPB0uIUiAyo7RdhJ2bs07ERuw-C-DSduOI9y2rChwD3GjqISh_g2Zu81kJlqxhfgwo8m5gVtrgXdzaI' },
  { id: 3, name: 'Dr. Marcus Chen', specialty: 'Radiology', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9GCxNS1eggJX-NyB1KRWh37VXA48KeUZnbMLBi50FREseQVqKvLEmeTb0IZqcFUjDhJ2clyEPnCoMo2OAZsX-cE0lbwmTna8IWZKZr2AkjfXuY1O3heDe5GVxa3RNOgZ7YEFyIg3T2_jc9dMaQB6LQenUNt37rjwnKSRQEepsHiYog06Iv0EGGL203TJYkaEZx29PRNQaqPceQNsm0K0_odF4uiVTgns8WwRHA77k_QI-7Z1JTPQGvqqVmqQlG3Hzz1PDLi1ISYA' }
];

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Booking Form State
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      const response = await axios.get(`${API_BASE_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data.data);
    } catch (error) {
      console.warn("Failed fetching appointments. Using mock data for preview.", error);
      // Fallback mock Data if backend empty/fails
      setAppointments([
        {
          _id: 'mock123',
          doctorId: '1',
          doctorName: 'Dr. Julian Sterling',
          category: 'Neurosurgery',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'confirmed',
          type: 'online',
          prescription: {
            medications: ['Aspirin 81mg OD', 'Atorvastatin 20mg OD'],
            notes: 'Rest for 3 days. Return if headaches persist.',
            dateIssued: new Date().toLocaleDateString()
          }
        }
      ]);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/appointments`, {
        doctor: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        type: 'online'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment booked successfully!');
      setShowBooking(false);
      fetchAppointments();
    } catch (error) {
       toast.warning("Backend booking failed. Booking locally for preview.");
       const newApt = {
         _id: Math.random().toString(),
         doctorName: selectedDoctor.name,
         category: selectedDoctor.specialty,
         date: selectedDate,
         time: selectedTime,
         status: 'confirmed',
         type: 'online'
       };
       setAppointments([newApt, ...appointments]);
       setShowBooking(false);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFPrescription = (apt) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 64, 175);
    doc.text("MedAccess Clinic", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("123 Healthcare Ave, Medical City | Support: 1-800-MEDIC", 105, 28, null, null, "center");
    doc.line(20, 35, 190, 35);

    // Doctor & Patient Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Digital Prescription", 20, 50);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Doctor: ${apt.doctorName}`, 20, 60);
    doc.text(`Specialty: ${apt.category || 'General Practice'}`, 20, 68);
    doc.text(`Date of Issue: ${apt.prescription?.dateIssued || apt.date}`, 140, 60);
    doc.text(`Apt ID: ${apt._id.slice(-6).toUpperCase()}`, 140, 68);

    doc.line(20, 75, 190, 75);

    // Rx Symbol
    doc.setFontSize(36);
    doc.setFont("times", "italic");
    doc.text("Rx", 20, 95);

    // Medications
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let yMarker = 110;
    
    if (apt.prescription && apt.prescription.medications) {
        apt.prescription.medications.forEach((med, i) => {
            doc.text(`${i+1}. ${med}`, 30, yMarker);
            yMarker += 10;
        });
        
        yMarker += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Notes/Advice:", 20, yMarker);
        doc.setFont("helvetica", "normal");
        yMarker += 8;
        doc.text(apt.prescription.notes, 20, yMarker, { maxWidth: 170 });
    } else {
        doc.text("Pending review. Medications will be updated post-consultation.", 30, yMarker);
    }

    // Signature
    doc.setLineWidth(0.5);
    doc.line(140, 240, 190, 240);
    doc.text(`${apt.doctorName} Signature`, 145, 248);

    doc.save(`Prescription_${apt.date}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-body">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-6">
           <div>
             <h1 className="text-4xl font-extrabold font-headline text-slate-800">My Appointments</h1>
             <p className="text-slate-500 mt-2">Manage your clinical consultations and digital prescriptions.</p>
           </div>
           <button 
             onClick={() => setShowBooking(true)}
             className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
           >
             + Book New Session
           </button>
        </div>

        {/* List of Appointments */}
        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <FiCalendar className="text-5xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No appointments yet</h3>
              <p className="text-slate-500">Book your first consultation to get started.</p>
            </div>
          ) : (
             appointments.map(apt => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={apt._id} 
                 className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
               >
                 <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100 flex-shrink-0">
                     <FiUser />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-800">{apt.doctorName}</h3>
                     <p className="text-blue-600 font-semibold mb-2">{apt.category}</p>
                     <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                       <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><FiCalendar /> {apt.date}</span>
                       <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><FiClock /> {apt.time}</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                   <div className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider ${
                     apt.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                   }`}>
                     {apt.status || 'Scheduled'}
                   </div>
                   
                   <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                       <FiVideo /> Join Call
                     </button>
                     <button 
                       onClick={() => generatePDFPrescription(apt)}
                       className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-200 transition-colors tooltip-trigger relative group"
                     >
                       <FiDownload className="text-xl" />
                       <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                         Download Rx
                       </span>
                     </button>
                   </div>
                 </div>
               </motion.div>
             ))
          )}
        </div>

        {/* Booking Overlay Modal */}
        <AnimatePresence>
          {showBooking && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Schedule Consultation</h2>
                  <button onClick={() => setShowBooking(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl px-2">&times;</button>
                </div>

                <form onSubmit={handleBookAppointment} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Select Specialist</label>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {doctorsList.map(doc => (
                        <div 
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`cursor-pointer border-2 rounded-2xl p-4 text-center transition-all ${
                            selectedDoctor.id === doc.id ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200'
                          }`}
                        >
                          <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-sm bg-white" />
                          <h4 className="font-bold text-sm text-slate-800">{doc.name}</h4>
                          <p className="text-xs text-blue-600 font-medium">{doc.specialty}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-500 uppercase">Select Date</label>
                       <input 
                         type="date" 
                         required
                         value={selectedDate}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-500 uppercase">Select Time</label>
                       <select 
                         required
                         value={selectedTime}
                         onChange={(e) => setSelectedTime(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                       >
                         <option value="">Choose slot</option>
                         {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-500 uppercase">Reason for visit</label>
                     <textarea 
                       required
                       rows="3"
                       value={reason}
                       onChange={(e) => setReason(e.target.value)}
                       placeholder="Briefly describe your symptoms or concern..."
                       className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                     ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex justify-center"
                  >
                    {loading ? <span className="animate-spin text-2xl border-2 border-white border-t-transparent rounded-full w-6 h-6"></span> : 'Confirm Booking'}
                  </button>
                </form>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Appointments;
