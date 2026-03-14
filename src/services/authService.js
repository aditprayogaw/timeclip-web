import api from '../utils/axios';

export const authService = {
  async login(credentials) {
    // Menembak ke http://localhost:8000/api/login
    return await api.post('/login', credentials);
  },

  async register(userData) {
    return await api.post('/register', userData);
  },

  async loginWithGithub() {
    // Redirect langsung ke port 8000
    window.location.href = `http://localhost:8000/auth/github`;
  }
};