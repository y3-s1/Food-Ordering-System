import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MapPin, ChevronDown, Clock, Search, ShoppingCart } from 'lucide-react';
// import CartDrawer from '../cart/CartDrawer';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import SidebarDrawer from './SidebarDrawer';
import { useCart } from '../../context/CartContext';

const Navbar: FC = () => {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  // const [isCartOpen, setCartOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, setCartOpen } = useCart();
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleCartClick = () => {
    if (isDesktop) {
      setCartOpen(true);
    } else {
      navigate('/cart');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b w-full">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <Menu
              size={24}
              className="cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
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
            <button 
              onClick={handleCartClick}
              className="relative p-2 text-gray-700 hover:text-green-600"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Drawers */}
      <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
