export interface Delivery {
  _id: string;
  orderId: string;
  driverId: string | null;
  deliveryAddress: string;
  status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  location: {
    lat: number;
    lng: number;
  };
  estimatedTime: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
