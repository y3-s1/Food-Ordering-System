import React from 'react';

const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-800 text-white text-center py-4 w-full">
        <p>&copy; {new Date().getFullYear()} Food Ordering System. All rights reserved.</p>
      </footer>
    );
  };

export default Footer;