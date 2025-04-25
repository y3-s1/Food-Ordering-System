import { useEffect, useState } from 'react';
import { Delivery } from '../types/delivery';
import { getDeliveriesByDriver } from '../api/delivery';

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const driverId = '6604e71234567890abcdefa4'; // Temp

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDeliveriesByDriver(driverId);
        setDeliveries(data);
      } catch (error) {
        console.error('Failed to fetch deliveries', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading deliveries...</p>;
  }

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
