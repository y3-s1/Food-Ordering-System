import React, { FC } from 'react';
import { X, User, LogOut, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarDrawer: FC<SidebarDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // TODO: Add your logout logic here (e.g., clear auth tokens, call API)
    logout();
    navigate('/');
    onClose();
  };

  return (
    // Overlay
    <div
      className={`fixed inset-0 z-50 flex transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`relative bg-white w-64 h-full p-6 transform transition-transform ease-in-out duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 focus:outline-none"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Menu Links */}
        <nav className="mt-8 space-y-4">
          <button
            className="flex items-center space-x-2 w-full text-left hover:text-red-500"
            onClick={() => {
              navigate('/dashboard');
              onClose();
            }}
          >
            <User size={18} />
            <span>Profile</span>
          </button>

          <button
            className="flex items-center space-x-2 w-full text-left hover:text-red-500"
            onClick={() => {
              navigate('/orders');
              onClose();
            }}
          >
            <List size={18} />
            <span>Order History</span>
          </button>

          <button
            className="flex items-center space-x-2 w-full text-left hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SidebarDrawer;