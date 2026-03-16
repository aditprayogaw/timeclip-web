import { defineStore } from 'pinia'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        // Getter untuk mengambil Tier (FREE, STARTER, PRO, BUSINESS)
        userTier: (state) => state.user?.tier?.toUpperCase() || 'FREE',
        userCredits: (state) => state.user?.remaining_credits || 0,
        isAdmin: (state) => state.user?.role === 'admin'
    },
    actions: {
        async login(credentials) {
            try {
                // LANGKAH 1: Ambil CSRF Cookie
                await api.get('http://localhost:8000/sanctum/csrf-cookie');

                // LANGKAH 2: Melakukan Login
                const response = await api.post('/login', credentials);

                // Response sukses memberikan status, access_token, dan object user
                const token = response.data.access_token;
                const user = response.data.user;

                this.token = token;
                this.user = user;

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
                // Sertakan token di header Authorization (diatur di interceptor axios)
                await api.post('/logout');
            } catch (e) {
                console.error("Logout error:", e);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.clear(); // Hapus token dari localStorage
                window.location.href = '/login';
            }
        },
        // Fungsi untuk memperbarui sisa kredit dan tier terbaru
        async fetchUserCredits() {
            if (!this.token) return;
            try {
                const response = await api.get('/user/credits');
                // Response berisi remaining_credits, tier, max_cap, dan last_reset
                if (response.data) {
                    this.user = { ...this.user, ...response.data };
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            } catch (error) {
                console.error('Failed to fetch user credits:', error);
                // Jika 401, handle token expired
                if (error.response?.status === 401) {
                    this.logout();
                }
            }
        },
    }
})