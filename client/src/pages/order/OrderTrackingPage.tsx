import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderStatus } from '../../services/order/orderService';

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

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    if (!orderId) return;
    fetchOrderStatus(orderId)
      .then(res => {
        setStatus(res.data.status);
        setUpdatedAt(new Date(res.data.updatedAt).toLocaleString());
      })
      .catch(console.error);
    // optionally poll every 15s...
  }, [orderId]);

  const currentIndex = status
    ? ALL_STATUSES.findIndex(s => s === status)
    : -1;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Track Your Order</h1>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        {ALL_STATUSES.map((s, idx) => (
          <div key={s} className="flex items-center md:flex-col mb-4 md:mb-0">
            {/* circle */}
            <div
              className={`w-8 h-8 rounded-full border-2 ${
                idx <= currentIndex
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300'
              } flex items-center justify-center font-bold`}
            >
              {idx + 1}
            </div>
            {/* label */}
            <span
              className={`ml-2 md:ml-0 md:mt-2 ${
                idx <= currentIndex ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {s}
            </span>
            {/* connector */}
            {idx < ALL_STATUSES.length - 1 && (
              <div
                className={`flex-1 h-1 md:w-8 md:h-0.5 ${
                  idx < currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                } mx-2 md:mx-0 md:my-2`}
              />
            )}
          </div>
        ))}
      </div>
      {status && (
        <p className="mt-4 text-sm text-gray-600">
          Last updated: {updatedAt} — Current status: <strong>{status}</strong>
        </p>
      )}
    </div>
  );
}
