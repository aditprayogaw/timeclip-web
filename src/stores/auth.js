import { defineStore } from 'pinia'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        // Getter ini yang dipantau oleh Navbar
        isAuthenticated: (state) => !!state.token,
        userCredits: (state) => state.user?.remaining_credits || 0
    },
    actions: {
        async login(credentials) {
            try {
                // Kita panggil tanpa prefix /api karena rute ini biasanya di luar grup API
                await api.get('http://localhost:8000/sanctum/csrf-cookie');

                // LANGKAH 2: Melakukan Login
                const response = await api.post('/login', credentials);

                // Simpan ke state agar reaktif
                this.token = response.data.access_token;
                this.user = response.data.user;

                // Simpan ke storage
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                return response;
            } catch (error) {
                throw error;
            }
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.clear()
        },
        async fetchUser() {
            try {
                const response = await api.get('/user/credits');
                this.user = { ...this.user, ...response.data };
            } catch (error) {
                console.error('Failed to fetch user credits:', error);
            }
        },
    }
})