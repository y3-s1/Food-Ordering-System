import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Delivery Service Axios
export const deliveryApi = axios.create({
  baseURL: `${API_BASE_URL}/api/deliveries/api/deliveries`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order Service Axios
export const orderApi = axios.create({
  baseURL: `${API_BASE_URL}/api/orders/api/v1/orders`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cartApi = axios.create({
    baseURL: `${API_BASE_URL}/api/cart/api/v1/cart`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Restaurant Service Axios
export const restaurantApi = axios.create({
  baseURL: `${API_BASE_URL}/api/restaurants/api/restaurants`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Service Axios (if needed)
export const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});
