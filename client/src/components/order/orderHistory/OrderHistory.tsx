import React, { useEffect, useState } from 'react';
import { OrderDTO } from '../../../types/order/order';
import { fetchOrders } from '../../../services/order/orderService';
import OrderList from './OrderList';
import { useAuth } from '../../../auth/AuthContext';

type TabKey = 'Completed' | 'OnProgress' | 'Canceled';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabKey>('OnProgress');
  const userId = user?._id

  useEffect(() => {
    fetchOrders(userId).then(setOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'Completed') return order.status === 'Delivered';
    if (selectedTab === 'OnProgress')
      return ['PendingPayment', 'Confirmed', 'Preparing', 'OutForDelivery'].includes(order.status);
    if (selectedTab === 'Canceled') return order.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="md:flex md:space-x-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-1/4">
          <div className="sticky top-6 bg-white rounded-lg shadow-sm p-4 space-y-4">
            <SidebarButton
              label="Completed"
              active={selectedTab === 'Completed'}
              onClick={() => setSelectedTab('Completed')}
            />
            <SidebarButton
              label="On Progress"
              active={selectedTab === 'OnProgress'}
              onClick={() => setSelectedTab('OnProgress')}
            />
            <SidebarButton
              label="Canceled"
              active={selectedTab === 'Canceled'}
              onClick={() => setSelectedTab('Canceled')}
            />
          </div>
        </aside>

        {/* Main area */}
        <main className="w-full md:w-3/4">
          {/* Mobile tabs */}
          <div className="sticky top-0 z-20 bg-white flex md:hidden overflow-x-auto space-x-2 py-2 px-6">
            {(['Completed', 'OnProgress', 'Canceled'] as TabKey[]).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-none px-4 py-2 rounded-lg whitespace-nowrap text-sm ${
                  selectedTab === tab
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'OnProgress' ? 'On Progress' : tab}
              </button>
            ))}
          </div>

          <OrderList orders={filteredOrders} />
        </main>
      </div>
    </div>
  );
}

interface SidebarButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}
function SidebarButton({ label, active, onClick }: SidebarButtonProps) {
  // pick icon based on label
  const icon =
    label === 'Completed' ? '✔️' : label === 'On Progress' ? '⏳' : '❌';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left text-sm
        ${active ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      <span className={active ? '' : 'opacity-75'}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
