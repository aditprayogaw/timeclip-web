<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
    X, Download, Play, Pause, Loader2,
    Volume2, VolumeX, Maximize
} from 'lucide-vue-next'

const props = defineProps({
    isOpen: Boolean,
    clip: Object
})

const emit = defineEmits(['close'])

const videoRef = ref(null)
const isPlaying = ref(false)
const isVideoLoading = ref(true)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
    if (!videoRef.value) return
    videoRef.value.paused ? videoRef.value.play() : videoRef.value.pause()
}

const handleTimeUpdate = () => {
    if (!videoRef.value) return
    currentTime.value = videoRef.value.currentTime
    progress.value = (videoRef.value.currentTime / videoRef.value.duration) * 100
}

const handleLoadedMetadata = () => {
    duration.value = videoRef.value.duration
    isVideoLoading.value = false
}

const seek = (e) => {
    if (!videoRef.value) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickedProgress = x / rect.width
    videoRef.value.currentTime = clickedProgress * videoRef.value.duration
}

const handleDownload = () => {
    if (props.clip?.id) {
        // Redirect 302 ke storage via backend [cite: 178, 179]
        window.open(`http://localhost:8000/api/clips/${props.clip.id}/download`, '_blank')
    }
}

watch(() => props.isOpen, (newVal) => {
    if (!newVal && videoRef.value) {
        videoRef.value.pause()
        isPlaying.value = false
    }
    if (newVal) {
        isVideoLoading.value = true
        progress.value = 0
    }
})
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div class="absolute inset-0" @click="emit('close')"></div>

            <div
                class="relative w-full max-w-md bg-[#0F172A] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col z-10">
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

                    <video ref="videoRef" :key="props.clip?.id" playsinline loop @play="isPlaying = true"
                        @pause="isPlaying = false" @timeupdate="handleTimeUpdate" @loadedmetadata="handleLoadedMetadata"
                        class="w-full h-full object-cover cursor-pointer" @click="togglePlay">
                        <source :src="props.clip?.clip_url" type="video/mp4">
                    </video>

                    <div
                        class="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/90 to-transparent pt-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="relative h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden"
                            @click.stop="seek">
                            <div class="absolute top-0 left-0 h-full bg-emerald-500" :style="{ width: progress + '%' }">
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <button @click.stop="togglePlay"
                                    class="text-white hover:text-emerald-500 transition-colors">
                                    <Pause v-if="isPlaying" class="w-6 h-6 fill-current" />
                                    <Play v-else class="w-6 h-6 fill-current" />
                                </button>
                                <div class="text-[11px] font-mono text-white/80">
                                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <button @click.stop="isMuted = !isMuted; videoRef.muted = isMuted" class="text-white">
                                    <VolumeX v-if="isMuted" class="w-5 h-5" />
                                    <Volume2 v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 bg-gray-900/50 border-t border-white/5">
                    <h3 class="text-lg font-bold text-white mb-6 line-clamp-1 italic tracking-tight">
                        {{ clip?.title || 'Untitled Clip' }}
                    </h3>
                    <button @click="handleDownload"
                        class="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                        <Download class="w-4 h-4" /> Save Video
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

video::-webkit-media-controls {
    display: none !important;
}
</style>