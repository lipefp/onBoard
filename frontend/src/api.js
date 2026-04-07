import axios from 'axios';
import { getAccessToken, getRefreshToken, saveAuthData, clearAuthData } from './utils/auth';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Injeta o token JWT automaticamente em todas as requisições,
// exceto nas rotas de autenticação que não precisam de token.
api.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.includes('auth/login') || config.url?.includes('auth/register');
  const token = getAccessToken();
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se a requisição falhar com 401 (token expirado), tenta renovar automaticamente.
// Se o refresh também falhar, desloga o usuário.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isAuthRoute = original.url?.includes('auth/login') || original.url?.includes('auth/register');
    const isRetry = original._retry;

    if (error.response?.status === 401 && !isAuthRoute && !isRetry) {
      original._retry = true;

      try {
        const refresh = getRefreshToken();
        const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', { refresh });

        saveAuthData(res.data.access, refresh, getAccessToken());
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        clearAuthData();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
