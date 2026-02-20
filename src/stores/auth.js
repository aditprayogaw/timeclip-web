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
            const response = await api.post('/login', credentials)
            // Simpan ke state agar reaktif
            this.token = response.data.access_token
            this.user = response.data.user
            // Simpan ke storage agar tidak hilang saat refresh
            localStorage.setItem('token', this.token)
            localStorage.setItem('user', JSON.stringify(this.user))
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.clear()
        }
    }
})