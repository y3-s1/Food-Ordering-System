import axios from 'axios';


const userApi = axios.create({
  baseURL: 'http://localhost:5004/api',
  withCredentials: true,
});

export default userApi;
