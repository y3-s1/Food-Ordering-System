import axios from 'axios';

const apiGatewayBaseUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8081';

// Create a reusable Axios config
const axiosConfig = {
  timeout: 5000, // 5 seconds max wait per request
  headers: {
    'Content-Type': 'application/json',
    'x-internal-service': 'order-service'
  }
};

export const orderServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/deliveries/api/deliveries`,
  ...axiosConfig,
});

export const restaurantServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/restaurants/api/restaurants`,
  ...axiosConfig,
});
