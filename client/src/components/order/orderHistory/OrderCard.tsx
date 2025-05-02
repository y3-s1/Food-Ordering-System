import { useNavigate } from 'react-router-dom';
import { OrderDTO } from '../../../types/order/order';

interface Props { 
  order: OrderDTO;
  showCompletePayment?: boolean;
}

export default function OrderCard({ order, showCompletePayment }: Props) {
  const navigate = useNavigate();
  const subtotal = order.items.reduce(
    (sum, itm) => sum + itm.unitPrice * itm.quantity,
    0
  );
  const discountAmount = 0;
  const { deliveryFee, serviceFee, tax } = order.fees ?? { deliveryFee: 0, serviceFee: 0, tax: 0 };
  const feesTotal = deliveryFee + serviceFee + tax;
  const total = subtotal - discountAmount + feesTotal;

  return (
    <div
      className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/order/${order._id}`)}
    >
      <div className="flex">
        <img
          src={order.items[0]?.imageUrl || '/placeholder.png'}
          alt="Food"
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">ORDER #{order._id.slice(-6)}</p>
              <button
                className="text-red-500 text-sm mt-1 underline"
                onClick={e => { e.stopPropagation(); navigate(`/order/${order._id}`); }}
              >
                View Details
              </button>
            </div>
            <div className="text-right">
              <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                {order.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-2">
            {order.items.map(item => (
              <p key={item.menuItemId} className="text-sm text-gray-700">
                {item.name} x{item.quantity}
              </p>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-semibold">Total Payment</span>
            <span className="font-semibold text-gray-800">
              LKR {order.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex space-x-2 mt-2">
            {showCompletePayment ? (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm"
                onClick={e => {
                  e.stopPropagation();
                  // navigate(`/payment/${order._id}`);
                  navigate('/checkout', { state: { orderId: order._id, amount: Math.round(total * 100) } });
                }}
              >
                Complete Payment
              </button>
            ) : (
              <>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm">
                  Reorder
                </button>
                <button className="border border-red-600 text-red-600 hover:bg-red-100 px-4 py-1 rounded-lg text-sm">
                  Help
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
