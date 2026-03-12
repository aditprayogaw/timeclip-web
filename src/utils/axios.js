import axios from 'axios'

const api = axios.create({
    baseURL: 'https://bradly-spumescent-keisha.ngrok-free.dev/api', 
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'ngrok-skip-browser-warning': 'true'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api