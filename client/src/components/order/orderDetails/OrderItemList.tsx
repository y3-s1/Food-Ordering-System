import React from 'react';
import { OrderItem } from './OrderItem';
import { OrderItemDTO } from '../../../types/order/order';

interface OrderItemListProps {
  items: OrderItemDTO[];
}

export const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => (
  <div className="bg-white rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
    <div className="space-y-2">
      {items.map(item => (
        <OrderItem key={item.menuItemId} item={item} />
      ))}
    </div>
  </div>
);
