import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userCredits: (state) => state.user ? state.user.credits : 0,
    },

    actions: {
        async login(credentials) {
            this.isLoading = true
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/mock/login', credentials)
                
                this.user = response.data.user
                this.token = response.data.access_token
                
                localStorage.setItem('user', JSON.stringify(this.user))
                localStorage.setItem('token', this.token)
                
                return response.data
            } finally {
                this.isLoading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }

    }    

})    