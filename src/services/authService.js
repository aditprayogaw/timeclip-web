// src/services/authService.js
import axios from 'axios';

// URL ini nantinya akan disesuaikan setelah kamu clone repo backend
const API_URL = 'http://localhost:3000/api/auth'; 

export const authService = {
  async loginWithGithub() {
    // Biasanya ini akan mengarahkan user ke URL otorisasi GitHub dari backend
    window.location.href = `${API_URL}/github`;
  },
  
  async handleGithubCallback(code) {
    return await axios.post(`${API_URL}/github/callback`, { code });
  }
};