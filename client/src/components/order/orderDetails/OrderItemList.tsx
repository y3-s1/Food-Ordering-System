import React from 'react';
import { OrderItem } from './OrderItem';
import { OrderItemDTO } from '../../../types/order/order';
import { IRestaurant } from '../../../types/restaurant/restaurant';

interface OrderItemListProps {
  restaurant: IRestaurant | null;
  items: OrderItemDTO[];
}

export const OrderItemList: React.FC<OrderItemListProps> = ({ restaurant, items }) => (
  <div className="bg-white rounded-xl p-6 shadow-md">
    <div className="flex items-center space-x-4 mb-5">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={restaurant?.imageUrl} 
          alt={restaurant?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{restaurant?.name}</h2>
        <p className="text-gray-600">Restaurant Address: <span className="font-medium">{restaurant?.address}</span></p>
      </div>
    </div>
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
    <div className="space-y-2">
      {items.map(item => (
        <OrderItem key={item.menuItemId} item={item} />
      ))}
    </div>
  </div>
);
