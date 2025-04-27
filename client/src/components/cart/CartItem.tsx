import React from 'react';
import QuantityControl from './QuantityControl';
import { CartItem } from '../../types/cart/cart';

interface Props {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<Props> = ({ item, onUpdateQty, onRemove }) => {
  const { _id, name, imageUrl, quantity, unitPrice, options } = item;
  return (
    <div className="flex py-4 border-b">
      <img src='https://th.bing.com/th/id/OIP.3f4uw03GjHN2wa2tSeNc4wHaIu?rs=1&pid=ImgDetMain' alt={name} className="w-16 h-16 rounded object-cover mr-4" />
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
          <button onClick={() => onRemove(_id)} className="text-red-500">Remove</button>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;