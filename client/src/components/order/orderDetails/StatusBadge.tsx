import React from 'react';

export type OrderStatus =
    'PaymentFail'
  | 'PendingPayment'
  | 'Confirmed'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  PendingPayment: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-indigo-100 text-indigo-800',
  OutForDelivery: 'bg-orange-100 text-orange-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  PaymentFail:  'bg-gray-100 text-gray-800',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[status]}`}
  >
    {status.replace(/([A-Z])/g, ' $1').trim()}
  </span>
);
