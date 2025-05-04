import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon, TruckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string;
  status: 'PendingPayment' | 'Confirmed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  fees: { deliveryFee: number; serviceFee: number; tax: number };
  totalPrice: number;
  deliveryOption: 'Standard' | 'PickUp';
  deliveryAddress: { street: string; city: string; postalCode: string; country: string };
  notes?: string;
  paymentMethod: 'Card' | 'Cash on Delivery';
  createdAt: string;
}

const socket = io('http://localhost:5002');

const RestaurantOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    socket.on('orderUpdated', (updated: Order) => {
      setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
    });
    return () => { socket.off('orderUpdated'); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5002/api/v1/orders/restaurant/6815ac3fc85757b8d207e6c3`);
      const data: Order[] = await res.json();
      setOrders(data);
    } finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, action: 'accept' | 'reject' | 'outForDelivery') => {
    const base = `http://localhost:5002/api/v1/orders/${orderId}`;
  
    const url = action === 'outForDelivery'
      ? `${base}/status`
      : `${base}/${action}`;
  
    const options: RequestInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      ...(action === 'outForDelivery' && { body: JSON.stringify({ status: 'OutForDelivery' }) })
    };
  
    await fetch(url, options);
  };
  

  const toggleExpand = (orderId: string) => {
    setExpandedId(prev => prev === orderId ? null : orderId);
  };

  const renderActions = (order: Order) => {
    if (['PendingPayment', 'Confirmed'].includes(order.status)) {
      return (
        <>
          <button onClick={() => updateStatus(order._id, 'accept')} className="px-3 py-1 rounded-full border border-green-500 text-green-500 hover:bg-green-50 transition">
            <CheckIcon className="inline-block mr-1" size={16}/> Accept
          </button>
          <button onClick={() => updateStatus(order._id, 'reject')} className="px-3 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition">
            <XIcon className="inline-block mr-1" size={16}/> Reject
          </button>
        </>
      );
    }
    if (order.status === 'Preparing') {
      return (
        <button onClick={() => updateStatus(order._id, 'outForDelivery')} className="px-3 py-1 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-50 transition">
          <TruckIcon className="inline-block mr-1" size={16}/> Out For Delivery
        </button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Restaurant Orders</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">ID</th><th className="px-6 py-3">Placed</th>
                <th className="px-6 py-3">Status</th><th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Actions</th><th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className={`${expandedId === o._id ? 'bg-blue-50' : 'hover:bg-gray-50'} border-b transition-colors`}>
                  <td className="px-6 py-4">{o._id}</td>
                  <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs">{o.status}</span></td>
                  <td className="px-6 py-4">${o.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 space-x-2">{renderActions(o)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleExpand(o._id)} className="p-1 rounded-full hover:bg-gray-100 transition">
                      {expandedId === o._id ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {expandedId && (
          <motion.div layout initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }} className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            {orders.filter(o => o._id === expandedId).map(o => (
              <div key={o._id}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Order ID: {o._id}</h2>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                    <ul className="space-y-2">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{it.name} x{it.quantity}</span>
                          <span>${(it.price * it.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Delivery & Fees</h3>
                    <p><strong>Address:</strong> {o.deliveryAddress.street}, {o.deliveryAddress.city}</p>
                    <p><strong>Payment:</strong> {o.paymentMethod}</p>
                    <div className="mt-2 border-t pt-2 text-gray-600">
                      <p>Delivery Fee: ${o.fees.deliveryFee.toFixed(2)}</p>
                      <p>Service Fee: ${o.fees.serviceFee.toFixed(2)}</p>
                      <p>Tax: ${o.fees.tax.toFixed(2)}</p>
                      <p className="font-semibold mt-1">Total: ${o.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  {renderActions(o)}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantOrderList;
