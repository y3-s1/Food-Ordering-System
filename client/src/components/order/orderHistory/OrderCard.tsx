import React from 'react';
import { OrderDTO } from '../../../types/order/order';

interface Props { order: OrderDTO }

export default function OrderCard({ order }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
        <span className="text-sm px-2 py-1 rounded-full bg-gray-100">{order.status}</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Placed: {new Date(order.createdAt).toLocaleString()}
      </p>
      <ul className="space-y-1 mb-2">
        {order.items.map(i => (
          <li key={i.menuItemId} className="flex justify-between">
            <span>{i.name} x{i.quantity}</span>
            <span>LKR {(i.unitPrice * i.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-semibold">
        <span>Total:</span>
        <span>LKR {order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
