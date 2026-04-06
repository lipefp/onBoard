import axios from 'axios';
import { getAccessToken } from './utils/auth';

// Instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor: injeta o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;