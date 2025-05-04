import React from 'react';
import { OrderItemDTO } from '../../../types/order/order';

interface OrderItemProps {
  item: OrderItemDTO & { imageUrl?: string };
}

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-3">
    <div className="flex items-center">
      {item.imageUrl && (
        <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium text-gray-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
      <p className="text-xs text-gray-500">@ ${item.unitPrice.toFixed(2)}</p>
    </div>
  </div>
);
