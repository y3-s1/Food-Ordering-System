import OrderCard from './OrderCard';
import { OrderDTO } from '../../../types/order/order';

interface Props {
  orders: OrderDTO[];
  tabKey: 'Completed' | 'OnProgress' | 'Canceled' | 'PaymentFail';
}

export default function OrderList({ orders, tabKey }: Props) {
  return (
    <div className="space-y-4">
      {orders.map(o => (
        <OrderCard
          key={o._id}
          order={o}
          showCompletePayment={tabKey === 'PaymentFail'}
        />
      ))}
    </div>
  );
}
