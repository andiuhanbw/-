// src/api/order.js
import axios from 'axios';

const API_URL = '/mock/orders';

export const getOrders = (params = {}) => axios.get(API_URL, { params });
export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);
export const createOrder = (data) => axios.post(API_URL, data);
export const updateOrder = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);
