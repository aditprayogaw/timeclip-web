import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // WAJIB ADA untuk Ngrok
        'ngrok-skip-browser-warning': 'true' 
    }
})

export default api