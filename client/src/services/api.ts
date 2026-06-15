import axios from 'axios';
import { AuthResponse, MessagesResponse, AnalysisResult, AnalyticsOverview, ChartData, BotStatus } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; username: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  getProfile: () => api.get('/auth/profile').then((r) => r.data),
};

export const telegramApi = {
  connect: (data: { botName: string; apiToken: string }) =>
    api.post<{ message: string; isConnected: boolean }>('/telegram/connect', data).then((r) => r.data),

  getStatus: () => api.get<BotStatus>('/telegram/status').then((r) => r.data),
};

export const messageApi = {
  analyze: (data: { text: string }) =>
    api.post<AnalysisResult>('/messages/analyze', data).then((r) => r.data),

  getAll: (params?: Record<string, string | number>) =>
    api.get<MessagesResponse>('/messages', { params }).then((r) => r.data),

  getById: (id: number) => api.get(`/messages/${id}`).then((r) => r.data),
};

export const analyticsApi = {
  getOverview: () => api.get<AnalyticsOverview>('/analytics/overview').then((r) => r.data),

  getEmotions: () => api.get<ChartData[]>('/analytics/emotions').then((r) => r.data),

  getComplaints: () => api.get<ChartData[]>('/analytics/complaints').then((r) => r.data),
};

export default api;
