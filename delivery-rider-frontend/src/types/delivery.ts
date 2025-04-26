export interface Delivery {
    _id: string;
    deliveryAddress: string;
    status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
    estimatedTime: string;
  }
  