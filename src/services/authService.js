import axios from 'axios';

// Arahkan ke server Laravel Anda (biasanya port 8000)
const API_URL = 'http://127.0.0.1:8000/api';

export const authService = {
  async login(credentials) {
    return await axios.post(`${API_URL}/mock/login`, credentials);
  },

  async register(userData) {
    return await axios.post(`${API_URL}/mock/register`, userData);
  },

  async loginWithGithub() {
    window.location.href = `http://127.0.0.1:8000/auth/github`;
  }
};