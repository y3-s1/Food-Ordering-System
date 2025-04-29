import React from 'react';
import { OrderItemDTO } from '../../../types/order/order';

interface OrderItemProps {
  item: OrderItemDTO & { imageUrl?: string };
}

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => (
  <div className="flex justify-between border-b py-2">
    <div className="flex items-center">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded mr-4"
        />
      )}
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</p>
      <p className="text-sm text-gray-500">@ ${item.unitPrice.toFixed(2)}</p>
    </div>
  </div>
);
