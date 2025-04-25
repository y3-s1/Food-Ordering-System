import { useState, useEffect } from 'react';

interface Delivery {
  _id: string;
  deliveryAddress: string;
  status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  estimatedTime: string;
}

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    // Mock data for now
    setDeliveries([
      {
        _id: 'd001',
        deliveryAddress: '123 Main Street, Colombo',
        status: 'ASSIGNED',
        estimatedTime: '2025-04-25T15:00:00Z',
      },
      {
        _id: 'd002',
        deliveryAddress: '456 Galle Road, Moratuwa',
        status: 'OUT_FOR_DELIVERY',
        estimatedTime: '2025-04-25T16:30:00Z',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🚚 Delivery Dashboard
      </h1>

      <div className="grid gap-4">
        {deliveries.map((delivery) => (
          <div
            key={delivery._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-blue-700">
                Delivery ID: {delivery._id}
              </h2>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  delivery.status === 'DELIVERED'
                    ? 'bg-green-200 text-green-800'
                    : delivery.status === 'OUT_FOR_DELIVERY'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {delivery.status}
              </span>
            </div>
            <p className="text-gray-600">📍 {delivery.deliveryAddress}</p>
            <p className="text-gray-500 mt-1 text-sm">
              ETA: {new Date(delivery.estimatedTime).toLocaleTimeString()}
            </p>
            <div className="mt-3 flex gap-2">
              {delivery.status !== 'DELIVERED' && (
                <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
                  Mark Delivered
                </button>
              )}
              {delivery.status === 'ASSIGNED' && (
                <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition">
                  Start Delivery
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
