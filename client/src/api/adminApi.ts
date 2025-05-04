import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5004/api", // Your backend
  withCredentials: true,
});

export default adminApi;
