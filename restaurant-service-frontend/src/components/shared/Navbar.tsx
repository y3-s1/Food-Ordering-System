import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const currentPath = location.pathname;
  
  const getLinkClassName = (path: string) => {
    const isActive = currentPath === path;
    return isActive
      ? "text-blue-300 border-b-2 border-blue-400"
      : "text-gray-300 hover:text-blue-300";
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-400">
          FoodyGo
        </Link>
        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <Link to="/dashboard" className={getLinkClassName('/dashboard')}>Dashboard</Link>
          </li>
          <li>
            <Link to="/add-restaurant" className={getLinkClassName('/add-restaurant')}>Add Restaurant</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:underline">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;