// src/components/cart/CartDrawer.tsx
import React, { FC} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CartPage from '../../pages/cart/CartPage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: FC<Props> = ({ isOpen, onClose }) => {

  // render nothing if closed
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* slide-over */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-md
          bg-white backdrop-blur-lg
          shadow-2xl
          transform transition-transform duration-300 mt-13 pb-8
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 border-b">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className=" h-[calc(100%-64px)] overflow-y-auto py-6 m-2 ml-2 pr-6">
          <CartPage/>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;
