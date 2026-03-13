import { defineStore } from 'pinia'
import echo from '../utils/echo'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: '',
        type: 'success',
        isVisible: false,
        notifications: [] // Opsional: untuk history notifikasi
    }),
    actions: {
        show(message, type = 'success') {
            this.message = message
            this.type = type
            this.isVisible = true

            setTimeout(() => {
                this.isVisible = false
            }, 5000) // Diperpanjang ke 5 detik agar user sempat membaca
        },

        /**
         * Mendengarkan update status video secara real-time
         * @param {Number} userId 
         */
        listenToVideoUpdates(userId) {
            echo.connector.pusher.connection.bind('connected', () => {
                console.log("Connected to Echo server, now listening to channels...");
            });
            
            if (!userId) return;

            // Channel privat sesuai konvensi Laravel Broadcast
            // Pastikan di Backend namanya sama: PrivateChannel("user.{$userId}")
            echo.private(`user.${userId}`)
                .listen('.VideoStatusUpdated', (data) => {
                    console.log('Real-time Update:', data);

                    // Munculkan toast otomatis
                    const statusMessage = `Video "${data.video_title}" is now ${data.status}`;
                    this.show(statusMessage, data.status === 'completed' ? 'success' : 'info');

                    // refresh kredit otomatis setelah proses AI selesai
                    const auth = useAuthStore();
                    auth.fetchUserCredits();
                })
                .listen('.CreditUpdated', (data) => {
                    this.show(`Credits updated! Remaining: ${data.credits}`, 'success');
                });
        },

        stopListening(userId) {
            echo.leave(`user.${userId}`);
        }
    }
})