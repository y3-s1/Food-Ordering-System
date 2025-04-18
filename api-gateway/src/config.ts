export const SERVICE_URLS = {
    delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:5003',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:5002',
    restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:5001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:5004'
  };
  