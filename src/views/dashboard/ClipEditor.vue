<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Save, ArrowLeft, Play, Pause, Loader2, Scissors, Type,
    Monitor, Smartphone, Trash2
} from 'lucide-vue-next'
import api from '../../utils/axios'
import { useNotificationStore } from '../../stores/notifications'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()
const clipId = route.params.id

// --- STATE DATA ---
const clip = ref(null)
const segments = ref([])
const editTitle = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const previewMode = ref('mobile')

// --- VIDEO CONTROLLER ---
const videoRef = ref(null)
const currentTime = ref(0)
const isPlaying = ref(false)

// Ambil segmen aktif untuk overlay Subtitle di Preview
const activeSegment = computed(() => {
    return segments.value.find(s => currentTime.value >= s.start && currentTime.value <= s.end)
})

const fetchClipData = async () => {
    isLoading.value = true
    try {
        // 1. Ambil Data Dasar Klip
        const clipRes = await api.get(`/clips/${clipId}`)
        clip.value = clipRes.data.data
        editTitle.value = clip.value?.title || ''

        // 2. Ambil Data Subtitle Granular
        const subRes = await api.get(`/clips/${clipId}/subtitle`)
        if (subRes.data.data && subRes.data.data.words) {
            segments.value = subRes.data.data.words
        }
    } catch (error) {
        notify.show('Gagal memuat workspace editor', 'error')
    } finally {
        isLoading.value = false
    }
}

// FUNGSI: Hapus Kata dari Timeline
const removeWord = (index) => {
    segments.value.splice(index, 1)
    notify.show('Kata berhasil dihapus', 'success')
}

// FUNGSI: Simpan dan Trigger Re-render Backend
const handleSave = async () => {
    if (segments.value.length === 0) {
        notify.show('Transkrip tidak boleh kosong.', 'error')
        return
    }

    isSaving.value = true
    try {
        // Rakit payload: gabungkan kata menjadi full_text dan sertakan array words
        const payload = {
            title: editTitle.value,
            full_text: segments.value.map(s => s.word).join(' '),
            words: segments.value.map(s => ({
                word: s.word,
                start: s.start,
                end: s.end
            }))
        }

        // Kirim ke backend (memicu proses rendering FFmpeg)
        await api.put(`/clips/${clipId}/subtitle`, payload)

        notify.show('Perubahan disimpan! Video sedang di-render ulang...', 'success')

        // Kembalikan ke dashboard untuk memantau progres rendering
        setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
        notify.show('Gagal menyimpan perubahan', 'error')
    } finally {
        isSaving.value = false
    }
}

const seekTo = (time) => {
    if (videoRef.value) {
        videoRef.value.currentTime = time
        if (!isPlaying.value) videoRef.value.play()
    }
}

const updateCurrentTime = () => {
    if (videoRef.value) currentTime.value = videoRef.value.currentTime
}

const scrubVideo = (e) => {
    if (!videoRef.value || isNaN(videoRef.value.duration)) return
    const timeline = e.currentTarget
    const rect = timeline.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newTime = (x / rect.width) * videoRef.value.duration
    videoRef.value.currentTime = newTime
}

onMounted(fetchClipData)
</script>

