import axios from "axios";

const restuarantApi = axios.create({
  baseURL: "http://localhost:5001/api", // Your backend
  withCredentials: false,
});

export default restuarantApi;
