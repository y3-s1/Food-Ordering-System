import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../services/order/orderService';
import { OrderDTO } from '../../../types/order/order';
import { StatusBadge } from './StatusBadge';
import { OrderItemList } from './OrderItemList';
import { OrderSummary } from './OrderSummary';
import { AddressDetails } from './AddressDetails';
import { OrderTrackingSection } from '../orderTracking/OrderTrackingSection';

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
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50">
      {/* Tracking Section */}
      {order.status !== 'Delivered' && (
        <OrderTrackingSection />
      )}

      {/* Header with Status Badge */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>
        <StatusBadge status={order.status} />
      </header>

      {/* Items List */}
      <section className="bg-white p-4 rounded-lg shadow">
        {/* <h2 className="text-xl font-semibold mb-4">Items</h2> */}
        <OrderItemList items={order.items} />
      </section>

      {/* Summary and Address side by side on md+ */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <section className="flex-1 bg-white p-4 rounded-lg shadow mb-6 md:mb-0">
          {/* <h2 className="text-xl font-semibold mb-4">Summary</h2> */}
          <OrderSummary
            deliveryFee={order.fees.deliveryFee}
            serviceFee={order.fees.serviceFee}
            tax={order.fees.tax}
            totalPrice={order.totalPrice}
          />
        </section>
        <section className="flex-1 bg-white p-4 rounded-lg shadow">
          {/* <h2 className="text-xl font-semibold mb-4">Delivery Address</h2> */}
          <AddressDetails {...order.deliveryAddress} />
        </section>
      </div>

      {/* Notes */}
      {order.notes && (
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">{order.notes}</p>
        </section>
      )}
    </div>
  );
};
