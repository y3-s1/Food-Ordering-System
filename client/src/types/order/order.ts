export interface OrderItemDTO {
  menuItemId: string;
  name:       string;
  imageUrl: string;
  quantity:   number;
  unitPrice:  number;
}

export type DeliveryOption = 'Standard' | 'PickUp';
export type PaymentMethod = 'Card' | 'Cash on Delivery';

export interface CreateOrderDTO {
  customerId:     string;
  customerName:   string;
  customerPhone:  string;
  customerEmail:  string;
  restaurantId:   string;
  items:          OrderItemDTO[];
  deliveryOption: DeliveryOption;
  deliveryAddress: {
    street:     string;
    city:       string;
    postalCode: string;
    country:    string;
  };
  paymentMethod:  PaymentMethod;
  location: {
    lat: number;
    lng: number;
  };
  notes?:         string;
  promotionCode?: string;
  fees: {
    deliveryFee: number;
    serviceFee:  number;
    tax:         number;
  };
  totalPrice:     number;
}

export interface OrderDTO {
  _id:            string;
  customerId:     string;
  restaurantId:   string;
  items:          OrderItemDTO[];
  fees: {
    deliveryFee: number;
    serviceFee:  number;
    tax:         number;
  };
  totalPrice:     number;
  status:         'PendingPayment' | 'Confirmed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  deliveryOption: DeliveryOption;
  paymentMethod:  PaymentMethod;
  deliveryAddress: {
    street:     string;
    city:       string;
    postalCode: string;
    country:    string;
  };
  location: {
    lat: number;
    lng: number;
  };
  notes?:         string;
  promotionCode?: string;
  createdAt:      string;  // ISO
  updatedAt:      string;  // ISO
}
