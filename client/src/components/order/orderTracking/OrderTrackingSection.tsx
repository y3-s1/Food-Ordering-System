import { JSX, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Coffee,
  Truck,
  Home,
  X,
} from 'lucide-react';
import { fetchOrderStatus } from '../../../services/order/orderService';

type Status =
  | 'PendingPayment'
  | 'Confirmed'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

const ICON_MAP: Record<Status, JSX.Element> = {
  PendingPayment: <CheckCircle className="w-10 h-10" />,
  Confirmed: <CheckCircle className="w-10 h-10" />,
  Preparing: <Coffee className="w-10 h-10" />,
  OutForDelivery: <Truck className="w-10 h-10" />,
  Delivered: <Home className="w-10 h-10" />,
  Cancelled: <X className="w-10 h-10" />,
};

export function OrderTrackingSection() {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    fetchOrderStatus(orderId)
      .then(res => {
        setStatus(res.data.status as Status);
        setUpdatedAt(new Date(res.data.updatedAt).toLocaleString());
      })
      .catch(console.error);
  }, [orderId]);

  // Define steps without PendingPayment
  const steps = status
    ? [
        {
          title: 'Order Confirmed',
          description: 'Your order has been received',
          completed: ['Confirmed', 'Preparing', 'OutForDelivery', 'Delivered'].includes(status),
          current: status === 'Confirmed',
          icon: ICON_MAP.Confirmed,
        },
        {
          title: 'Preparing',
          description: 'Your order is being prepared',
          completed: ['Preparing', 'OutForDelivery', 'Delivered'].includes(status),
          current: status === 'Preparing',
          icon: ICON_MAP.Preparing,
        },
        {
          title: 'Out for Delivery',
          description: 'Your order is on the way',
          completed: ['OutForDelivery', 'Delivered'].includes(status),
          current: status === 'OutForDelivery',
          icon: ICON_MAP.OutForDelivery,
        },
        {
          title: 'Delivered',
          description: 'Your order has been delivered',
          completed: ['Delivered'].includes(status),
          current: status === 'Delivered',
          icon: ICON_MAP.Delivered,
        },
      ]
    : [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Track Your Order</h1>

      {/* Desktop view (horizontal stepper) */}
      <div className="hidden md:flex items-center relative mb-8">
        {steps.map((step, idx) => (
          <div key={step.title} className="relative flex-1 flex flex-col items-center">
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-4 right-0 w-full h-1 transform translate-x-1/2 z-0 ${
                  step.completed ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold z-10 ${
                step.completed
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-sm font-medium z-10 ${
                step.completed ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
            <p className={`text-xs ${step.completed ? 'text-black-600' : 'text-gray-500'}`}>
              {step.description}
            </p>
            <div
              className={`mt-2 p-6 border rounded-md flex items-center justify-center z-10 ${
                step.completed ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'
              }`}
            >
              {step.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view (vertical list) */}
      <div className="flex flex-col space-y-6 md:hidden mb-8">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                step.completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${step.completed ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title}
              </p>
              <p className={`text-xs ${step.completed ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.description}
              </p>
            </div>
            <div
              className={`p-4 border rounded-md flex items-center justify-center ${
                step.completed ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'
              }`}
            >
              {step.icon}
            </div>
          </div>
        ))}
      </div>

      {status && (
        <p className="mt-4 text-sm text-gray-600">
          Last updated: {updatedAt} — Current status: <strong>{status}</strong>
        </p>
      )}

      {status === 'OutForDelivery' && orderId && (
        <div className="w-39 ml-auto mt-5">
          <button
            onClick={() => navigate(`/order/track/${orderId}`)}
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Live Tracking
          </button>
        </div>
      )}
    </div>
  );
}