<template>
    <div class="h-screen w-full bg-[#05070A] text-white flex flex-col overflow-hidden font-sans">
        <div v-if="isLoading"
            class="absolute inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <Loader2 class="w-12 h-12 text-emerald-500 animate-spin" />
                <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500">Syncing AI Workspace...</p>
            </div>
        </div>

        <header
            class="h-16 px-6 border-b border-white/5 bg-[#0B0F17]/80 backdrop-blur-md flex items-center justify-between z-50">
            <div class="flex items-center gap-6">
                <button @click="router.back()"
                    class="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <div class="flex flex-col">
                    <span class="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Subtitle
                        Editor</span>
                    <input v-model="editTitle" placeholder="Clip Title"
                        class="bg-transparent border-none outline-none text-sm font-bold text-white w-96 focus:text-emerald-400 transition-all" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button @click="handleSave" :disabled="isSaving"
                    class="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50">
                    <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                    <Save v-else class="w-4 h-4" /> Save & Re-render
                </button>
            </div>
        </header>

        <main class="flex-1 flex overflow-hidden">
            <aside class="w-16 border-r border-white/5 bg-[#0B0F17] flex flex-col items-center py-6 gap-6">
                <button class="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Type class="w-5 h-5" />
                </button>
                <button class="p-3 rounded-xl text-gray-600 hover:text-white transition-all cursor-not-allowed">
                    <Scissors class="w-5 h-5" />
                </button>
            </aside>

            <div class="flex-1 flex flex-col overflow-hidden">
                <div class="flex-1 flex overflow-hidden">
                    <div class="flex-1 flex items-center justify-center p-12 bg-black/20 relative">
                        <div
                            :class="['relative transition-all duration-500 bg-black border border-white/10 overflow-hidden group shadow-2xl',
                                previewMode === 'mobile' ? 'w-full max-w-[320px] aspect-9/16 rounded-[2.5rem]' : 'w-full max-w-160 aspect-video rounded-2xl']">

                            <video ref="videoRef" :src="`http://localhost:8000/api/clips/${clipId}/stream`"
                                @timeupdate="updateCurrentTime" class="w-full h-full object-cover"
                                @play="isPlaying = true" @pause="isPlaying = false"></video>

                            <div class="absolute bottom-20 inset-x-6 text-center z-10 pointer-events-none">
                                <transition name="fade" mode="out-in">
                                    <p :key="activeSegment?.start" v-if="activeSegment"
                                        class="inline-block bg-emerald-500 text-black px-4 py-2 rounded-lg text-[14px] font-black uppercase shadow-2xl mx-2">
                                        {{ activeSegment.word }}
                                    </p>
                                </transition>
                            </div>

                            <div @click="isPlaying ? videoRef.pause() : videoRef.play()"
                                class="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <div class="p-5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                    <Pause v-if="isPlaying" class="w-8 h-8 fill-current" />
                                    <Play v-else class="w-8 h-8 fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-80 border-l border-white/5 bg-[#0B0F17]/50 flex flex-col overflow-hidden">
                        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0B0F17]">
                            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Timeline Words
                            </h3>
                            <span class="text-[10px] font-black text-emerald-500">{{ segments.length }} Words</span>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            <div v-for="(s, index) in segments" :key="index"
                                :class="['p-4 rounded-xl border transition-all flex flex-col gap-2 group',
                                    currentTime >= s.start && currentTime <= s.end ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-transparent hover:border-white/10']">
                                <div class="flex items-center justify-between">
                                    <span class="text-[9px] font-black text-gray-500">{{ s.start.toFixed(2) }}s</span>
                                    <button @click.stop="removeWord(index)"
                                        class="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-rose-500 transition-all">
                                        <Trash2 class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <input v-model="s.word" @click="seekTo(s.start)"
                                    class="w-full bg-transparent border-none outline-none text-[13px] font-bold text-gray-400 group-hover:text-white focus:text-emerald-400 transition-colors p-0" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-32 border-t border-white/5 bg-[#0B0F17] flex flex-col">
                    <div
                        class="h-10 px-6 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500 uppercase">
                        <div class="flex gap-4">
                            <button @click="isPlaying ? videoRef.pause() : videoRef.play()" class="text-emerald-500">
                                <Pause v-if="isPlaying" class="w-4 h-4" />
                                <Play v-else class="w-4 h-4" />
                            </button>
                            <span>{{ currentTime.toFixed(2) }}s / {{ videoRef?.duration?.toFixed(2) || '0.00' }}s</span>
                        </div>
                        <div class="flex gap-4">
                            <button @click="previewMode = 'mobile'"
                                :class="previewMode === 'mobile' ? 'text-emerald-500' : ''">
                                <Smartphone class="w-4 h-4" />
                            </button>
                            <button @click="previewMode = 'desktop'"
                                :class="previewMode === 'desktop' ? 'text-emerald-500' : ''">
                                <Monitor class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 px-8 flex items-center">
                        <div class="relative h-8 w-full bg-gray-900/50 rounded-lg border border-white/5 cursor-pointer overflow-hidden"
                            @mousedown="scrubVideo">
                            <div class="absolute top-0 bottom-0 left-0 bg-emerald-500/10 border-r border-emerald-500/40"
                                :style="{ width: (currentTime / (videoRef?.duration || 1) * 100) + '%' }"></div>
                            <div class="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-20"
                                :style="{ left: (currentTime / (videoRef?.duration || 1) * 100) + '%' }">
                                <div
                                    class="absolute -top-1 -left-1 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]">
                                </div>
                            </div>
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>