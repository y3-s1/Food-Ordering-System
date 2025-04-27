import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../../types/cart/cart';
import ModalPortal from '../common/ModalPortal';

interface FoodItemModalProps {
  item: CartItem;
  onClose: () => void;
  onUpdate: (updatedItem: CartItem) => void;
  onRemove: (id: string) => void;
}

const FoodItemModal: React.FC<FoodItemModalProps> = ({ item, onClose, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [notes, setNotes] = useState<string>(item.notes || '');

  const basePrice = item.unitPrice;
  const getTotalPrice = () => basePrice * quantity;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop directly
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
    console.log("onClose called");
  };

  const handleUpdateClick = () => {
    onUpdate({
      ...item,
      quantity,
      notes,
      unitPrice: basePrice,
    });
    onClose();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.stopPropagation();
    onRemove(item._id);
    onClose();
  };

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white max-w-3xl w-full rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex p-4 items-center">
            <button 
              type="button"
              onClick={handleCloseClick}
              className="text-gray-600 hover:bg-gray-100 p-1 rounded-full"
            >
              <X size={24} />
            </button>
            <div className="ml-auto">
              <button 
                type="button"
                onClick={handleRemoveClick}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <img 
                src={item.imageUrl || "/api/placeholder/400/400"}
                alt={item.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold mb-1">{item.name}</h2>
              <div className="text-xl mb-4">LKR {basePrice.toFixed(2)}</div>

              {/* Quantity and Notes */}
              <div className="mb-4 flex space-x-4 items-start">
                <div>
                  <label className="sr-only">Quantity</label>
                  <select 
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="appearance-none bg-gray-100 px-4 py-2 pr-8 rounded-full"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add a note (e.g., no onions)"
                  className="flex-1 border rounded p-2 h-24 resize-none"
                />
              </div>

              {/* Display added notes */}
              {notes && (
                <div className="mb-4 bg-gray-50 p-2 rounded text-gray-700">
                  <strong>Note:</strong> {notes}
                </div>
              )}

              {/* Actions */}
              <button
                type="button"
                onClick={handleUpdateClick}
                className="w-full bg-black text-white py-3 rounded-md mb-2"
              >
                Update order • LKR {getTotalPrice().toFixed(2)}
              </button>
              <button
                type="button"
                onClick={handleRemoveClick}
                className="w-full text-red-500 py-3"
              >
                Remove from cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default FoodItemModal;