import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope, FaFileMedical, FaHistory, FaRobot } from 'react-icons/fa';
import SymptomChecker from '../components/SymptomChecker';
import ReportAnalyzer from '../components/ReportAnalyzer';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('symptoms');

  const tabs = [
    { id: 'symptoms', label: 'Symptom Checker', icon: <FaStethoscope /> },
    { id: 'reports', label: 'Report Analyzer', icon: <FaFileMedical /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4"
          >
            <FaRobot className="text-3xl text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            MediAccess <span className="text-blue-600">AI Assistant</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant health insights using our advanced machine learning models and medical report analysis.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-8"
        >
          {activeTab === 'symptoms' ? (
            <SymptomChecker />
          ) : (
            <ReportAnalyzer />
          )}
        </motion.div>

        {/* Global Disclaimer */}
        <div className="mt-10 p-4 rounded-xl bg-red-50 border border-red-100 text-center">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ IMPORTANT: This AI Assistant provides information for educational purposes only. It is NOT a medical diagnosis. 
            Always consult a licensed healthcare professional before taking any medication or making medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
