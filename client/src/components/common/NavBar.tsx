import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MapPin, ChevronDown, Clock, Search, ShoppingCart } from 'lucide-react';
import CartDrawer from '../cart/CartDrawer';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Navbar: FC = () => {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [isCartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  // detect desktop (>=768px)
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleCartClick = () => {
    if (isDesktop) {
      // Desktop: open drawer
      setCartOpen(true);
    } else {
      // Mobile: navigate to full-page cart
      navigate('/cart');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b w-full">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Menu size={24} className="cursor-pointer" />
            {/* Delivery/Pickup Toggle */}
            <div className="hidden sm:flex bg-gray-100 rounded-full p-1">
              {(['delivery', 'pickup'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={`px-4 py-1 rounded-full cursor-pointer text-sm font-medium ${
                    mode === value ? 'bg-white text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
            {/* Location & Time */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 cursor-pointer">
              <MapPin size={16} className="text-red-500" />
              <span className="text-sm font-medium">12 Anagarika Dharmapala St.</span>
              <Clock size={16} className="text-gray-600 ml-2" />
              <span className="text-sm font-medium">Now</span>
              <ChevronDown size={16} className="text-gray-600 ml-1" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Uber Eats"
                className="pl-10 pr-4 py-1 border rounded-full w-64 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs font-bold rounded-full px-1">
                2
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-over Cart Drawer only for desktop */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;