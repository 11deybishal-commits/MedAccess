import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiActivity, FiShield, FiCalendar, FiClock, FiFileText, FiThermometer, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const packages = [
  {
    id: 'basic',
    title: 'Essential Wellness',
    price: '$199',
    icon: <FiActivity className="text-3xl text-emerald-500" />,
    color: 'emerald',
    tests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel', 'Lipid Profile', 'Blood Pressure Check']
  },
  {
    id: 'advanced',
    title: 'Comprehensive Matrix',
    price: '$399',
    icon: <FiShield className="text-3xl text-blue-500" />,
    color: 'blue',
    popular: true,
    tests: ['All Essential Tests', 'Thyroid Panel (TSH)', 'HbA1c (Diabetes)', 'Advanced Lipoproteins', 'Vitamin D & B12 Levels']
  },
  {
    id: 'premium',
    title: 'Executive Genomic',
    price: '$899',
    icon: <FiHeart className="text-3xl text-purple-500" />,
    color: 'purple',
    tests: ['All Comprehensive Tests', 'Genetic Risk Markers', 'Cardiac Stress Test', 'Full Body MRI Scan', 'Hormonal Synthesis Panel']
  }
];

const AnnualCheckup = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleConfirm = async () => {
    try {
      if (!selectedPackage) return;
      const amountStr = selectedPackage.price.replace('$', '').replace(/,/g, '');
      const amount = Number(amountStr);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const orderRes = await axios.post(`${apiUrl}/payment/create-order`, { amount });

      const options = {
        key: orderRes.data.key,
        amount: orderRes.data.order.amount,
        currency: "USD", // Example: keeping currency as per selectedPackage.price ($). In prod, standardise to INR/USD.
        name: "MediAccess Network",
        description: `Check-up package: ${selectedPackage.title}`,
        order_id: orderRes.data.order.id,
        handler: async function (response) {
          try {
            await axios.post(`${apiUrl}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            // Payment successful
            toast.success('Payment verified successfully!');
            setStep(4);
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          // If we have user details from a context we'd populate them here
          name: "Patient Name",
          email: "patient@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error('Payment failed!');
      });
      rzp.open();
    } catch (error) {
      toast.error('Could not initiate payment. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-body">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header Banner */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Preventive Care
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-slate-800">
            Annual Health <span className="text-emerald-500">Check-up</span>
          </h1>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-lg">
            Stay ahead of potential health risks with our AI-driven comprehensive diagnostic screenings.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-12 relative max-w-3xl mx-auto">
           <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0 rounded-full"></div>
           <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
           
           {[1, 2, 3, 4].map((num) => (
             <div key={num} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-500 ${
               step >= num ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white text-slate-400 border-2 border-slate-200'
             }`}>
               {step > num ? <FiCheckCircle /> : num}
             </div>
           ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 min-h-[500px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Package */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-8 text-center">Select Your Diagnostic Package</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {packages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all ${
                        selectedPackage?.id === pkg.id 
                          ? `border-${pkg.color}-500 bg-${pkg.color}-50 shadow-lg scale-105` 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Most Recommended
                        </div>
                      )}
                      <div className="mb-4">{pkg.icon}</div>
                      <h3 className="text-xl font-bold font-headline mb-1 text-slate-800">{pkg.title}</h3>
                      <div className="text-3xl font-extrabold text-slate-800 mb-6">{pkg.price}</div>
                      
                      <ul className="space-y-3">
                        {pkg.tests.map((test, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                            <span className={`text-${pkg.color}-500 mt-0.5`}><FiCheckCircle /></span> {test}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 flex justify-end">
                  <button 
                    disabled={!selectedPackage}
                    onClick={handleNext}
                    className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-8 text-center">Schedule Facility Visit</h2>
                
                <div className="space-y-8">
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                    <FiThermometer className="text-3xl text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900">Pre-test Instructions</h4>
                      <p className="text-sm text-blue-800 mt-1">Please ensure you are fasting for at least 8-10 hours prior to your selected time slot for accurate lipid and glucose readings.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Date</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Time Slot</label>
                      <div className="relative">
                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium appearance-none"
                        >
                          <option value="">Select slot</option>
                          <option value="07:00 AM">07:00 AM</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Brief Medical History (Optional)</label>
                     <textarea 
                       rows="4"
                       value={patientHistory}
                       onChange={(e) => setPatientHistory(e.target.value)}
                       placeholder="Any existing conditions, recent surgeries, or specific concerns our doctors should focus on..."
                       className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                     ></textarea>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button onClick={handleBack} className="text-slate-500 font-bold px-6 py-4 hover:bg-slate-50 rounded-xl transition">Back</button>
                  <button 
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNext}
                    className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50"
                  >
                    Review Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <FiFileText className="text-5xl text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Review Your Check-up Details</h2>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Selected Package</span>
                    <span className="font-bold text-slate-800 text-lg">{selectedPackage?.title}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Schedule</span>
                    <span className="font-bold text-slate-800">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                     <span className="text-slate-500 font-medium">Total Cost</span>
                     <span className="font-extrabold text-2xl text-emerald-600">{selectedPackage?.price}</span>
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button onClick={handleBack} className="text-slate-500 font-bold px-6 py-4 hover:bg-slate-50 rounded-xl transition">Back</button>
                  <button 
                    onClick={handleConfirm}
                    className="bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 max-w-lg mx-auto"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="text-5xl text-emerald-500" />
                </div>
                <h2 className="text-3xl font-extrabold font-headline mb-4">You're All Set!</h2>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  Your <span className="font-bold text-slate-700">{selectedPackage?.title}</span> has been confirmed for 
                  <span className="font-bold text-slate-700"> {selectedDate}</span> at <span className="font-bold text-slate-700">{selectedTime}</span>. 
                  Instructions and address have been sent to your registered email.
                </p>
                
                <button 
                  onClick={() => navigate('/patient-portal')}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
                >
                  Go to Patient Portal
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnnualCheckup;
