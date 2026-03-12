<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    Home, LogOut, Link as LinkIcon, Scissors,
    AlertCircle, ChevronRight, Clock, Video,
    Loader2, ChevronLeft, Sparkles, Zap
} from 'lucide-vue-next'
import { useNotificationStore } from '../../stores/notifications'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'
import echo from '../../utils/echo'

const router = useRouter()
const notify = useNotificationStore()
const authStore = useAuthStore()

// --- STATE DATA ---
const videoUrl = ref('')
const isLoading = ref(true)
const isProcessing = ref(false)
const allVideos = ref([])
const userId = authStore.user?.id

// --- STATE PAGINATION ---
const currentPage = ref(1)
const itemsPerPage = 6

// --- LOGIC STATUS ---
const isVideoReady = (status) => status === 'ready' || status === 'completed'
const isVideoFailed = (status) => ['failed', 'error'].includes(status)
const isVideoRendering = (status) => status === 'rendering'

// --- COMPUTED: PAGINATION ---
const totalPages = computed(() => Math.ceil(allVideos.value.length / itemsPerPage))
const paginatedVideos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allVideos.value.slice(start, end)
})

// --- API ACTIONS ---
const fetchVideos = async () => {
    isLoading.value = true
    try {
        const response = await api.get('/videos')
        allVideos.value = response.data.data || []
    } catch (error) {
        console.error("Gagal memuat video:", error)
    } finally {
        isLoading.value = false
    }
}

const handleProcessVideo = async () => {
    if (!videoUrl.value.includes('youtube.com') && !videoUrl.value.includes('youtu.be')) {
        notify.show('Hanya link YouTube yang didukung', 'error')
        return
    }

    isProcessing.value = true
    try {
        await api.post('/videos/process', {
            url: videoUrl.value,
            title: "Project " + new Date().toLocaleDateString(),
            duration: 60
        })
        notify.show('Video berhasil ditambahkan ke antrean', 'success')
        videoUrl.value = ''
        fetchVideos()
    } catch (error) {
        notify.show(error.response?.data?.message || 'Gagal terhubung ke server', 'error')
    } finally {
        isProcessing.value = false
    }
}

const setupRealtime = () => {
    if (!userId) return
    echo.private(`App.Models.User.${userId}`)
        .listen('.ClipStatusUpdated', (e) => {
            const video = allVideos.value.find(v => v.id === e.clip.id)
            if (video) {
                video.status = e.clip.status
                video.status_message = e.clip.status_message
                if (isVideoFailed(e.clip.status)) {
                    notify.show(`Gagal: ${e.clip.status_message}`, 'error')
                }
            } else {
                fetchVideos()
            }
        })
}

const getStatusTheme = (status) => {
    if (isVideoReady(status)) return 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10'
    if (isVideoFailed(status)) return 'text-rose-400 bg-rose-400/5 border-rose-400/10'
    if (isVideoRendering(status)) return 'text-sky-400 bg-sky-400/5 border-sky-400/10 animate-pulse'
    return 'text-slate-400 bg-slate-800/50 border-white/5'
}

onMounted(() => {
    fetchVideos()
    setupRealtime()
})

onUnmounted(() => {
    if (userId) echo.leave(`App.Models.User.${userId}`)
})
</script>

