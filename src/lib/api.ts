import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Você pode adicionar um interceptor para incluir o token de autenticação
// em todas as requisições, depois que a tela de login for implementada.
// Exemplo:
/*
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken'); // ou de onde quer que você armazene
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

export default api;
