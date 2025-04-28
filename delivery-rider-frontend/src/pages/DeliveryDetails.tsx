import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deliveryApi } from '../api/axiosInstances'; // Assuming you have axiosInstances
import { orderApi, restaurantApi } from '../api/axiosInstances';
import { Delivery } from '../types/delivery';
import { IOrder } from '../types/order';
import { IRestaurant } from '../types/restaurant';

const DeliveryDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Delivery
        const deliveryRes = await deliveryApi.get(`/${id}`);
        setDelivery(deliveryRes.data);

        // 2. Fetch Order
        const orderRes = await orderApi.get(`/${deliveryRes.data.orderId}`);
        setOrder(orderRes.data);

        // 3. Fetch Restaurant
        const restaurantRes = await restaurantApi.get(`/${orderRes.data.restaurantId}`);
        setRestaurant(restaurantRes.data);

      } catch (error) {
        console.error('Error fetching delivery details', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!delivery || !order || !restaurant) {
    return <div className="text-center mt-10 text-red-600">Failed to load delivery details.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        🚚 Delivery Details
      </h1>

      {/* Delivery Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">📦 Delivery Information</h2>
        <p><b>Delivery Address:</b> {delivery.deliveryAddress}</p>
        <p><b>Status:</b> {delivery.status}</p>
        <p><b>Created At:</b> {new Date(delivery.createdAt).toLocaleString()}</p>
        {delivery.estimatedTime && <p><b>Estimated Time:</b> {new Date(delivery.estimatedTime).toLocaleString()}</p>}
        {delivery.completedAt && <p><b>Completed At:</b> {new Date(delivery.completedAt).toLocaleString()}</p>}
      </div>

      {/* Order Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">🛒 Order Information</h2>
        <p><b>Total Price:</b> ${order.totalPrice.toFixed(2)}</p>
        <p><b>Delivery Address:</b> {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
        <p><b>Status:</b> {order.status}</p>

        <h3 className="font-semibold text-gray-700 mt-4 mb-2">Items:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} - {item.quantity} pcs
            </li>
          ))}
        </ul>
      </div>

      {/* Restaurant Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">🍔 Restaurant Information</h2>
        <p><b>Name:</b> {restaurant.name}</p>
        <p><b>Address:</b> {restaurant.address}</p>
        <p><b>Contact:</b> {restaurant.contactNumber}</p>
        <p><b>Email:</b> {restaurant.email}</p>
        <p><b>Status:</b> {restaurant.approvalStatus}</p>
      </div>
    </div>
  );
};

export default DeliveryDetails;
