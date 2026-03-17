<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '../../services/adminService'
import {
    Loader2, AlertCircle, Layers, Cpu, Activity, Terminal
} from 'lucide-vue-next'
import api from '../../utils/axios'
import echo from '../../utils/echo'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const videoId = route.params.id

const progress = ref(0)
const statusMessage = ref('Connecting to pipeline...')
const videoStatus = ref('pending')
const errorMessage = ref(null)
const systemLogs = ref([])
let logInterval = null

// Mapping keyword log GeminiService → progress + pesan yang ditampilkan
const LOG_PROGRESS_MAP = [
    { keyword: 'GEMINI TRANSCRIPTION START',        pct: 10, msg: 'Initializing AI transcription engine...' },
    { keyword: 'Memproses chunk',                   pct: 20, msg: 'Splitting audio into segments...' },
    { keyword: 'Total Durasi',                      pct: 15, msg: 'Analyzing audio duration...' },
    { keyword: 'Transcription Chunked Selesai',     pct: 55, msg: 'Transcription complete, generating timestamps...' },
    { keyword: 'AI berhasil menemukan',             pct: 70, msg: 'AI found highlight moments...' },
    { keyword: 'STARTING FFMPEG',                   pct: 80, msg: 'Rendering video clips...' },
    { keyword: 'Starting FFMPEG',                   pct: 80, msg: 'Rendering video clips...' },
    { keyword: 'Clip berhasil dirender',            pct: 90, msg: 'Finalizing clips...' },
    { keyword: 'berhasil diupload',                 pct: 95, msg: 'Uploading to storage...' },
]

const fetchLogs = async () => {
    try {
        const res = await adminService.getLogs()
        const allLogs = res.data.data

        // Filter longgar: ambil log yang relevan dengan video ini
        // Cukup ambil log terbaru yang berkaitan dengan proses AI/FFMPEG
        const relevantLogs = allLogs.filter(log => {
            const inPayload = log.payload && (
                log.payload.includes(`"video_id":${videoId}`) ||
                log.payload.includes(`"video_id": ${videoId}`)
            )
            const isProcessingLog = ['GEMINI', 'FFMPEG', 'AI'].includes(log.service)

            return inPayload || isProcessingLog
        }).slice(0, 6)

        systemLogs.value = relevantLogs

        // Update progress berdasarkan log terbaru yang match keyword
        if (videoStatus.value !== 'completed' && videoStatus.value !== 'failed') {
            for (const log of relevantLogs) {
                for (const map of LOG_PROGRESS_MAP) {
                    if (log.message.includes(map.keyword) && map.pct > progress.value) {
                        progress.value = map.pct
                        statusMessage.value = map.msg
                        break
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Log sync paused")
    }
}

const updateUI = (status, pct, msg) => {
    videoStatus.value = status
    if (msg) statusMessage.value = msg
    if (pct && pct > progress.value) progress.value = pct

    if (status === 'completed' || status === 'ready') {
        progress.value = 100
        statusMessage.value = 'Processing complete! Redirecting...'
        setTimeout(() => router.push(`/dashboard/clips/${videoId}`), 1500)
    }

    if (status === 'failed' || status === 'error') {
        errorMessage.value = msg || "AI analysis encountered an error."
    }
}

const fetchInitialStatus = async () => {
    try {
        const response = await api.get(`/videos/${videoId}`)
        const video = response.data.data
        updateUI(video.status, video.progress_percentage, video.status_message)
    } catch (error) {
        errorMessage.value = "Project not found."
    }
}

const setupRealtimeListener = () => {
    const userId = authStore.user?.id
    if (!userId) return
    echo.private(`App.Models.User.${userId}`)
        .listen('.VideoStatusUpdated', (e) => {
            if (e.video_id == videoId) {
                updateUI(e.status, e.progress_percentage, e.message)
            }
        })
}

onMounted(() => {
    fetchInitialStatus()
    setupRealtimeListener()
    fetchLogs()
    logInterval = setInterval(fetchLogs, 3000)
})

onUnmounted(() => {
    if (logInterval) clearInterval(logInterval)
    const userId = authStore.user?.id
    if (userId) echo.leave(`App.Models.User.${userId}`)
})
</script>

<template>
    <div
        class="min-h-screen bg-[#080A0F] text-slate-300 p-6 flex flex-col items-center justify-center font-sans overflow-hidden">

        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none">
        </div>

        <div v-if="errorMessage" class="relative z-10 text-center max-w-sm">
            <div
                class="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle class="w-8 h-8 text-rose-500" />
            </div>
            <h3 class="text-lg font-medium text-white mb-2">Process Halted</h3>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">{{ errorMessage }}</p>
            <button @click="router.push('/dashboard')"
                class="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Back to Dashboard
            </button>
        </div>

        <div v-else class="relative z-10 w-full max-w-md">
            <div class="relative w-64 h-64 mx-auto mb-12">
                <svg class="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="115" stroke="currentColor" stroke-width="2" fill="transparent"
                        class="text-white/5" />
                    <circle cx="128" cy="128" r="115" stroke="currentColor" stroke-width="4" fill="transparent"
                        stroke-linecap="round" class="text-indigo-500 transition-all duration-1000"
                        :style="{ strokeDasharray: 722, strokeDashoffset: 722 - (722 * progress) / 100 }" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-6xl font-light text-white tracking-tighter">{{ progress }}%</span>
                    <span class="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-2">NPU Active</span>
                </div>
            </div>

            <div class="text-center mb-16">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 bg-white/3 border border-white/5 rounded-full mb-4">
                    <Loader2 class="w-3 h-3 animate-spin text-indigo-400" />
                    <span class="text-[9px] uppercase tracking-widest font-bold text-slate-500">Live Status</span>
                </div>
                <h2 class="text-xl font-medium text-white tracking-tight px-4 h-12">
                    {{ statusMessage }}
                </h2>
            </div>

            <div class="border-t border-white/5 pt-8">
                <div class="flex items-center justify-between mb-6 px-1">
                    <div class="flex items-center gap-2">
                        <Terminal class="w-3 h-3 text-emerald-500" />
                        <span class="text-[9px] font-bold uppercase tracking-widest text-slate-500">Engine Feed</span>
                    </div>
                    <span
                        class="text-[8px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase">Realtime</span>
                </div>

                <div class="space-y-4 min-h-30">
                    <transition-group name="list">
                        <div v-for="log in systemLogs" :key="log.id" class="flex gap-4 items-start group">
                            <span class="text-[9px] font-mono text-slate-600 mt-1 shrink-0">
                                {{ log.created_at.split(' ')[1] }}
                            </span>
                            <div class="flex flex-col gap-0.5 overflow-hidden">
                                <span class="text-[8px] font-bold text-indigo-400/60 uppercase tracking-tighter">
                                    {{ log.service }}
                                </span>
                                <p
                                    class="text-[11px] text-slate-400 leading-relaxed truncate group-hover:text-slate-200 transition-colors">
                                    {{ log.message }}
                                </p>
                            </div>
                        </div>
                    </transition-group>

                    <div v-if="systemLogs.length === 0"
                        class="flex flex-col items-center justify-center py-6 opacity-20">
                        <Activity class="w-5 h-5 animate-pulse mb-2" />
                        <p class="text-[10px] font-medium italic">Awaiting backend response...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-10px);
}

circle {
    transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>