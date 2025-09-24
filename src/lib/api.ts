import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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


// Interceptor para tratar erros de autenticação (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Evita redirecionamentos em loop se a própria página de login falhar
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);


export default api;
