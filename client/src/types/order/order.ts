export interface OrderItemDTO {
    menuItemId: string;
    name:       string;
    quantity:   number;
    unitPrice:  number;
  }
  
  export interface CreateOrderDTO {
    customerId: string
    customerName: string
    customerPhone: string
    restaurantId:   string;
    items:          OrderItemDTO[];
    deliveryAddress: {
      street:     string;
      city:       string;
      postalCode: string;
      country:    string;
    };
    notes?:         string;
    promotionCode?: string;
    fees: {
      deliveryFee: number;
      serviceFee: number;
      tax: number;
    };
    totalPrice: number;
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
    status:         'PendingPayment'|'Confirmed'|'Preparing'|'OutForDelivery'|'Delivered'|'Cancelled';
    deliveryAddress: {
      street:     string;
      city:       string;
      postalCode: string;
      country:    string;
    };
    notes?:         string;
    promotionCode?: string;
    createdAt:      string;  // ISO
    updatedAt:      string;
  }
  
  