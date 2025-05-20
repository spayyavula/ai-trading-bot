import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const marketDataApi = {
  getMarketRegime: () => api.get('/market/regime'),
  getHistoricalData: (symbol: string, timeframe: string) => 
    api.get(`/market/historical/${symbol}`, { params: { timeframe } }),
  getMarketIndicators: (symbol: string) => 
    api.get(`/market/indicators/${symbol}`),
};

export const tradingApi = {
  getPositions: () => api.get('/trading/positions'),
  getOrders: () => api.get('/trading/orders'),
  placeOrder: (orderData: any) => api.post('/trading/orders', orderData),
  cancelOrder: (orderId: string) => api.delete(`/trading/orders/${orderId}`),
};

export const journalApi = {
  getEntries: () => api.get('/journal/entries'),
  createEntry: (entryData: any) => api.post('/journal/entries', entryData),
  updateEntry: (entryId: string, entryData: any) => 
    api.put(`/journal/entries/${entryId}`, entryData),
  deleteEntry: (entryId: string) => api.delete(`/journal/entries/${entryId}`),
};

export const learningApi = {
  getScenarios: () => api.get('/learning/scenarios'),
  getScenario: (scenarioId: string) => api.get(`/learning/scenarios/${scenarioId}`),
  submitScenarioAnswer: (scenarioId: string, answer: any) => 
    api.post(`/learning/scenarios/${scenarioId}/submit`, answer),
  getProgress: () => api.get('/learning/progress'),
};

export default api; 