<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Save, ArrowLeft, Play, Pause, Loader2,
    Monitor, Smartphone, Zap, MessageSquare
} from 'lucide-vue-next'
import api from '../../utils/axios'
import { useNotificationStore } from '../../stores/notifications'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()
const clipId = route.params.id

// --- STATE DATA ---
const clip = ref(null)
const editTitle = ref('')
const editFullText = ref('')
const words = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const previewMode = ref('mobile')

// --- VIDEO CONTROLLER ---
const videoRef = ref(null)
const currentTime = ref(0)
const isPlaying = ref(false)

/**
 * AUTO-SYNC: Update full_text setiap kali ada kata yang diubah
 */
watch(words, (newWords) => {
    editFullText.value = newWords.map(w => w.word).join(' ')
}, { deep: true })

/**
 * HIGHLIGHT LOGIC: Kata yang sedang aktif berdasarkan waktu video
 */
const activeWordIndex = computed(() => {
    return words.value.findIndex(w =>
        currentTime.value >= w.start && currentTime.value <= w.end
    )
})

/**
 * Kata aktif untuk subtitle overlay preview
 */
const activeWord = computed(() => {
    if (activeWordIndex.value === -1) return null
    return words.value[activeWordIndex.value]
})

/**
 * FETCH DATA
 */
const fetchClipData = async () => {
    isLoading.value = true
    try {
        const clipRes = await api.get(`/clips/${clipId}`)
        clip.value = clipRes.data.data
        editTitle.value = clip.value?.title || ''

        const subRes = await api.get(`/clips/${clipId}/subtitle`)
        if (subRes.data.data) {
            words.value = subRes.data.data.words || []
            editFullText.value = subRes.data.data.full_text || ''
        }
    } catch (error) {
        notify.show('Gagal memuat data klip', 'error')
    } finally {
        isLoading.value = false
    }
}

/**
 * SAVE
 */
const handleSave = async () => {
    if (words.value.length === 0) {
        notify.show('Teks subtitle tidak boleh kosong.', 'error')
        return
    }

    isSaving.value = true
    try {
        await api.put(`/clips/${clipId}`, { title: editTitle.value })

        const currentFullText = words.value.map(w => w.word).join(' ')
        await api.put(`/clips/${clipId}/subtitle`, {
            full_text: currentFullText,
            words: words.value
        })

        await api.post(`/clips/${clipId}/export`)

        notify.show('Perubahan disimpan! AI sedang merender video...', 'success')
        setTimeout(() => router.push('/dashboard'), 2000)

    } catch (error) {
        const msg = error.response?.data?.message || 'Gagal menyimpan'
        notify.show(msg, 'error')
    } finally {
        isSaving.value = false
    }
}

const updateCurrentTime = () => {
    if (videoRef.value) currentTime.value = videoRef.value.currentTime
}

const seekToWord = (startTime) => {
    if (videoRef.value) {
        videoRef.value.currentTime = startTime
        videoRef.value.play()
    }
}

