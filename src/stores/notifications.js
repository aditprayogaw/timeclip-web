import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: '',
        type: 'success',
        isVisible: false
    }),
    actions: {
        show(message, type = 'success') {
            this.message = message
            this.type = type
            this.isVisible = true

            setTimeout(() => {
                this.isVisible = false
            }, 3000)
        }
    }
})