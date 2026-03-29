import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaSearch, FaStethoscope } from 'react-icons/fa';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const commonSymptoms = [
        'fever', 'cough', 'fatigue', 'headache', 'nausea', 'vomiting', 
        'diarrhea', 'chest_pain', 'shortness_of_breath', 'dizziness',
        'muscle_pain', 'joint_pain', 'skin_rash', 'sore_throat'
    ];

    const addSymptom = (symptom) => {
        const normalized = symptom.toLowerCase().trim().replace(/ /g, '_');
        if (normalized && !symptoms.includes(normalized)) {
            setSymptoms([...symptoms, normalized]);
            setInputValue('');
        }
    };

    const removeSymptom = (symptom) => {
        setSymptoms(symptoms.filter(s => s !== symptom));
    };

    const handleDiagnose = async () => {
        if (symptoms.length === 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
            const response = await axios.post(`${baseUrl}/api/ai/diagnose`, 
                { symptoms },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResults(response.data.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to connect to AI service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Symptoms</h3>
                <p className="text-gray-500 mb-4">Add the symptoms you are currently experiencing for a preliminary AI assessment.</p>
                
                {/* Input Area */}
                <div className="flex space-x-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSymptom(inputValue)}
                            placeholder="Type a symptom (e.g., cough, fever)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button 
                        onClick={() => addSymptom(inputValue)}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {commonSymptoms.filter(s => !symptoms.includes(s)).slice(0, 6).map(s => (
                        <button
                            key={s}
                            onClick={() => addSymptom(s)}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                        >
                            + {s.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
                <div className="py-4 border-y border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Your Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {symptoms.map(s => (
                                <motion.span
                                    key={s}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 font-medium"
                                >
                                    {s.replace(/_/g, ' ')}
                                    <button 
                                        onClick={() => removeSymptom(s)}
                                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-medium">
                    {error}
                </div>
            )}

            {/* Diagnose Button */}
            <button
                onClick={handleDiagnose}
                disabled={loading || symptoms.length === 0}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all shadow-xl ${
                    loading || symptoms.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <FaStethoscope />
                        <span>Diagnose Possible Conditions</span>
                    </>
                )}
            </button>

            {/* Results Display */}
            {results && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 pt-8 border-t border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Diagnosis Results</h3>
                    
                    <div className="space-y-4">
                        {results.predictions && results.predictions.map((res, idx) => (
                            <div 
                                key={idx} 
                                className={`p-6 rounded-2xl border-2 transition-all ${
                                    idx === 0 ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-50' : 'bg-white border-gray-100 hover:border-blue-100'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-800">{res.disease}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {res.probability}% Probability
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${res.probability}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-400'}`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <h4 className="text-amber-800 font-bold mb-2">AI Guidance</h4>
                        <p className="text-sm text-amber-900 leading-relaxed mb-4">
                            Based on your inputs, the model suggests {results.primary_prediction} as the most likely condition. 
                            If you experience worsening symptoms like high fever or breathing difficulty, seek urgent care.
                        </p>
                        <p className="text-xs text-amber-700 italic border-t border-amber-200 pt-3 mt-3">
                            {results.disclaimer}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SymptomChecker;
