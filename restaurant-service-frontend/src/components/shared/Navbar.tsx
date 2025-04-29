// Updated Navbar component with better styling and responsive design
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const currentPath = location.pathname;
  
  const getLinkClassName = (path: string) => {
    const isActive = currentPath === path;
    return isActive
      ? "text-blue-400 border-b-2 border-blue-400 pb-1"
      : "text-gray-300 hover:text-blue-400 transition-colors duration-200";
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between mx-auto p-4">
        <div className="flex items-center justify-between w-full md:w-auto mb-3 md:mb-0">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
            FoodyGo
          </Link>
          {user && (
            <span className="text-gray-400 text-sm hidden md:block">Welcome, {user.email}</span>
          )}
        </div>
        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <Link to="/dashboard" className={getLinkClassName('/dashboard')}>Dashboard</Link>
          </li>
          <li>
            <Link to="/add-restaurant" className={getLinkClassName('/add-restaurant')}>Add Restaurant</Link>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className="text-red-400 hover:text-red-300 transition-colors duration-200 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;