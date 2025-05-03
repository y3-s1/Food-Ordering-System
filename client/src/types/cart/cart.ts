export interface CartItem {
    _id: string ;
    restaurantId: string;
    menuItemId: string;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }
  
  export interface Cart {
    _id?: string;
    items: CartItem[];
    subtotal: number;
    promotionCode?: string;
    fees?: {
      deliveryFee: number;
      serviceFee: number;
      tax: number;
    };
    total: number;
    discountAmount: number;
  }
  
  // Draft type returned from /cart/draft
  export interface OrderDraft {
    customerId: string
    customerName: string
    customerPhone: string
    customerEmail: string;
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      name: string,
      imageUrl: string;
      unitPrice: number;
      notes?: string;
    }>;
    promotionCode?: string;
    fees: {
      deliveryFee: number;
      serviceFee: number;
      tax: number;
    };
    totalPrice: number;
    notes: string;
  }
  