import axios from 'axios';

// API Base URL configured for production Render backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dbms-project-34ec.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('novacart_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('novacart_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  getMe: () => api.get('/auth/me'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  logout: () => api.post('/auth/logout')
};

export const products = {
  list: (params) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  categories: () => api.get('/products/categories'),
  search: (query, limit = 10) => api.get(`/products/search/${encodeURIComponent(query)}`, { params: { limit } }),
  trending: (limit = 12) => api.get('/products/trending', { params: { limit } }),
  bestSellers: (limit = 12) => api.get('/products/best-sellers', { params: { limit } })
};

export const cart = {
  list: () => api.get('/cart'),
  add: (payload) => api.post('/cart', payload),
  update: (id, payload) => api.put(`/cart/${id}`, payload),
  remove: (id) => api.delete(`/cart/${id}`)
};

export const wishlist = {
  list: () => api.get('/wishlist'),
  add: (payload) => api.post('/wishlist', payload),
  remove: (productId) => api.delete(`/wishlist/${productId}`)
};

export const orders = {
  list: () => api.get('/orders'),
  create: (payload) => api.post('/orders', payload),
  get: (orderId) => api.get(`/orders/${orderId}`)
};

export const reviews = {
  create: (payload) => api.post('/reviews', payload)
};

export const payments = {
  process: (payload) => api.post('/payments/process', payload),
  generateUPIQR: (payload) => api.post('/payments/upi/generate-qr', payload),
  checkUPIStatus: (transactionId) => api.get(`/payments/upi/status/${transactionId}`),
  verifyUPIPayment: (payload) => api.post('/payments/upi/verify', payload)
};

export const admin = {
  dashboard: () => api.get('/admin/dashboard'),
  products: () => api.get('/admin/products'),
  createProduct: (payload) => api.post('/admin/products', payload),
  updateProduct: (id, payload) => api.put(`/admin/products/${id}`, payload),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  orders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status })
};

export default api;
