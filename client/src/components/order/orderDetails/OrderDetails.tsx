import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cancelOrderById, fetchOrderById} from '../../../services/order/orderService';
import { OrderDTO } from '../../../types/order/order';
import { StatusBadge } from './StatusBadge';
import { OrderItemList } from './OrderItemList';
import { OrderSummary } from './OrderSummary';
import { AddressDetails } from './AddressDetails';
import { OrderTrackingSection } from '../orderTracking/OrderTrackingSection';

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then(res => setOrder(res.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleEdit = () => {
    if (!order) return;
    navigate(`/order/edit/${order._id}`);
  };

  const handleCancel = async () => {
    if (!orderId) return;
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;
    try {
      setActionLoading(true);
      await cancelOrderById(orderId);
      // refresh order details
      const res = await fetchOrderById(orderId);
      setOrder(res.data);
    } catch {
      alert('Failed to cancel order. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center mt-10">Order not found</p>;

  // Only allow edit/cancel on Payment Pending or Confirmed
  const canModify = order.status === 'PendingPayment' || order.status === 'Confirmed';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50">
      {/* Tracking Section */}
      {order.status !== 'Delivered' && (
        <OrderTrackingSection />
      )}

      {/* Header with Status Badge and Actions */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>
          <StatusBadge status={order.status} />
        </div>
        {canModify && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={handleEdit}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* Items List */}
      <section className="bg-white p-4 rounded-lg shadow">
        <OrderItemList items={order.items} />
      </section>

      {/* Summary and Address side by side on md+ */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <section className="flex-1 bg-white p-4 rounded-lg shadow mb-6 md:mb-0">
          <OrderSummary
            deliveryFee={order.fees.deliveryFee}
            serviceFee={order.fees.serviceFee}
            tax={order.fees.tax}
            totalPrice={order.totalPrice}
          />
        </section>
        <section className="flex-1 bg-white p-4 rounded-lg shadow">
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
