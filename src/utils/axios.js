import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true, 
    withXSRFToken: true,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const notify = useNotificationStore()
        const { status, config } = error.response || {}

        if (status === 401 && config.url.includes('/login')) {
            return Promise.reject(error)
        }

        if (status === 401) {
            notify.show('Session expired. Please login again.', 'error')
            return Promise.reject(error)
        }

        const msg = error.response?.data?.message || 'Something went wrong'
        notify.show(msg, 'error')

        return Promise.reject(error)
    }
)

export default api