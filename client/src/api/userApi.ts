import axios from 'axios';

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5004/api',
  withCredentials: true,
});

export default userApi;