<template>
    <div class="flex h-screen w-full overflow-hidden bg-[#0A0C10] text-slate-200">

        <aside class="w-64 border-r border-white/5 flex flex-col p-6 bg-[#0E1117] shrink-0">
            <div class="mb-10 px-2">
                <img src="/TimeCHoriC.png" alt="Logo" class="h-8 opacity-90" />
            </div>

            <nav class="flex-1 space-y-2">
                <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu</p>
                <div
                    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 font-bold text-sm tracking-tight">
                    <Home class="w-4 h-4" /> Dashboard
                </div>
            </nav>

            <div class="mt-auto pt-6 space-y-4 border-t border-white/5">
                <div class="p-5 bg-white/2 rounded-2xl border border-white/5">
                    <p
                        class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Zap class="w-3 h-3 text-emerald-400" /> AI Credits
                    </p>
                    <div class="flex justify-between items-end">
                        <p class="text-2xl font-semibold text-white leading-none">{{ authStore.user?.remaining_credits
                            || 0 }}</p>
                        <p class="text-[9px] text-slate-600 font-medium">REMAINING</p>
                    </div>
                </div>
                <button @click="authStore.logout(); router.push('/login')"
                    class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 w-full rounded-xl text-sm font-semibold transition-all">
                    <LogOut class="w-4 h-4" /> Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#0A0C10]">

            <section
                class="py-20 px-12 flex flex-col items-center justify-center relative border-b border-white/3">
                <div class="w-full max-w-2xl text-center relative z-10">
                    <div class="mb-10">
                        <div
                            class="inline-flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-1.5 rounded-full mb-6">
                            <Sparkles class="w-3 h-3 text-emerald-400" />
                            <span class="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Powered By TimeClip AI</span>
                        </div>
                        <h2 class="text-5xl font-bold tracking-tight text-white mb-4">
                            Transforming Videos <br /> <span class="text-slate-500 font-medium">into Highlights.</span>
                        </h2>
                    </div>

                    <div class="bg-[#0E1117] border border-white/5 p-6 rounded-[2.5rem] shadow-xl">
                        <div class="relative">
                            <LinkIcon class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input v-model="videoUrl" type="text" :disabled="isProcessing"
                                placeholder="Paste YouTube URL here..."
                                class="w-full bg-[#161B22] border border-white/5 text-white pl-12 pr-6 py-4 rounded-2xl focus:border-emerald-500/30 outline-none transition-all text-sm font-medium placeholder:text-slate-700" />
                        </div>
                        <button @click="handleProcessVideo" :disabled="isProcessing"
                            class="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-[#05070A] py-4 rounded-2xl font-bold text-sm tracking-tight transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                            <Loader2 v-if="isProcessing" class="w-4 h-4 animate-spin" />
                            <span>{{ isProcessing ? 'Processing...' : 'Create Highlights' }}</span>
                        </button>
                    </div>
                </div>
            </section>

            <section class="p-12 max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-10">
                    <h3 class="text-xl font-bold text-white flex items-center gap-3">
                        Library
                        <span
                            class="px-2.5 py-0.5 bg-white/3 text-[11px] text-slate-500 rounded-lg border border-white/5 font-medium">{{
                            allVideos.length }}</span>
                    </h3>

                    <div v-if="totalPages > 1" class="flex items-center gap-2">
                        <button @click="currentPage--" :disabled="currentPage === 1"
                            class="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all bg-white/2 border border-white/5 rounded-xl">
                            <ChevronLeft class="w-4 h-4" />
                        </button>
                        <span class="text-[10px] font-bold px-2 text-slate-500 uppercase tracking-widest">{{ currentPage
                            }} / {{ totalPages }}</span>
                        <button @click="currentPage++" :disabled="currentPage === totalPages"
                            class="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all bg-white/2 border border-white/5 rounded-xl">
                            <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="i in 3" :key="i"
                        class="h-60 bg-white/2 animate-pulse rounded-4xl border border-white/5"></div>
                </div>

                <div v-else-if="allVideos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="video in paginatedVideos" :key="video.id"
                        @click="isVideoReady(video.status) && router.push(`/dashboard/clips/${video.id}`)"
                        class="group bg-[#0E1117] border border-white/5 rounded-4xl p-7 transition-all duration-300 flex flex-col hover:border-emerald-500/20 hover:bg-[#12161D]"
                        :class="isVideoReady(video.status) ? 'cursor-pointer' : 'cursor-default'">

                        <div class="flex justify-between items-start mb-6">
                            <div class="p-4 bg-white/2 rounded-2xl border border-white/5">
                                <Video v-if="isVideoReady(video.status)" class="w-5 h-5 text-emerald-400" />
                                <AlertCircle v-else-if="isVideoFailed(video.status)" class="w-5 h-5 text-rose-400" />
                                <Loader2 v-else class="w-5 h-5 text-sky-400 animate-spin" />
                            </div>
                            <div
                                :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors', getStatusTheme(video.status)]">
                                {{ video.status }}
                            </div>
                        </div>

                        <h4
                            class="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                            {{ video.title || 'Untitled Project' }}
                        </h4>

                        <div class="flex items-center gap-2 text-[11px] font-medium mb-8" :class="{
                            'text-rose-400': isVideoFailed(video.status),
                            'text-emerald-400': isVideoReady(video.status) || isVideoRendering(video.status),
                            'text-slate-500': !isVideoFailed(video.status) && !isVideoReady(video.status)
                        }">
                            <Clock class="w-3.5 h-3.5" :class="{ 'animate-pulse': isVideoRendering(video.status) }" />
                            <span>
                                <template v-if="isVideoFailed(video.status)">{{ video.status_message || 'Error'
                                    }}</template>
                                <template v-else-if="isVideoRendering(video.status)">Generating Subtitles...</template>
                                <template v-else-if="isVideoReady(video.status)">Ready to edit</template>
                                <template v-else>Processing...</template>
                            </span>
                        </div>

                        <div class="mt-auto pt-5 border-t border-white/3 flex items-center justify-between">
                            <span class="text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                                {{ new Date(video.created_at).toLocaleDateString() }}
                            </span>
                            <div v-if="isVideoReady(video.status)"
                                class="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                                Open Editor
                                <ChevronRight class="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="py-24 flex flex-col items-center text-center">
                    <div
                        class="w-20 h-20 bg-white/2 rounded-4xl border border-white/5 flex items-center justify-center mb-6 opacity-30">
                        <Video class="w-8 h-8 text-slate-500" />
                    </div>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-600">No projects yet</p>
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>