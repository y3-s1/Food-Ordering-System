import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/order/orderService';
import { OrderDTO } from '../../types/order/order';
import OrderList from '../../components/order/orderHistory/OrderList';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const ongoing = orders.filter(o =>
    ['PendingPayment','Confirmed','Preparing','OutForDelivery'].includes(o.status)
  );
  const completed = orders.filter(o =>
    ['Delivered','Cancelled'].includes(o.status)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <OrderList title="Ongoing Orders" orders={ongoing} />
      <hr className="border-gray-200" />
      <OrderList title="Completed Orders" orders={completed} />
    </div>
  );
}
