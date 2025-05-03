import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const restaurantApi = axios.create({
  baseURL: `${API_BASE_URL}/api/restaurants/api/restaurants`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default restaurantApi;
