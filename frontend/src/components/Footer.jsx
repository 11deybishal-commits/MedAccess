import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 w-full py-12 px-6 md:px-12 border-t border-slate-200/20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-black text-blue-900 dark:text-blue-50 font-manrope">Clinical Curator</div>
          <div className="font-inter text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500">
             © 2026 Clinical Curator Medical Group. All rights reserved.
          </div>
        </div>
        <div className="flex flex-wrap gap-8 md:justify-end font-inter text-xs uppercase tracking-widest">
          <Link to="#" className="text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors opacity-80 hover:opacity-100">Privacy Policy</Link>
          <Link to="#" className="text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link to="#" className="text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors opacity-80 hover:opacity-100">Accessibility</Link>
          <Link to="#" className="text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors opacity-80 hover:opacity-100">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
