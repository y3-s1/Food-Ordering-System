import axios from "axios";

const restuarantApi = axios.create({
  baseURL: "http://localhost:5001/api", // Your backend
  withCredentials: true,
});

export default restuarantApi;