const scrubVideo = (e) => {
    if (!videoRef.value || isNaN(videoRef.value.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    videoRef.value.currentTime = (x / rect.width) * videoRef.value.duration
}

onMounted(fetchClipData)
</script>

<template>
    <div class="h-screen w-full bg-[#05070A] text-white flex flex-col overflow-hidden font-sans">

        <!-- Loading Overlay -->
        <div v-if="isLoading"
            class="absolute inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <Loader2 class="w-12 h-12 text-emerald-500 animate-spin" />
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Syncing Metadata...</p>
            </div>
        </div>

        <!-- Header -->
        <header
            class="h-16 px-6 border-b border-white/5 bg-[#0B0F17]/80 backdrop-blur-md flex items-center justify-between z-50 shrink-0">
            <div class="flex items-center gap-6">
                <button @click="router.back()"
                    class="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-all">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <div class="flex flex-col">
                    <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Clip Workspace</span>
                    <input v-model="editTitle"
                        class="bg-transparent border-none outline-none text-sm font-medium text-white w-96 focus:text-emerald-400" />
                </div>
            </div>

            <button @click="handleSave" :disabled="isSaving"
                class="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-lg">
                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                <Save v-else class="w-4 h-4" />
                Save & Re-render
            </button>
        </header>

        <!-- Main Content -->
        <main class="flex-1 flex overflow-hidden min-h-0">

            <!-- Left: Video Preview -->
            <div class="flex-1 flex flex-col bg-black/20 min-w-0">
                <div class="flex-1 flex items-center justify-center p-8 min-h-0">
                    <div :class="[
                        'relative transition-all duration-500 bg-black border border-white/10 overflow-hidden shadow-2xl',
                        previewMode === 'mobile'
                            ? 'w-full max-w-70 aspect-9/16 rounded-[2.5rem]'
                            : 'w-full max-w-2xl aspect-video rounded-2xl'
                    ]">
                        <!-- Video -->
                        <video
                            ref="videoRef"
                            :src="`http://localhost:8000/api/clips/${clipId}/stream?raw=1`"
                            @timeupdate="updateCurrentTime"
                            @play="isPlaying = true"
                            @pause="isPlaying = false"
                            class="w-full h-full object-cover">
                        </video>

                        <!-- Subtitle Overlay -->
                        <Transition name="subtitle-pop">
                            <div
                                v-if="activeWord"
                                class="absolute inset-x-0 bottom-[35%] flex items-center justify-center pointer-events-none px-6">
                                <span
                                    class="text-white font-bold uppercase text-center leading-none select-none"
                                    :style="{
                                        fontSize: previewMode === 'mobile' ? '1.35rem' : '1.9rem',
                                        textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 4px 8px rgba(0,0,0,0.9)',
                                        letterSpacing: '0.03em',
                                        paintOrder: 'stroke fill',
                                    }">
                                    {{ activeWord.word }}
                                </span>
                            </div>
                        </Transition>

                        <!-- Play/Pause Overlay -->
                        <div
                            @click="isPlaying ? videoRef.pause() : videoRef.play()"
                            class="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <div class="p-5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                <Pause v-if="isPlaying" class="w-8 h-8 fill-current text-white" />
                                <Play v-else class="w-8 h-8 fill-current text-white ml-1" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline / Scrubber -->
                <div class="h-24 px-8 border-t border-white/5 bg-[#0B0F17] flex flex-col justify-center gap-2 shrink-0">
                    <div class="flex justify-between text-[10px] font-mono text-gray-500">
                        <span>{{ currentTime.toFixed(2) }}s</span>
                        <div class="flex gap-4">
                            <Smartphone
                                @click="previewMode = 'mobile'"
                                :class="previewMode === 'mobile' ? 'text-emerald-500' : 'text-gray-600'"
                                class="w-4 h-4 cursor-pointer hover:text-emerald-400 transition-colors" />
                            <Monitor
                                @click="previewMode = 'desktop'"
                                :class="previewMode === 'desktop' ? 'text-emerald-500' : 'text-gray-600'"
                                class="w-4 h-4 cursor-pointer hover:text-emerald-400 transition-colors" />
                        </div>
                        <span>{{ videoRef?.duration?.toFixed(2) || '0.00' }}s</span>
                    </div>
                    <div
                        class="relative h-1.5 w-full bg-gray-900 rounded-full overflow-hidden cursor-pointer"
                        @mousedown="scrubVideo">
                        <div
                            class="absolute top-0 left-0 h-full bg-emerald-500 transition-none"
                            :style="{ width: (currentTime / (videoRef?.duration || 1) * 100) + '%' }">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Subtitle Editor -->
            <div class="w-120 border-l border-white/5 bg-[#0B0F17]/50 flex flex-col overflow-hidden shrink-0">

                <!-- Panel Header -->
                <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0B0F17] shrink-0">
                    <div class="flex flex-col gap-1">
                        <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                            <MessageSquare class="w-3 h-3" /> Smart Transcription Editor
                        </h3>
                        <span class="text-[9px] text-slate-600 font-medium italic">
                            Click any word to sync video & edit
                        </span>
                    </div>
                    <!-- Word count badge -->
                    <span class="text-[9px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                        {{ words.length }} words
                    </span>
                </div>

                <!-- Words Editor -->
                <div class="flex-1 p-8 overflow-y-auto no-scrollbar bg-black/20">
                    <div class="flex flex-wrap items-start gap-x-1.5 gap-y-4 leading-relaxed text-left">
                        <div
                            v-for="(w, index) in words"
                            :key="index"
                            class="relative group inline-flex items-center">

                            <input
                                v-model="w.word"
                                @focus="seekToWord(w.start)"
                                :class="[
                                    'bg-transparent border-b-2 border-transparent text-[15px] font-medium transition-all outline-none py-0.5 px-0.5',
                                    activeWordIndex === index
                                        ? 'text-emerald-400 border-emerald-500 bg-emerald-500/10 rounded-sm'
                                        : 'text-slate-300 hover:text-white hover:border-white/20'
                                ]"
                                :style="{ width: Math.max(w.word.length + 0.5, 2) + 'ch' }" />

                            <!-- Timestamp tooltip -->
                            <span
                                class="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-800 text-[8px] text-slate-400 rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none font-mono z-10 border border-white/5 whitespace-nowrap">
                                {{ w.start.toFixed(2) }}s – {{ w.end.toFixed(2) }}s
                            </span>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="words.length === 0"
                        class="h-full flex flex-col items-center justify-center opacity-20 py-20">
                        <Loader2 class="w-8 h-8 animate-spin mb-4" />
                        <p class="text-[10px] uppercase tracking-widest">Processing Audio Segments...</p>
                    </div>
                </div>

                <!-- Footer Info -->
                <div class="p-5 border-t border-white/5 mx-4 mb-4 rounded-2xl bg-white/2 shrink-0">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                            <Zap class="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="text-[10px] text-slate-300 font-bold uppercase tracking-tight">
                                AI Synchronization Active
                            </p>
                            <p class="text-[10px] text-slate-500 leading-normal">
                                Setiap kata terikat pada timestamp audio asli. Mengubah teks tidak akan merusak sinkronisasi gerakan bibir di video.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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
input {
    transition: width 0.1s ease-out;
}

/* Subtitle pop animation */
.subtitle-pop-enter-active {
    transition: opacity 0.07s ease-out, transform 0.07s ease-out;
}
.subtitle-pop-leave-active {
    transition: opacity 0.05s ease-in, transform 0.05s ease-in;
}
.subtitle-pop-enter-from {
    opacity: 0;
    transform: scale(0.88);
}
.subtitle-pop-leave-to {
    opacity: 0;
    transform: scale(1.06);
}
</style>