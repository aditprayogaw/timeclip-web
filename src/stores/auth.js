import { defineStore } from 'pinia'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Inisialisasi dari localStorage agar session tetap ada saat refresh
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),

    getters: {
        // Pantau status login secara reaktif
        isAuthenticated: (state) => !!state.token,

        // Cek role untuk proteksi menu Admin
        isAdmin: (state) => state.user?.role === 'admin',

        // Pantau sisa kredit untuk indikator UI
        userCredits: (state) => state.user?.remaining_credits || 0,

        // Label Tier untuk tampilan profil
        userTier: (state) => state.user?.tier?.toUpperCase() || 'FREE'
    },

    actions: {
        /**
         * Alur Login Lengkap
         */
        async login(credentials) {
            try {
                await api.get('/../sanctum/csrf-cookie');

                
                const response = await api.post('/login', credentials);

                if (response.data.status === 'success') {
                   
                    this.token = response.data.access_token;
                    this.user = response.data.user;

                    // Simpan ke localStorage untuk persistensi
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', JSON.stringify(this.user));

                    return response;
                }
            } catch (error) {
               
                throw error;
            }
        },

        /**
         * Alur Logout
         */
        async logout() {
            try {

                await api.post('/logout');
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {

                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');

            }
        },

        async fetchUserCredits() {
            if (!this.token) return;

            try {
                const response = await api.get('/user/credits');

                if (response.data) {
                    this.user = {
                        ...this.user,
                        remaining_credits: response.data.remaining_credits,
                        tier: response.data.tier
                    };

                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            } catch (error) {
                console.error('Failed to fetch user credits:', error);
            }
        }
    }
})