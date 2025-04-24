import { useState, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/order/orderService';
import type { CreateOrderDTO, OrderItemDTO } from '../../types/order/order';
import { OrderDraft } from '../../types/cart/cart';

export function OrderFormPage() {
  const navigate = useNavigate();
  const { state: draft } = useLocation() as { state: OrderDraft };

  const [form, setForm] = useState<CreateOrderDTO>({
    customerId:   draft?.customerId || '',
    restaurantId: draft?.restaurantId || '',
    items:        draft
      ? draft.items.map(i => ({ menuItemId: i.menuItemId, name: '', quantity: i.quantity, unitPrice: i.unitPrice }))
      : [{ menuItemId: '', name: '', quantity: 1, unitPrice: 0 }],
    deliveryAddress: { street: '', city: '', postalCode: '', country: '' },
    notes:        '',
    promotionCode: draft?.promotionCode || '',
  });

  function updateField<K extends keyof CreateOrderDTO>(
    key: K,
    value: CreateOrderDTO[K]
  ) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function updateItem(idx: number, item: Partial<OrderItemDTO>) {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], ...item };
      return { ...f, items };
    });
  }

  function addItem() {
    setForm(f => ({
      ...f,
      items: [...f.items, { menuItemId: '', name: '', quantity: 1, unitPrice: 0 }],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await placeOrder(form);
      navigate(`/order/confirm/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Place a New Order</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Restaurant & Customer IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={form.customerId}
            onChange={e => updateField('customerId', e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Restaurant ID"
            value={form.restaurantId}
            onChange={e => updateField('restaurantId', e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Items */}
        {form.items.map((item, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Menu Item ID"
              value={item.menuItemId}
              onChange={e => updateItem(i, { menuItemId: e.target.value })}
              className="border rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={item.name}
              onChange={e => updateItem(i, { name: e.target.value })}
              className="border rounded-lg p-2"
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Qty"
              value={item.quantity}
              onChange={e => updateItem(i, { quantity: +e.target.value })}
              className="border rounded-lg p-2"
              required
            />
            <input
              type="number"
              min={0}
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={e => updateItem(i, { unitPrice: +e.target.value })}
              className="border rounded-lg p-2"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another item
        </button>

        {/* Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Street"
            value={form.deliveryAddress.street}
            onChange={e =>
              updateField('deliveryAddress', {
                ...form.deliveryAddress,
                street: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={form.deliveryAddress.city}
            onChange={e =>
              updateField('deliveryAddress', {
                ...form.deliveryAddress,
                city: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={form.deliveryAddress.postalCode}
            onChange={e =>
              updateField('deliveryAddress', {
                ...form.deliveryAddress,
                postalCode: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={form.deliveryAddress.country}
            onChange={e =>
              updateField('deliveryAddress', {
                ...form.deliveryAddress,
                country: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Notes & Promo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => updateField('notes', e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Promo Code (optional)"
            value={form.promotionCode}
            onChange={e => updateField('promotionCode', e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
