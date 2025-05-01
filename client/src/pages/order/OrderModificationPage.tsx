import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XCircle, CheckCircle } from 'lucide-react';
import { OrderDTO, OrderItemDTO } from '../../types/order/order';
import { fetchOrderById, modifyOrder } from '../../services/order/orderService';
import { getRestaurantById } from '../../services/resturent/restaurantService';
import { IRestaurant } from '../../types/restaurant/restaurant';
import { MapModal } from '../../components/order/location/MapModal';
export default function OrderModificationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [items, setItems] = useState<OrderItemDTO[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [address, setAddress] = useState(order?.deliveryAddress || {
    street: '', city: '', postalCode: '', country: ''
  });
  // New state for location (latitude, longitude)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
  );
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prompt states
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isPickingOnMap, setIsPickingOnMap] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then(res => {
        const o = res.data;
        setOrder(o);
        setItems(o.items);
        setNotes(o.notes || '');
        setAddress(o.deliveryAddress);
        if (o.location) {
          setLocation(o.location);
        }
      })
      .catch(() => setError('Unable to load order or restaurant details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (order?.restaurantId) {
      getRestaurantById(order.restaurantId)
        .then(res => setRestaurant(res))
        .catch(err => console.error('Failed to load restaurant', err));
    }
  }, [order?.restaurantId]);

  // Handlers for quantity, removal, address unchanged...
  const handleQuantityChange = (idx: number, qty: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: qty } : it));
  };

  const handleRemoveItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  // Show the prompt
  const handleUpdateLocationClick = () => {
    setShowLocationPrompt(true);
  };

  // Use current GPS location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setShowLocationPrompt(false);
      },
      err => {
        console.error('Error getting location', err);
        alert('Unable to retrieve your location.');
      }
    );
  };

  // Start picking on map
  const pickOnMap = () => {
    setIsPickingOnMap(true);
  };

  // Save changes
  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await modifyOrder(order._id, {
        ...order,
        items,
        notes,
        deliveryAddress: address,
        location: location,
      });
      navigate(-1);
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center py-10">Order not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Order #{order._id.slice(-6)}</h1>
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          <XCircle className="w-6 h-6" />
        </button>
      </header>

      {/* Restaurant and Delivery Option (read-only) */}
      <section className="flex items-center bg-white p-4 rounded-lg shadow space-x-4">
        {restaurant?.imageUrl && (
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <p className="text-lg font-semibold">{restaurant?.name || 'Restaurant'}</p>
          <p className="text-sm text-gray-600">Delivery Option: <span className="font-medium">{order.deliveryOption}</span></p>
        </div>
      </section>

      {/* Items Editor */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.menuItemId} className="flex items-center justify-between">
              <img 
                src={item.imageUrl || 'https://via.placeholder.com/48'} 
                alt={item.name} 
                className="w-12 h-12 bg-gray-100 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Unit Price: LKR {item.unitPrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                  className="w-16 text-center border rounded"
                />
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes Editor */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className="w-full border rounded p-2"
          placeholder="Add order notes or instructions..."
        />
      </section>

      {/* Delivery Address Editor & Location */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Delivery Address & Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={address.street}
            onChange={e => handleAddressChange('street', e.target.value)}
            placeholder="Street"
            className="border rounded p-2"
          />
          <input
            value={address.city}
            onChange={e => handleAddressChange('city', e.target.value)}
            placeholder="City"
            className="border rounded p-2"
          />
          <input
            value={address.postalCode}
            onChange={e => handleAddressChange('postalCode', e.target.value)}
            placeholder="Postal Code"
            className="border rounded p-2"
          />
          <input
            value={address.country}
            onChange={e => handleAddressChange('country', e.target.value)}
            placeholder="Country"
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleUpdateLocationClick}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Update Location
        </button>
        {location && (
          <p className="text-sm text-gray-600">Current coordinates: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
        )}
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          disabled={saving}
        >
          <CheckCircle className="w-5 h-5 mr-2" /> Save Changes
        </button>
      </div>

      {/* Location Prompt Popup */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              We need your delivery location
            </h3>
            <div className="space-y-4">
              <button
                className="w-full py-2 bg-blue-600 text-white rounded"
                onClick={useCurrentLocation}
              >
                Use current location
              </button>
              <button
                className="w-full py-2 border rounded"
                onClick={pickOnMap}
              >
                Pick on map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Picker Modal */}
      <MapModal
        isOpen={isPickingOnMap}
        position={location || { lat: 0, lng: 0 }}
        onChange={pos => setLocation(pos)}
        onClose={() => {
          setIsPickingOnMap(false);
          setShowLocationPrompt(false);
        }}
      />
    </div>
  );
}
