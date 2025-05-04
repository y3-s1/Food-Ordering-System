// Updated Footer component
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-blue-400">FoodyGo</h3>
            <p className="text-sm mt-1">Restaurant Management Platform</p>
          </div>
          <div className="flex flex-col text-center md:text-right">
            <p className="text-sm">&copy; {new Date().getFullYear()} FoodyGo. All rights reserved.</p>
            <div className="mt-2 flex space-x-4 justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;