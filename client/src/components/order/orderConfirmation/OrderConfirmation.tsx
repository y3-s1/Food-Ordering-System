import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GiPartyPopper } from 'react-icons/gi';
import { OrderDTO } from '../../../types/order/order';
import { fetchOrderById } from '../../../services/order/orderService';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then(res => setOrder(res.data))
      .catch(() => setError('Unable to load confirmation'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleGoToOrders = () => {
    navigate(`/orders`);
  };

  const handleTrack = () => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !order) return <p className="text-center mt-10 text-red-500">{error || 'Order not found'}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {/* {order.customerName}, Your order has been successful */}
        Your order has been successful
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Check your order status in{' '}
        <button
          onClick={handleGoToOrders}
          className="inline font-semibold text-black underline"
        >
          My Orders
        </button>{' '}
        for next steps information.
      </p>

      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-8">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <GiPartyPopper className="w-16 h-16 text-black" />
          <h2 className="text-xl font-semibold text-center">Preparing your order</h2>
          <p className="text-center text-gray-500">
            Your order will be prepared and will come soon
          </p>
        </div>

        <button
          onClick={handleTrack}
          className="w-full py-3 rounded-md font-medium text-white bg-black hover:bg-gray-800 transition"
        >
          Track My Order
        </button>
      </div>
    </div>
  );
};