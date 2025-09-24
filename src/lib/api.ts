import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para incluir o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  // A lógica de "sessão" (localstorage, etc.) não funciona bem em Server Components
  // mas como os componentes que usam a API são 'use client', podemos usar o localStorage.
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
