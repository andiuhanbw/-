import axios from 'axios';
import { ElMessage } from 'element-plus';

// Create an Axios instance
const request = axios.create({
  baseURL: '/api', // Base URL for API requests
  timeout: 5000, // Request timeout in milliseconds
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers if needed
    // Example: config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    // Handle errors
    ElMessage.error(error.response?.data?.message || 'Request failed');
    return Promise.reject(error);
  }
);

export default request;
