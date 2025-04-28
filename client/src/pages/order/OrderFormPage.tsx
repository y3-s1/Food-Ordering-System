import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/order/orderService';
import type { CreateOrderDTO, DeliveryOption, OrderItemDTO, PaymentMethod } from '../../types/order/order';
import { OrderDraft } from '../../types/cart/cart';
import { getRestaurantById } from '../../services/resturent/restaurantService';
import { useAuth } from '../../auth/AuthContext';

interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  email: string;
  cuisineType: string[];
  openingHours: string;
  isAvailable: boolean;
  imageUrl: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export function OrderFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state: draft } = useLocation() as { state: OrderDraft };
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState<'Standard' | 'PickUp'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "Cash on Delivery">("Card");
  const [form, setForm] = useState<CreateOrderDTO>({
    customerId:     draft?.customerId     || '',
    customerName:   draft?.customerName   || '',
    customerPhone:  draft?.customerPhone  || '',
    customerEmail:  draft?.customerEmail  || user?.email || '',
    restaurantId:   draft?.restaurantId   || '',
    items:          draft
      ? draft.items.map(i => ({
          menuItemId: i.menuItemId,
          name:       i.name,
          imageUrl:   i.imageUrl,
          quantity:   i.quantity,
          unitPrice:  i.unitPrice,
        }))
      : [{ menuItemId: '', name: '', quantity: 1, unitPrice: 0 }],
    deliveryOption: 'Standard',
    deliveryAddress: {
      street:      '',
      city:        '',
      postalCode:  '',
      country:     '',
    },
    paymentMethod: 'Card',
    location:      { lat: 0, lng: 0 },
    notes:          draft?.notes          || '',
    promotionCode:  draft?.promotionCode  || '',
    fees: {
      deliveryFee: draft?.fees.deliveryFee || 0,
      serviceFee:  draft?.fees.serviceFee  || 0,
      tax:         draft?.fees.tax         || 0,
    },
    totalPrice:     draft?.totalPrice     || 0,
  });
  

  // Fetch restaurant details when restaurantId is available
  useEffect(() => {
    if (form.restaurantId) {
      getRestaurantById(form.restaurantId)
        .then(res => setRestaurant(res))
        .catch(err => console.error('Failed to load restaurant', err));
    }
  }, [form.restaurantId]);

  useEffect(() => {
    console.log('restaurant', restaurant)
  }, [restaurant]);

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        customerId: user._id,
        customerName: user.name,
        customerPhone: (user as any).phoneNumber || f.customerPhone,
        customerEmail: user.email
      }));
    }
  }, [user]);


  const subtotal = form.items.reduce(
    (sum, itm) => sum + itm.unitPrice * itm.quantity,
    0
  );
  const discountAmount = 0;
  const { deliveryFee, serviceFee, tax } = form.fees ?? { deliveryFee: 0, serviceFee: 0, tax: 0 };
  const feesTotal = deliveryFee + serviceFee + tax;
  const total = subtotal - discountAmount + feesTotal;

  function updateField<K extends keyof CreateOrderDTO>(key: K, value: CreateOrderDTO[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleDeliveryChange(opt: DeliveryOption) {
    setDeliveryOption(opt);
    updateField('deliveryOption', opt);
  }

  function handlePaymentChange(opt: PaymentMethod) {
    setPaymentMethod(opt);
    updateField('paymentMethod', opt);
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
      items: [...f.items, { menuItemId: '', name: '', quantity: 1, unitPrice: 0 }]
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    // 1) place the order in your backend
    const res = await placeOrder(form);
    const orderId = res.data._id;

    if (form.paymentMethod === 'Card') {
      // 2a) for card, go to checkout and pass the amount (in cents/paise if needed)
      navigate('/checkout', {
        state: {
          orderId,
          amount: Math.round(total * 100), 
        }
      });
    } else {
      // 2b) for COD, go directly to confirmation
      navigate(`/order/confirm/${orderId}`);
    }
  }


  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Customer Details Card */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Customer details</h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {/* person icon */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.31.57 6.121 1.804M15 11a3 3 0 11-6 0
                    3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                value={form.customerName}
                onChange={e => updateField('customerName', e.target.value)}
                className="flex-1 border rounded-lg p-2 w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* envelope / email icon */}
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12l-4-4-4 4m0 0l4 4 4-4"
              />
            </svg>
            <input
              type="email"
              placeholder="Email address"
              value={form.customerEmail}
              onChange={e => updateField('customerEmail', e.target.value)}
              className="flex-1 border rounded-lg p-2 w-full"
              required
            />
          </div>
          </div>
        </section>

        {/* Delivery Details Card */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Delivery details</h2>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
              <div>
                <p className="font-medium">{form.deliveryAddress.street || 'Select address'}</p>
                <p className="text-sm text-gray-500">{form.deliveryAddress.city}</p>
              </div>
            </div>
            <button className="text-blue-600 hover:underline">Edit</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <p className="text-gray-700">{form.notes || 'Add delivery instructions'}</p>
            </div>
            <button className="text-blue-600 hover:underline">Edit</button>
          </div>
        </section>

        {/* Delivery Options Card */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Delivery options</h2>
          <div className="space-y-3">
            {([ 'Standard', 'PickUp'] as const).map(opt => {
              const isSelected = deliveryOption === opt;
              return (
                <label
                  key={opt}
                  className={`
                    flex items-center p-4 rounded-lg cursor-pointer 
                    border ${isSelected ? 'border-black' : 'border-gray-200'}
                    hover:shadow
                  `}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleDeliveryChange(opt)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{opt}</p>
                      {/* {opt === 'Priority' && (
                        <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                          Faster
                        </span>
                      )} */}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {/* {opt === 'Priority' && '10-25 min · Delivered directly to you'} */}
                      {opt === 'Standard' && '15-30 min'}
                      {/* {opt === 'Schedule' && 'Choose a time'} */}
                    </p>
                  </div>
                  {/* {opt !== 'Schedule' && (
                    <span className="text-gray-700">
                      +LKR {opt === 'Priority' ? 129 : 0}
                    </span>
                  )} */}
                </label>
              );
            })}
          </div>
        </section>


        {/* Payment Card */}
        <section className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <div className="space-y-3">
        {(["Card", "Cash on Delivery"] as const).map((opt) => {
          const isSelected = paymentMethod === opt;
          return (
            <label
              key={opt}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer
                border ${isSelected ? "border-black" : "border-gray-200"}
                hover:shadow
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt}
                checked={isSelected}
                onChange={() => handlePaymentChange(opt)}
                className="mr-3"
              />
              <div className="flex-1 flex items-center space-x-2">
                {/* Icon */}
                {opt === "Card" ? (
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div>
                  <p className="font-medium">{opt}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {opt === "Card" && "Visa, MasterCard, AMEX"}
                    {opt === "Cash on Delivery" && "Pay when you receive order"}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>

        {/* Continue Button */}
        <button 
          onClick={onSubmit}
          className="hidden lg:block w-full bg-black text-white rounded-lg py-3 text-center font-medium hover:bg-gray-800"
        >
          Continue to payment
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        {/* Restaurant & Promo Card */}
        <section className="bg-white rounded-2xl p-6 shadow space-y-4">
          {restaurant ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={restaurant.imageUrl || '/restaurant-logo.png'}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-sm text-gray-500">{restaurant.address}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">›</button>
            </div>
          ) : (
            <p>Loading restaurant information…</p>
          )}
          <button
            onClick={onSubmit}
            className="hidden lg:block w-full bg-black text-white rounded-lg py-3 text-center font-medium hover:bg-gray-800"
          >
            Continue to payment
          </button>
        </section>

        {/* Cart Summary & Promotion & Total */}
        {/* Cart Summary & Promotion & Total */}
        <section className="bg-white rounded-2xl p-6 shadow space-y-4">
          {/* Cart Summary (collapsible) */}
          <div>
            <button
              type="button"
              onClick={() => setIsCartOpen(o => !o)}
              className="w-full flex items-center justify-between"
            >
              <span className="font-medium">
                Cart summary ({form.items.length} {form.items.length === 1 ? 'item' : 'items'})
              </span>
              <svg
                className={
                  "w-5 h-5 text-gray-500 transform transition-transform " +
                  (isCartOpen ? "rotate-180" : "rotate-0")
                }
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* item list */}
            {isCartOpen && (
              <ul className="mt-4 space-y-4">
                {form.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      {/* if you have thumbnails, swap this div for an <img> */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                          src={item.imageUrl || 'https://th.bing.com/th/id/OIP.3f4uw03GjHN2wa2tSeNc4wHaIu?rs=1&pid=ImgDetMain'} 
                          alt={item.name} 
                          className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name || "Unnamed item"}</p>
                        {/* optional subtitle */}
                        {/* <p className="text-sm text-gray-500">Choice of Size: Medium</p> */}
                        <p className="text-sm text-gray-500">
                          LKR {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <span className="ml-4 bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-sm">
                      {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Promotion Code */}
          {/* <div>
            <button className="w-full flex items-center justify-between">
              <span className="font-medium">Add promo code</span>
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div> */}

          {/* Order Total */}
          <div className="space-y-2 text-lg font-medium">
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">- LKR {discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Fees</span>
              <span>LKR {feesTotal.toFixed(2)}</span>
            </div>

            {/* breakdown */}
            <div className="ml-4 space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>LKR {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service</span>
                <span>LKR {serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>LKR {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>LKR {total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-left text-xs text-gray-500">
            If you’re not around when the delivery person arrives, they’ll leave your order at the door.
            By placing your order, you agree to take full responsibility for it once it’s delivered.
            Orders containing alcohol or other restricted items may not be eligible for leave at door and will be returned to the store if you are not available.
          </p>
        </section>
        {/* MOBILE-ONLY sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-t lg:hidden">
        <button
          onClick={onSubmit}
          className="w-full bg-black text-white rounded-lg py-3 text-center font-medium hover:bg-gray-800"
        >
          Continue to payment
        </button>
      </div>

      </div>
    </div>
  );
}
