import { JSX, useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import {
  CreditCard,
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

const ALL_STATUSES: Status[] = [
  'PendingPayment',
  'Confirmed',
  'Preparing',
  'OutForDelivery',
  'Delivered',
];

const ICON_MAP: Record<Status, JSX.Element> = {
  PendingPayment: <CreditCard className="w-10 h-10" />,
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

  const currentIndex = status
    ? ALL_STATUSES.findIndex(s => s === status)
    : -1;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Track Your Order</h1>

      {/* Desktop view (horizontal stepper) */}
      <div className="hidden md:flex items-center relative mb-8">
        {ALL_STATUSES.map((s, idx) => {
          const done = idx <= currentIndex;
          return (
            <div
              key={s}
              className="relative flex-1 flex flex-col items-center"
            >
              {idx < ALL_STATUSES.length - 1 && (
                <div
                  className={`absolute top-4 right-0 w-full h-1 transform translate-x-1/2 z-0
                    ${idx < currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold z-10
                  ${done ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium z-10
                  ${done ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {s.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div
                className={`mt-2 p-6 border rounded-md flex items-center justify-center z-10
                  ${done ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}
              >
                {ICON_MAP[s]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile view (vertical list) */}
      <div className="flex flex-col space-y-6 md:hidden mb-8">
        {ALL_STATUSES.map((s, idx) => {
          const done = idx <= currentIndex;
          return (
            <div
              key={s}
              className="flex items-center space-x-4"
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold
                  ${done ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <p
                  className={`text-base font-medium ${done ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {s.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
              <div
                className={`p-4 border rounded-md flex items-center justify-center
                  ${done ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}
              >
                {ICON_MAP[s]}
              </div>
            </div>
          );
        })}
      </div>

      {status && (
        <p className="mt-4 text-sm text-gray-600">
          Last updated: {updatedAt} — Current status:{' '}
          <strong>{status}</strong>
        </p>
      )}

    {status === 'OutForDelivery' && orderId && (
      <div className="mr-0 w-39 ml-auto mt-5">
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
