import React from 'react';
import OrderCard from './OrderCard';
import { OrderDTO } from '../../../types/order/order';

interface Props {
  title: string;
  orders: OrderDTO[];
}

export default function OrderList({ title, orders }: Props) {
  if (!orders.length) {
    return <p className="text-gray-500">No {title.toLowerCase()}.</p>;
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {orders.map(o => <OrderCard key={o._id} order={o} />)}
    </div>
  );
}
