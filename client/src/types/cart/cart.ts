export interface CartItem {
    _id: string;
    menuItemId: string;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    options?: string;
  }
  
  export interface Cart {
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
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
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
  }
  