export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  customerId: string;
  restaurantId: string;
  items: IOrderItem[];
  fees: {
    deliveryFee: number;
    serviceFee: number;
    tax: number;
  };
  totalPrice: number;
  status: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  notes?: string;
  promotionCode?: string;
  createdAt: string;
  updatedAt: string;
}
