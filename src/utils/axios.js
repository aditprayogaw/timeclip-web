import axios from 'axios'
import { useNotificationStore } from '../stores/notifications' 

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
})

api.interceptors.response.use(
    (response) => {
        const notify = useNotificationStore()
        if (response.data.message) {
            notify.show(response.data.message, 'success')
        }
        return response
    },
    (error) => {
        const notify = useNotificationStore()
        const msg = error.response?.data?.message || 'Something went wrong'
        notify.show(msg, 'error')
        return Promise.reject(error)
    }
)

export default api