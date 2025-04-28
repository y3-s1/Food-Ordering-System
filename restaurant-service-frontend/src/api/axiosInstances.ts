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
  baseURL: `${API_BASE_URL}/api/orders/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restaurant Service Axios
export const restaurantApi = axios.create({
  baseURL: `http://localhost:5001/api/restaurants`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Service Axios (if needed)
export const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});
