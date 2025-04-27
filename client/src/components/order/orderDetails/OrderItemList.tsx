import React from 'react';
import { OrderItem } from './OrderItem';
import { OrderItemDTO } from '../../../types/order/order';

interface OrderItemListProps {
  items: OrderItemDTO[];
}

export const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
    <h2 className="text-lg font-semibold mb-4">Items</h2>
    {items.map(item => (
      <OrderItem key={item.menuItemId} item={item} />
    ))}
  </div>
);
