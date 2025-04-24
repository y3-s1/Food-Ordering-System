export interface OrderItemDTO {
    menuItemId: string;
    name:       string;
    quantity:   number;
    unitPrice:  number;
  }
  
  export interface CreateOrderDTO {
    customerId:     string;
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
  }
  