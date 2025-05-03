import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cancelOrderById, fetchOrderById} from '../../../services/order/orderService';
import { OrderDTO } from '../../../types/order/order';
import { StatusBadge } from './StatusBadge';
import { OrderItemList } from './OrderItemList';
import { OrderSummary } from './OrderSummary';
import { AddressDetails } from './AddressDetails';
import { OrderTrackingSection } from '../orderTracking/OrderTrackingSection';
import { IRestaurant } from '../../../types/restaurant/restaurant';
import { getRestaurantById } from '../../../services/resturent/restaurantService';

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
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

  useEffect(() => {
    if (order?.restaurantId) {
      getRestaurantById(order.restaurantId)
        .then(res => setRestaurant(res))
        .catch(err => console.error('Failed to load restaurant', err));
    }
  }, [order?.restaurantId]);

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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-6">
          {/* Header with Status Badge and Actions */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h1>
              <StatusBadge status={order.status} />
            </div>
            
            {canModify && (
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={handleEdit}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 font-medium"
                >
                  Edit Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center ${actionLoading ? 'opacity-75' : ''}`}
                >
                  {actionLoading ? 'Processing...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </header>

          {order.status !== 'Delivered'
            && order.status !== 'Cancelled'
            && order.status !== 'PaymentFail'
            && <OrderTrackingSection />
          }


          {/* Items List */}
          <OrderItemList restaurant={restaurant} items={order.items} />

          {/* Summary and Address side by side on md+ */}
          <div className="grid md:grid-cols-2 gap-6">
            <OrderSummary
              deliveryFee={order.fees.deliveryFee}
              serviceFee={order.fees.serviceFee}
              tax={order.fees.tax}
              totalPrice={order.totalPrice}
            />
            <AddressDetails {...order.deliveryAddress} />
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Notes</h2>
              <p className="text-gray-700 italic">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
