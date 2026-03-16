<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Loader2, CheckCircle2, AlertCircle,
    Youtube, Clapperboard
} from 'lucide-vue-next'
import api from '../../utils/axios'
import echo from '../../utils/echo'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const videoId = route.params.id

const progress = ref(0)
const statusMessage = ref('Waiting in Queue...')
const videoStatus = ref('pending')
const errorMessage = ref(null)

// 1. Ambil data awal (Sesuai Section 3.2 & 7.5)
const fetchInitialStatus = async () => {
    try {
        const response = await api.get(`/videos/${videoId}`)
        const video = response.data.data

        // Ambil progress_percentage (10, 40, 70) dari backend 
        updateUI(
            video.status,
            video.progress_percentage || 0,
            video.step || 'Initializing...'
        )
    } catch (error) {
        errorMessage.value = "Video not found or access denied."
    }
}

// 2. Update UI secara reaktif
const updateUI = (status, pct, msg) => {
    videoStatus.value = status
    progress.value = pct
    statusMessage.value = msg

    if (status === 'completed') {
        progress.value = 100
        statusMessage.value = "All clips generated!"
        setTimeout(() => {
            router.push(`/dashboard/clips/${videoId}`)
        }, 2000)
    }

    if (status === 'failed') {
        errorMessage.value = "AI Analysis Failed. " + (msg || "");
        progress.value = 0
    }
}

// 3. Setup WebSocket Listener (Sesuai Section 1.4 & 10.5)
const setupRealtimeListener = () => {
    const userId = authStore.user?.id
    if (!userId) return

    // Menggunakan Private Channel per user [cite: 24, 33]
    echo.private(`App.Models.User.${userId}`)
        .listen('.VideoStatusUpdated', (e) => {
            // Validasi ID video agar tidak tertukar dengan proses lain [cite: 27, 35]
            if (e.video_id == videoId) {
                updateUI(e.status, e.progress_percentage, e.message)
            }
        })
}

onMounted(() => {
    fetchInitialStatus()
    setupRealtimeListener()
})

onUnmounted(() => {
    const userId = authStore.user?.id
    if (userId) {
        echo.leave(`App.Models.User.${userId}`)
    }
})
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-[#0B0F17] text-white p-6">
        <div v-if="errorMessage" class="text-center">
            <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p class="text-xl font-bold text-red-400">{{ errorMessage }}</p>
            <button @click="router.push('/dashboard')"
                class="mt-6 px-6 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all font-bold">
                Back to Dashboard
            </button>
        </div>

        <div v-else class="w-full max-w-md text-center">
            <div class="relative w-48 h-48 mx-auto mb-10">
                <svg class="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="10" fill="transparent"
                        class="text-gray-800" />
                    <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="10" fill="transparent"
                        class="text-emerald-500 transition-all duration-1000 ease-in-out" :style="{
                            strokeDasharray: 502,
                            strokeDashoffset: 502 - (502 * progress) / 100
                        }" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-black">{{ progress }}%</span>
                    <span class="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                        {{ videoStatus }}
                    </span>
                </div>
            </div>

            <h2 class="text-2xl font-black mb-2 uppercase tracking-tight">
                {{ videoStatus === 'completed' ? 'Processing Finished!' : 'Magic in Progress...' }}
            </h2>
            <p class="text-gray-400 text-sm mb-8 italic font-medium">{{ statusMessage }}</p>

            <div class="space-y-3">
                <div
                    class="flex items-center gap-4 p-5 rounded-3xl bg-gray-900/40 border border-white/5 transition-all shadow-xl">
                    <div class="p-2.5 bg-gray-800 rounded-xl">
                        <Clapperboard v-if="videoStatus === 'processing'"
                            class="w-5 h-5 text-emerald-400 animate-pulse" />
                        <Youtube v-else-if="videoStatus === 'pending'" class="w-5 h-5 text-amber-400" />
                        <CheckCircle2 v-else class="w-5 h-5 text-emerald-400" />
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-[9px] uppercase tracking-widest text-gray-500 font-black">System Status</span>
                        <span class="text-sm font-bold text-gray-200">{{ statusMessage }}</span>
                    </div>
                    <Loader2 v-if="videoStatus !== 'completed' && videoStatus !== 'failed'"
                        class="ml-auto w-5 h-5 animate-spin text-emerald-500" />
                    <CheckCircle2 v-if="videoStatus === 'completed'" class="ml-auto w-5 h-5 text-emerald-400" />
                    <AlertCircle v-if="videoStatus === 'failed'" class="ml-auto w-5 h-5 text-red-500" />
                </div>
            </div>
        </div>
    </div>
</template>