import api from '../utils/axios';

const LOKAL_URL = 'http://localhost:8000';

export const authService = {
  async login(credentials) {
    // Ambil ijin CSRF dari lokal
    await api.get('/sanctum/csrf-cookie', { baseURL: LOKAL_URL });

    // Login ke Laravel lokal
    const res = await api.post('/login', credentials);
    return res;
  },

  async register(userData) {
    await api.get('/sanctum/csrf-cookie', { baseURL: LOKAL_URL });
    return await api.post('/register', userData);
  },

  async logout() {
    return await api.post('/logout');
  }
};