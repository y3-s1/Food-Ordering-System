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
      ? "text-white bg-blue-700 md:text-blue-700 md:bg-transparent"
      : "text-gray-900 hover:text-blue-700";
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
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
            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
