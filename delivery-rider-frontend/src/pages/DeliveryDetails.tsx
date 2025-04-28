import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deliveryApi, orderApi, restaurantApi } from '../api/axiosInstances';
import { Delivery } from '../types/delivery';
import { IOrder } from '../types/order';
import { IRestaurant } from '../types/restaurant';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const DeliveryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deliveryRes = await deliveryApi.get(`/${id}`);
        setDelivery(deliveryRes.data);

        const orderRes = await orderApi.get(`/${deliveryRes.data.orderId}`);
        setOrder(orderRes.data);

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
    <div className="min-h-screen bg-gray-100 animate-fadeIn">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white p-4 shadow z-50 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowBackIosNewIcon />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Delivery Details</h1>
      </div>

      {/* Restaurant Banner */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl || 'https://via.placeholder.com/800x300.png?text=Restaurant'}
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-6">

        {/* Delivery Info Card */}
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">📦 Delivery Information</h2>
          <p><b>Address:</b> {delivery.deliveryAddress}</p>
          <p><b>Status:</b> <span className={`px-2 py-1 rounded text-white ${delivery.status === 'DELIVERED' ? 'bg-green-500' : delivery.status === 'OUT_FOR_DELIVERY' ? 'bg-yellow-500' : 'bg-gray-400'}`}>{delivery.status}</span></p>
          <p><b>Created:</b> {new Date(delivery.createdAt).toLocaleString()}</p>
          {delivery.estimatedTime && <p><b>ETA:</b> {new Date(delivery.estimatedTime).toLocaleTimeString()}</p>}
          {delivery.completedAt && <p><b>Completed:</b> {new Date(delivery.completedAt).toLocaleString()}</p>}
        </div>

        {/* Order Info Card */}
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-green-700 mb-2">🛒 Order Information</h2>
          <p><b>Total Price:</b> ${order.totalPrice.toFixed(2)}</p>
          <p><b>Status:</b> {order.status}</p>

          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Items Ordered:</h3>
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.quantity} pcs</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-red-700 mb-2">🍔 Restaurant Information</h2>
          <p><b>Name:</b> {restaurant.name}</p>
          <p><b>Address:</b> {restaurant.address}</p>
          <p><b>Contact:</b> {restaurant.contactNumber}</p>
          <p><b>Email:</b> {restaurant.email}</p>
          <p><b>Status:</b> <span className={`${restaurant.approvalStatus === 'approved' ? 'text-green-600' : restaurant.approvalStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{restaurant.approvalStatus}</span></p>
        </div>

      </div>
    </div>
  );
};

export default DeliveryDetails;
