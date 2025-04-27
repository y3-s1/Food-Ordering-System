import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:5006/api',
  withCredentials: true,
});

export default userApi;
