import { defineStore } from 'pinia'
import api from '../utils/axios'
import Echo from '../utils/echo' // Impor Echo

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        userCredits: (state) => state.user?.remaining_credits || 0,
        userTier: (state) => state.user?.tier?.toUpperCase() || 'FREE'
    },

    actions: {
        async login(credentials) {
            try {
                const rootUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
                await api.get(`${rootUrl}/sanctum/csrf-cookie`);

                const response = await api.post('/login', credentials);

                if (response.data.status === 'success') {
                    this.token = response.data.access_token;
                    this.user = response.data.user;

                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', JSON.stringify(this.user));

                    // Refresh diperlukan agar Echo mendeteksi token baru di localStorage
                    window.location.reload();

                    return response;
                }
            } catch (error) {
                console.error("Login gagal:", error.response?.data || error.message);
                throw error;
            }
        },

        async logout() {
            try {
                // Berhenti mendengarkan semua channel sebelum logout
                Echo.disconnect();
                await api.post('/logout');
            } catch (err) {
                console.error("Logout error", err);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.clear();
                window.location.href = '/login';
            }
        },

        async fetchUserCredits() {
            if (!this.token) return;
            try {
                const response = await api.get('/user/credits');
                if (response.data) {
                    this.user = { ...this.user, ...response.data };
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            } catch (error) {
                console.error('Failed to fetch user credits:', error);
            }
        }
    }
})