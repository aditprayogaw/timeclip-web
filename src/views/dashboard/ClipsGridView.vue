<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Play, Download, Sparkles, ArrowLeft,
    MoreVertical, ExternalLink, Loader2, Video
} from 'lucide-vue-next'
import api from '@/utils/axios'
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
    <div class="min-h-screen bg-[#0B0F17] font-sans text-white p-8">
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div class="flex items-center gap-6">
                <button @click="router.push('/dashboard')"
                    class="p-3 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all text-gray-400 hover:text-white">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <div>
                    <h1 class="text-3xl font-black tracking-tight italic uppercase">Your Viral Clips</h1>
                    <p class="text-gray-500 text-sm font-medium">
                        {{ clips.length }} AI-generated highlights ready for social media
                    </p>
                </div>
            </div>

            <button
                class="flex items-center justify-center gap-2 px-8 py-4 bg-timeclip-emerald text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-timeclip-emerald/10 active:scale-95">
                <Sparkles class="w-4 h-4" /> Export All Clips
            </button>
        </header>

        <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="clip in clips" :key="clip.id"
                class="bg-gray-900/40 rounded-[2.5rem] border border-gray-800 overflow-hidden group hover:border-timeclip-emerald/50 transition-all duration-500 flex flex-col">

                <div class="relative aspect-9/16 bg-black overflow-hidden cursor-pointer" @click="openPreview(clip)">
                    <img :src="clip.thumbnail_path ? `${storageUrl}${clip.thumbnail_path}` : '/placeholder-thumb.jpg'"
                        class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                    <div class="absolute top-6 left-6">
                        <div
                            class="bg-timeclip-emerald px-4 py-1.5 rounded-full text-black text-[11px] font-black shadow-2xl flex items-center gap-2">
                            <Sparkles class="w-3 h-3" /> {{ clip.viral_score }} VIRAL SCORE
                        </div>
                    </div>

                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            class="p-6 bg-white rounded-full text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play class="w-8 h-8 fill-current" />
                        </div>
                    </div>
                </div>

                <div class="p-6 space-y-5 grow flex flex-col">
                    <div class="flex items-start justify-between gap-4">
                        <h3 class="font-bold text-white line-clamp-2 leading-snug text-lg">{{ clip.title }}</h3>
                        <button class="text-gray-600 hover:text-white transition-colors">
                            <MoreVertical class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="mt-auto pt-4 flex gap-3">
                        <button @click="openPreview(clip)"
                            class="flex-1 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-black text-xs hover:bg-gray-200 transition-all active:scale-95">
                            <ExternalLink class="w-4 h-4" /> Edit
                        </button>
                        <button @click="handleDownload(clip.clip_path, clip.title)"
                            class="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-4 rounded-xl font-black text-xs hover:bg-gray-700 transition-all active:scale-95">
                            <Download class="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isLoading && clips.length === 0"
            class="flex flex-col items-center justify-center py-40 text-center">
            <div
                class="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800">
                <Video class="w-10 h-10 text-gray-700" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No clips found</h3>
            <p class="text-gray-500 max-w-xs mx-auto">Try processing another video to generate viral highlights.</p>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="n in 4" :key="n"
                class="aspect-9/20 bg-gray-900/40 animate-pulse rounded-[2.5rem] border border-gray-800">
            </div>
        </div>

        <VideoModal :is-open="isModalOpen" :clip="selectedClip" @close="isModalOpen = false" />
    </div>
</template>

<style scoped>
/* Transisi untuk Grid Card */
.grid-enter-active,
.grid-leave-active {
    transition: all 0.5s ease;
}

.grid-enter-from,
.grid-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>