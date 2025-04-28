import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CartPage from '../../pages/cart/CartPage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: FC<Props> = ({ isOpen, onClose }) => {
  return createPortal(
    <div className={`fixed inset-0 z-50 flex transition-opacity ease-in-out duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* slide-over */}
      <div
        className={`fixed top-1 right-0 bottom-0 w-full max-w-md bg-white backdrop-blur-lg shadow-2xl transform transition-transform ease-in-out duration-300 pb-8 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto hide-scrollbar py-6 m-2 ml-2 pr-6">
          <CartPage />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CartDrawer;