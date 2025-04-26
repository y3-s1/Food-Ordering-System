import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../services/order/orderService';
import { OrderDTO } from '../../../types/order/order';
import { StatusBadge } from './StatusBadge';
import { OrderItemList } from './OrderItemList';
import { OrderSummary } from './OrderSummary';
import { AddressDetails } from './AddressDetails';

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then(res => setOrder(res.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center mt-10">Order not found</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <StatusBadge status={order.status} />
      </header>

      <section>
        <OrderItemList items={order.items} />
      </section>

      <section>
        <OrderSummary
          deliveryFee={order.fees.deliveryFee}
          serviceFee={order.fees.serviceFee}
          tax={order.fees.tax}
          totalPrice={order.totalPrice}
        />
      </section>

      <section>
        <AddressDetails {...order.deliveryAddress} />
      </section>

      {order.notes && (
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
};