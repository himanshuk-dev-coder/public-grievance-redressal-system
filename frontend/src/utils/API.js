import axios from "axios";
import {toast} from 'react-toastify';

axios.defaults.withCredentials = true;


const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});



axios.post("http://localhost:5000/api/auth/refresh", {}, {
  withCredentials: true,
  
});

// 🔁 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.message || "Server error");
    return Promise.reject(error);
  }
);



export default api;
