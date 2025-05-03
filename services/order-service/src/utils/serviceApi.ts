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

export const deliveryServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/deliveries/api/deliveries`,
  ...axiosConfig,
});

export const notificationServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/notification/api/v1/notifications`,
  ...axiosConfig,
});

export const restaurantServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/restaurants/api/restaurants`,
  ...axiosConfig,
});

export const userServiceApi = axios.create({
  baseURL: `${apiGatewayBaseUrl}/api/users/api/users`,
  ...axiosConfig,
});
