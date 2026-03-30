import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileMedical, FaExclamationCircle, FaCheckCircle, FaRobot, FaVolumeUp } from 'react-icons/fa';
import { playSound } from '../utils/soundEffects';

const ReportAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setAnalysis(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setError(null);
        try {
            playSound('click');
        } catch (e) {
            console.error('Sound error:', e);
        }
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5001';
            const response = await axios.post(`${baseUrl}/api/ai/analyze-report`, 
                formData,
                { headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                } }
            );
            try {
                playSound('success');
            } catch (e) {
                console.error('Sound error:', e);
            }
            setAnalysis(response.data.data);
        } catch (err) {
            console.error(err);
            try {
                playSound('alert');
            } catch (e) {
                console.error('Sound error:', e);
            }
            setError(err.response?.data?.message || "Failed to process report. Ensure Tesseract OCR and Gemini API are configured.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlayExplanation = () => {
        if (!analysis) return;
        
        try {
            playSound('notification');
        } catch (e) {
            console.error('Sound error:', e);
        }
        setIsSpeaking(!isSpeaking);
        
        if (!isSpeaking) {
            const textToSpeak = analysis.analysis;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 0.95;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Medical Report Analysis</h3>
                <p className="text-gray-500 mb-6">Upload an image or PDF of your medical report (MRI, Blood Test, etc.) for an AI-powered summary and explanation.</p>
                
                {/* Upload Zone */}
                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-10 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center space-y-4 ${
                        file ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 group-hover:border-blue-400 group-hover:bg-blue-50'
                    }`}>
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${
                            file ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 shadow-sm border border-gray-100'
                        }`}>
                            <FaCloudUploadAlt className="text-4xl" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-700">
                                {file ? file.name : "Select or Drop Report File"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Supported formats: JPG, PNG, PDF (Max 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 font-medium">
                    <FaExclamationCircle className="flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Analyze Button */}
            <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 font-bold transition-all shadow-xl ${
                    loading || !file
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <FaRobot className="text-xl" />
                        <span>Perform AI Analysis</span>
                    </>
                )}
            </button>

            {/* Analysis Results Container */}
            {analysis && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-12 pt-12 border-t-2 border-gray-50"
                >
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between text-white">
                            <div className="flex items-center space-x-3">
                                <FaFileMedical className="text-2xl" />
                                <h4 className="text-lg font-bold">Analysis Report</h4>
                            </div>
                            <span className="flex items-center space-x-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase backdrop-blur-md">
                                <FaCheckCircle />
                                <span>AI Processing Complete</span>
                            </span>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            {/* Summary Card */}
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Professional Summary</h5>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePlayExplanation}
                                        className={`p-3 rounded-full transition-all ${
                                            isSpeaking 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-blue-200 text-blue-600 hover:bg-blue-300'
                                        }`}
                                        title={isSpeaking ? "Stop listening" : "Listen to explanation"}
                                    >
                                        <FaVolumeUp className="text-lg" />
                                    </motion.button>
                                </div>
                                <div className="text-gray-800 leading-relaxed prose prose-blue max-w-none whitespace-pre-wrap">
                                    {analysis.analysis}
                                </div>
                            </div>
                            
                            {/* Bottom Disclaimer and Tips */}
                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-start space-x-3 mb-4">
                                    <FaExclamationCircle className="text-amber-500 mt-1 flex-shrink-0" />
                                    <div className="text-sm text-amber-900 leading-normal">
                                        <strong>Medical Disclaimer:</strong> This analysis is machine-generated for informational support. 
                                        It is not a clinical diagnosis or medical advice. Please show this report to your physician for definitive interpretation.
                                    </div>
                                </div>
                                <div className="text-xs text-amber-700/80 italic pt-3 border-t border-amber-200/50">
                                    Report Extracted Text: {analysis.raw_text_extracted}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ReportAnalyzer;
