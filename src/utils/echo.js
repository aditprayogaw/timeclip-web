import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from './axios'; // Pastikan path ke axios sudah benar

window.Pusher = Pusher;

// 1. Membersihkan Host (PENTING)
const rawHost = import.meta.env.VITE_REVERB_HOST;
const cleanHost = rawHost.replace(/^https?:\/\//, '');

const echo = new Echo({
    broadcaster: 'reverb',
    // Gunakan key dari .env agar tidak bentrok dengan milik temanmu
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: cleanHost,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true, // WAJIB true untuk Ngrok (HTTPS/WSS)
    disableStats: true,
    enabledTransports: ['ws', 'wss'],

    // 2. Custom Authorizer
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                apiClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        console.error("Broadcasting auth failed:", error);
                        callback(true, error);
                    });
            }
        };
    },
});

export default echo;