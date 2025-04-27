export const SERVICE_URLS = {
    delivery: process.env.DELIVERY_SERVICE_URL || 'http://delivery-service:5003',
    order: process.env.ORDER_SERVICE_URL || 'http://order-service:5002',
    cart: process.env.CART_SERVICE_URL || 'http://cart-service:5005',
    restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:5001',
    user: process.env.USER_SERVICE_URL || 'http://user-service:5004'
  };
  