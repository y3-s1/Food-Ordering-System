import React, { useState } from 'react';
import QuantityControl from './QuantityControl';
import { CartItem } from '../../types/cart/cart';
import FoodItemModal from './FoodItemModel';

interface Props {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onUpdateItem?: (updatedItem: CartItem) => void;
}

const CartItemComponent: React.FC<Props> = ({ 
  item, 
  onUpdateQty, 
  onRemove,
  onUpdateItem = (updatedItem) => onUpdateQty(updatedItem._id, updatedItem.quantity)
}) => {
  const { _id, name, imageUrl, quantity, unitPrice, options } = item;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="flex py-4 border-b cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={imageUrl || 'https://th.bing.com/th/id/OIP.3f4uw03GjHN2wa2tSeNc4wHaIu?rs=1&pid=ImgDetMain'} 
          alt={name} 
          className="w-16 h-16 rounded object-cover mr-4" 
        />
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          {options && <p className="text-sm text-gray-500">{options}</p>}
          <p className="mt-1">LKR {unitPrice.toFixed(2)}</p>
          <div className="mt-2 flex items-center justify-between">
            <QuantityControl
              quantity={quantity}
              onIncrement={() => onUpdateQty(_id, quantity + 1)}
              onDecrement={() => onUpdateQty(_id, quantity - 1)}
            />
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening modal when clicking remove
                onRemove(_id);
              }} 
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Food Item Modal */}
      {isModalOpen && (
        <FoodItemModal
          item={item}
          onClose={setIsModalOpen(false)}
          onUpdate={onUpdateItem}
          onRemove={onRemove}
        />
      )}
    </>
  );
};

export default CartItemComponent;