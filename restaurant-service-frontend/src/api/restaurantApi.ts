import axios from 'axios';


const restaurantApi = axios.create({
  baseURL: 'http://localhost:5001/api/restaurants',
  withCredentials: true,
});

export default restaurantApi;
