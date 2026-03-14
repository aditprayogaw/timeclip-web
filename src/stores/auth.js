import { defineStore } from 'pinia'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        userCredits: (state) => state.user?.remaining_credits || 0
    },
    actions: {
        async login(credentials) {
            try {
                // LANGKAH 1: Ambil CSRF Cookie 
                // Gunakan URL Lengkap untuk menghindari prefix /api
                await api.get('http://localhost:8000/sanctum/csrf-cookie');

                // LANGKAH 2: Melakukan Login
                // Ini akan menembak ke http://localhost:8000/api/login
                const response = await api.post('/login', credentials);

                // Ambil data dari response
                const token = response.data.access_token;
                const user = response.data.user;

                // Simpan ke state
                this.token = token;
                this.user = user;

                // Simpan ke storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                return response;
            } catch (error) {
                console.error("Login Store Error:", error.response?.data);
                throw error;
            }
        },
        async logout() {
            try {
                // Panggil logout ke backend jika perlu
                await api.post('/logout');
            } catch (e) {
                console.error("Logout error:", e);
            } finally {
                // Tetap hapus data lokal meskipun request gagal
                this.token = null
                this.user = null
                localStorage.clear()
            }
        },
        async fetchUser() {
            try {
                const response = await api.get('/user/credits');
                this.user = { ...this.user, ...response.data };
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                console.error('Failed to fetch user credits:', error);
            }
        },
    }
})