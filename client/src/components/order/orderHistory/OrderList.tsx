import React from 'react';
import OrderCard from './OrderCard';
import { OrderDTO } from '../../../types/order/order';

interface Props {
  orders: OrderDTO[];
}

export default function OrderList({ orders }: Props) {
  return (
    <div className="space-y-4">
      {orders.map(o => (
        <OrderCard key={o._id} order={o} />
      ))}
    </div>
  );
}
