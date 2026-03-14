import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiGithub } from 'react-icons/fi';

const Footer = () => {
  const emergencyNumbers = [
    { label: 'Ambulance', number: '102' },
    { label: 'Police', number: '100' },
    { label: 'Fire', number: '101' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-100 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              M
            </div>
            MedAccess
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            MedAccess is an intelligent healthcare resource locator that helps users quickly find nearby medical services during emergencies.
          </p>
        </div>

        {/* Emergency Numbers */}
        <div>
          <h4 className="text-lg font-bold mb-4">Emergency Contacts</h4>
          <div className="space-y-2">
            {emergencyNumbers.map((item) => (
              <div key={item.number} className="flex items-center gap-2">
                <FiPhone className="text-blue-400" />
                <span className="text-sm">
                  {item.label}: <strong>{item.number}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact</h4>
          <div className="space-y-2">
            <a href="mailto:contact@medaccess.com" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
              <FiMail />
              <span className="text-sm">contact@medaccess.com</span>
            </a>
            <a href="https://github.com/medaccess" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
              <FiGithub />
              <span className="text-sm">github.com/medaccess</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 MedAccess. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
