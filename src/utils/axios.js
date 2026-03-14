import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => Promise.reject(error))

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const notify = useNotificationStore()
        const { status, config } = error.response || {}

        // Jika error 401 saat login, jangan tampilkan notifikasi expired (biarkan ditangani di View)
        if (status === 401 && config.url.includes('/login')) {
            return Promise.reject(error)
        }

        // Jika error 401 di route lain, artinya session/token habis
        if (status === 401) {
            notify.show('Session expired. Please login again.', 'error')
            // Opsi: localStorage.clear() atau logout otomatis di sini
            return Promise.reject(error)
        }

        const msg = error.response?.data?.message || 'Something went wrong'
        notify.show(msg, 'error')

        return Promise.reject(error)
    }
)

export default api