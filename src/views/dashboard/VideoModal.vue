<script setup>
import { ref, watch, onMounted } from 'vue'
import {
    X, Download, Play, Pause, Loader2,
    Volume2, VolumeX
} from 'lucide-vue-next'

const props = defineProps({
    isOpen: Boolean,
    clip: Object
})

const emit = defineEmits(['close'])

// --- VIDEO STATE ---
const videoRef = ref(null)
const isPlaying = ref(false)
const isVideoLoading = ref(true)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const hasError = ref(false)

const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
    if (!videoRef.value) return
    if (videoRef.value.paused) {
        videoRef.value.play().catch(() => {
            console.error("Playback failed. Interaction may be required.");
        });
    } else {
        videoRef.value.pause()
    }
}

const handleTimeUpdate = () => {
    if (!videoRef.value) return
    currentTime.value = videoRef.value.currentTime
    progress.value = (videoRef.value.currentTime / videoRef.value.duration) * 100
}

const handleLoadedMetadata = () => {
    duration.value = videoRef.value.duration
    isVideoLoading.value = false
    hasError.value = false
}

const handleVideoError = () => {
    isVideoLoading.value = false
    hasError.value = true
}

const seek = (e) => {
    if (!videoRef.value || isNaN(videoRef.value.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickedProgress = x / rect.width
    videoRef.value.currentTime = clickedProgress * videoRef.value.duration
}

const handleDownload = () => {
    if (props.clip?.id) {
        // Mengarahkan ke endpoint download backend yang sudah cerdas (Export/Raw)
        window.open(`http://localhost:8000/api/clips/${props.clip.id}/download`, '_blank')
    }
}

// Watcher untuk mengontrol video saat modal dibuka/tutup
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        isVideoLoading.value = true
        hasError.value = false
        progress.value = 0
    } else if (videoRef.value) {
        videoRef.value.pause()
        isPlaying.value = false
    }
})
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">

            <div class="absolute inset-0" @click="emit('close')"></div>

            <div
                class="relative w-full max-w-md bg-[#0F172A] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col z-10 shadow-2xl">

                <div class="absolute top-6 inset-x-6 flex justify-between items-center z-30 pointer-events-none">
                    <div
                        class="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 pointer-events-auto">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span class="text-[11px] font-black text-white tracking-widest uppercase">
                            AI SCORE: {{ clip?.viral_score || 0 }}
                        </span>
                    </div>
                    <button @click="emit('close')"
                        class="p-2.5 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all pointer-events-auto">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="relative aspect-9/16 bg-black overflow-hidden group">

                    <div v-if="isVideoLoading"
                        class="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                        <Loader2 class="w-10 h-10 text-emerald-500 animate-spin" />
                    </div>

                    <div v-if="hasError"
                        class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20 p-6 text-center">
                        <p class="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2">Video Unreachable</p>
                        <p class="text-gray-500 text-[10px]">Gagal memuat video dari storage. Pastikan koneksi aman.</p>
                    </div>

                    <video ref="videoRef" :key="clip?.id" :src="clip?.clip_url" playsinline loop
                        @play="isPlaying = true" @pause="isPlaying = false" @timeupdate="handleTimeUpdate"
                        @loadedmetadata="handleLoadedMetadata" @error="handleVideoError"
                        class="w-full h-full object-cover cursor-pointer" @click="togglePlay"></video>

                    <div
                        class="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent pt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                        <div class="relative h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden"
                            @click.stop="seek">
                            <div class="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                                :style="{ width: progress + '%' }"></div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <button @click.stop="togglePlay"
                                    class="text-white hover:text-emerald-500 transition-colors">
                                    <Pause v-if="isPlaying" class="w-6 h-6 fill-current" />
                                    <Play v-else class="w-6 h-6 fill-current" />
                                </button>
                                <div class="text-[11px] font-mono text-white/80 font-bold">
                                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <button @click.stop="isMuted = !isMuted; videoRef.muted = isMuted"
                                    class="text-white hover:text-emerald-400 transition-all">
                                    <VolumeX v-if="isMuted" class="w-5 h-5" />
                                    <Volume2 v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 bg-gray-900/50 border-t border-white/5 backdrop-blur-md">
                    <h3 class="text-lg font-black text-white mb-6 line-clamp-1 italic tracking-tight uppercase">
                        {{ clip?.title || 'Untitled Clip' }}
                    </h3>
                    <button @click="handleDownload"
                        class="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-xl">
                        <Download class="w-4 h-4" /> Save Video to Device
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Menghilangkan kontrol bawaan browser agar UI kustom kita bersih */
video::-webkit-media-controls {
    display: none !important;
}
</style>