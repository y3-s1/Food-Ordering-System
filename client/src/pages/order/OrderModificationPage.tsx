import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Plus, Trash2, Minus, ArrowLeft } from 'lucide-react';
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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
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
    if (!location) {
      setError('Please select a location.');
      return;
    }
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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Edit Order #{order._id.slice(-6)}</h1>
            </div>
            <div className="text-sm text-gray-500">
              Status: <span className="font-medium text-blue-600">Confirmed</span>
            </div>
          </header>
          
          {/* Restaurant Info */}
          {/* <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={restaurant?.imageUrl} 
                  alt={restaurant?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{restaurant?.name}</h2>
                <p className="text-gray-600">Delivery Option: <span className="font-medium">{order.deliveryOption}</span></p>
              </div>
            </div>
          </section> */}
          
          {/* Items Editor */}
          <section className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-4 mb-5">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={restaurant?.imageUrl} 
                  alt={restaurant?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{restaurant?.name}</h2>
                <p className="text-gray-600">Delivery Option: <span className="font-medium">{order.deliveryOption}</span></p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Items</h2>
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div 
                  key={item.menuItemId} 
                  className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Unit Price: LKR {item.unitPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mr-4">
                      <button 
                        onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Notes Editor */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Add special instructions or notes for your order..."
            />
          </section>
          
          {/* Delivery Address & Location */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Delivery Address & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium mb-1">Delivery Location</h3>
                  {location ? (
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="inline w-4 h-4 mr-1" /> 
                      Coordinates: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-sm text-red-500">No location set</p>
                  )}
                </div>
                
                <button
                  onClick={handleUpdateLocationClick}
                  className="mt-3 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Location
                </button>
              </div>
            </div>
          </section>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center disabled:opacity-70"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> 
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Update Your Delivery Location
            </h3>
            <div className="space-y-4">
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                onClick={useCurrentLocation}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Use Current Location
              </button>
              <button
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                onClick={pickOnMap}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Select on Map
              </button>
              <button
                className="w-full py-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowLocationPrompt(false)}
              >
                Cancel
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
