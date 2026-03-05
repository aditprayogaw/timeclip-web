<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Loader2, CheckCircle2, AlertCircle,
    Youtube, Clapperboard, Scissors
} from 'lucide-vue-next'
import api from '../../utils/axios'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const videoId = route.params.id

const progress = ref(0)
const currentStepIndex = ref(0)
const videoStatus = ref('pending') // Mengikuti status asli backend
const errorMessage = ref(null)
let pollInterval = null

// Fungsi Polling untuk mengecek status video
const checkStatus = async () => {
    try {
        const response = await api.get(`/videos/${videoId}`)
        const videoData = response.data.data
        videoStatus.value = videoData.status

        // 1. Jika Gagal: Langsung set error dan stop polling
        if (videoStatus.value === 'failed' || videoStatus.value === 'error') {
            errorMessage.value = "AI Analysis Failed. Please check your video link."
            progress.value = 0 // Opsional: reset progres agar tidak membingungkan
            stopPolling()
            return // Keluar dari fungsi
        }

        // 2. Jika Sedang Proses: Jalankan simulasi
        if (videoStatus.value === 'processing' || videoStatus.value === 'pending') {
            if (progress.value < 90) progress.value += 5
            currentStepIndex.value = Math.min(Math.floor(progress.value / 25), 3)
        }

        // 3. Jika Berhasil: Selesaikan progres
        if (videoStatus.value === 'completed') {
            progress.value = 100
            isCompleted.value = true
            stopPolling()
            setTimeout(() => { router.push(`/dashboard/clips/${videoId}`) }, 2000)
        }
    } catch (error) {
        // Jika refresh dan ID tidak ditemukan atau error 401/404
        console.error("Gagal sinkronisasi: ", error)
        errorMessage.value = "Connection lost or video not found."
        stopPolling()
    }
}

const stopPolling = () => {
    if (pollInterval) clearInterval(pollInterval)
}

onMounted(() => {
    checkStatus()
    pollInterval = setInterval(checkStatus, 3000)
})

onUnmounted(() => stopPolling())
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-[#0B0F17] text-white p-6">
        <div v-if="errorMessage" class="text-center">
            <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p class="text-xl font-bold text-red-400">{{ errorMessage }}</p>
            <button @click="router.push('/dashboard')" class="mt-6 text-gray-500 underline">Back to Dashboard</button>
        </div>

        <div v-else class="w-full max-w-md text-center">
            <div class="relative w-48 h-48 mx-auto mb-10">
                <svg class="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="10" fill="transparent"
                        class="text-gray-800" />
                    <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="10" fill="transparent"
                        class="text-timeclip-emerald transition-all duration-700"
                        :style="{ strokeDasharray: 502, strokeDashoffset: 502 - (502 * progress) / 100 }" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-black">{{ progress }}%</span>
                    <span class="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{{ videoStatus }}</span>
                </div>
            </div>

            <h2 class="text-2xl font-black mb-6">
                {{ videoStatus === 'completed' ? 'Processing Finished!' : 'Magic in Progress...' }}
            </h2>

            <div class="space-y-3">
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/40 border border-gray-800"
                    :class="{ 'opacity-50': videoStatus === 'completed' }">
                    <div class="p-2 bg-gray-800 rounded-lg">
                        <Youtube v-if="videoStatus === 'pending'" class="w-5 h-5 text-timeclip-emerald" />
                        <Clapperboard v-else class="w-5 h-5 text-gray-500" />
                    </div>
                    <span class="text-sm font-bold uppercase tracking-wider">
                        {{ videoStatus === 'pending' ? 'Waiting in Queue' : 'AI Analysis Started' }}
                    </span>
                    <Loader2 v-if="videoStatus !== 'completed'"
                        class="ml-auto w-4 h-4 animate-spin text-timeclip-emerald" />
                    <CheckCircle2 v-else class="ml-auto w-4 h-4 text-timeclip-emerald" />
                </div>
            </div>
        </div>
    </div>
</template>