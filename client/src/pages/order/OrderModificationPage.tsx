import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XCircle, CheckCircle } from 'lucide-react';
import { OrderDTO, OrderItemDTO } from '../../types/order/order';
import { fetchOrderById, modifyOrder } from '../../services/order/orderService';

export default function OrderModificationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [items, setItems] = useState<OrderItemDTO[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [address, setAddress] = useState(order?.deliveryAddress || {
    street: '', city: '', postalCode: '', country: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then(res => {
        setOrder(res.data);
        setItems(res.data.items);
        setNotes(res.data.notes || '');
        setAddress(res.data.deliveryAddress);
      })
      .catch(() => setError('Unable to load order.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleQuantityChange = (idx: number, qty: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: qty } : it));
  };

  const handleRemoveItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await modifyOrder(order._id, {
        items: items.map(i => ({ ...i })),
        notes,
        _id: '',
        customerId: '',
        restaurantId: '',
        fees: {
          deliveryFee: 0,
          serviceFee: 0,
          tax: 0
        },
        totalPrice: 0,
        status: 'PendingPayment',
        deliveryAddress: {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        createdAt: '',
        updatedAt: '',
        deliveryOption: 'Standard',
        paymentMethod: 'Card',
        location: {
          lat: 0,
          lng: 0
        }
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

      {/* Items Editor */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.menuItemId} className="flex items-center justify-between">
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

      {/* Delivery Address Editor */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
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
    </div>
  );
}
