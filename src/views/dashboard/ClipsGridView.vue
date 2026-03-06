<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Play, Download, Sparkles, ArrowLeft,
    MoreVertical, ExternalLink, Loader2, Video
} from 'lucide-vue-next'
import api from '../../utils/axios'
import { useNotificationStore } from '../../stores/notifications'
import VideoModal from './VideoModal.vue'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()

const videoId = route.params.id
const clips = ref([])
const isLoading = ref(true)

// State untuk Modal Video Player
const selectedClip = ref(null)
const isModalOpen = ref(false)

// URL Dasar Backend untuk Assets
const storageUrl = 'http://127.0.0.1:8000/storage/'

const fetchClips = async () => {
    isLoading.value = true
    try {
        // Integrasi Endpoint API Secara Real
        const response = await api.get(`/videos/${videoId}/clips`)
        clips.value = response.data.data
    } catch (error) {
        notify.show('Failed to load clips. Please try again.', 'error')
        console.error("Error fetching clips:", error)
    } finally {
        isLoading.value = false
    }
}

const openPreview = (clip) => {
    selectedClip.value = clip
    isModalOpen.value = true
}

const handleDownload = (path, filename) => {
    // Logika Export/Download Center
    const link = document.createElement('a')
    link.href = `${storageUrl}${path}`
    link.download = filename || 'timeclip-video.mp4'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

onMounted(fetchClips)
</script>

<template>
    <div class="min-h-screen bg-[#0B0F17] font-sans text-white p-6">
        <header class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <button @click="router.push('/dashboard')"
                    class="p-2 bg-gray-900 rounded-lg border border-gray-800 hover:bg-gray-800 transition-all text-gray-400">
                    <ArrowLeft class="w-4 h-4" />
                </button>
                <div>
                    <h1 class="text-xl font-black tracking-tight uppercase italic leading-none">Viral Clips</h1>
                    <p class="text-gray-500 text-[11px] font-medium mt-1">
                        {{ clips.length }} Results found
                    </p>
                </div>
            </div>

            <button
                class="flex items-center gap-2 px-5 py-2.5 bg-timeclip-emerald text-black rounded-xl font-bold text-xs hover:scale-105 transition-all active:scale-95">
                <Sparkles class="w-3.5 h-3.5" /> Export All
            </button>
        </header>

        <div v-if="!isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            <div v-for="clip in clips" :key="clip.id"
                class="bg-gray-900/40 rounded-3xl border border-gray-800 overflow-hidden group hover:border-timeclip-emerald/40 transition-all duration-300 flex flex-col shadow-lg">

                <div class="relative aspect-3/4 bg-black overflow-hidden cursor-pointer" @click="openPreview(clip)">
                    <img :src="clip.thumbnail_path ? `${storageUrl}${clip.thumbnail_path}` : '/placeholder-thumb.jpg'"
                        class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />

                    <div class="absolute top-3 left-3">
                        <div
                            class="bg-timeclip-emerald/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-black text-[9px] font-black flex items-center gap-1">
                            {{ clip.viral_score }}
                        </div>
                    </div>

                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            class="p-4 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 scale-75 group-hover:scale-100 transition-transform">
                            <Play class="w-5 h-5 fill-current" />
                        </div>
                    </div>
                </div>

                <div class="p-4 flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-bold text-sm text-gray-200 line-clamp-2 leading-tight h-9">{{ clip.title }}</h3>
                        <button class="text-gray-600 hover:text-white mt-0.5">
                            <MoreVertical class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <button @click="openPreview(clip)"
                            class="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 text-white py-2.5 rounded-lg font-bold text-[10px] hover:bg-gray-700 transition-all">
                            <ExternalLink class="w-3 h-3" /> Edit
                        </button>
                        <button @click="handleDownload(clip.clip_path, clip.title)"
                            class="flex-1 flex items-center justify-center gap-1.5 bg-timeclip-emerald/10 text-timeclip-emerald py-2.5 rounded-lg font-bold text-[10px] hover:bg-timeclip-emerald/20 transition-all border border-timeclip-emerald/20">
                            <Download class="w-3 h-3" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isLoading && clips.length === 0"
            class="flex flex-col items-center justify-center py-32 text-center">
            <Video class="w-8 h-8 text-gray-800 mb-4" />
            <h3 class="text-lg font-bold text-white mb-1">No clips found</h3>
            <p class="text-gray-500 text-xs max-w-xs mx-auto">Try processing another video.</p>
        </div>

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            <div v-for="n in 5" :key="n"
                class="aspect-3/5 bg-gray-900/40 animate-pulse rounded-3xl border border-gray-800">
            </div>
        </div>

        <VideoModal :is-open="isModalOpen" :clip="selectedClip" @close="isModalOpen = false" />
    </div>
</template>

<style scoped>
/* Grid Transition */
.grid-enter-active,
.grid-leave-active {
    transition: all 0.3s ease;
}

.grid-enter-from,
.grid-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>