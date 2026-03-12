<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    Save, ArrowLeft, Play, Pause, Loader2, Scissors, Zap, Edit3, Type, Monitor, Smartphone
} from 'lucide-vue-next'
import api from '../../utils/axios'
import { useNotificationStore } from '../../stores/notifications'

const route = useRoute()
const router = useRouter()
const notify = useNotificationStore()
const clipId = route.params.id

// Data State
const clip = ref(null)
const segments = ref([])
const editTitle = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const previewMode = ref('mobile')

// Video Controller
const videoRef = ref(null)
const currentTime = ref(0)
const isPlaying = ref(false)

// Ambil segmen aktif untuk overlay (Subtitles)
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

        // 2. Ambil Data Subtitle Granular (Normalisasi 0.0) [cite: 191, 194]
        const subRes = await api.get(`/clips/${clipId}/subtitle`)
        if (subRes.data.data && subRes.data.data.words) {
            segments.value = subRes.data.data.words

            // LOGIC CHECK: Jika words kosong dari DB, beri notifikasi
            if (segments.value.length === 0) {
                notify.show('Transkrip kosong di database. Mohon re-render klip ini.', 'warning')
            }
        }
    } catch (error) {
        notify.show('Gagal memuat workspace editor', 'error')
    } finally {
        isLoading.value = false
    }
}

const handleSave = async () => {
    if (segments.value.length === 0) {
        notify.show('Tidak bisa menyimpan transkrip kosong.', 'error')
        return
    }

    isSaving.value = true
    try {
        const payload = {
            title: editTitle.value,
            full_text: segments.value.map(s => s.word || s.text).join(' '), // Sesuaikan key 'word' dari DB
            words: segments.value // Mengirim array untuk re-render FFmpeg [cite: 197]
        }

        await api.put(`/clips/${clipId}/subtitle`, payload)
        notify.show('Perubahan disimpan! Video sedang di-render ulang...', 'success')

        // Redirect setelah simpan agar user bisa melihat status rendering di gallery
        setTimeout(() => router.push('/dashboard/clips'), 2000)
    } catch (error) {
        notify.show('Gagal menyimpan perubahan subtitle', 'error')
    } finally {
        isSaving.value = false
    }
}

const seekTo = (time) => {
    if (videoRef.value) {
        videoRef.value.currentTime = time
        videoRef.value.play()
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
    seekTo(newTime)
}

onMounted(fetchClipData)
</script>

<template>
    <div class="h-screen w-full bg-[#05070A] text-white flex flex-col overflow-hidden font-sans">
        <div v-if="isLoading"
            class="absolute inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <Loader2 class="w-12 h-12 text-timeclip-emerald animate-spin" />
                <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500">Loading Workspace...</p>
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
                    <span class="text-[9px] font-black text-timeclip-emerald uppercase tracking-[0.2em]">Editor Klip
                        AI</span>
                    <input v-model="editTitle"
                        class="bg-transparent border-none outline-none text-sm font-bold text-white w-96 focus:text-timeclip-emerald transition-all" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button @click="handleSave" :disabled="isSaving"
                    class="bg-timeclip-emerald text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-timeclip-emerald/10 disabled:opacity-50">
                    <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                    <Save v-else class="w-4 h-4" /> Save & Re-render
                </button>
            </div>
        </header>

        <main class="flex-1 flex overflow-hidden">
            <aside class="w-16 border-r border-white/5 bg-[#0B0F17] flex flex-col items-center py-6 gap-6">
                <button
                    class="p-3 rounded-xl bg-timeclip-emerald/10 text-timeclip-emerald border border-timeclip-emerald/20">
                    <Scissors class="w-5 h-5" />
                </button>
                <button class="p-3 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                    <Type class="w-5 h-5" />
                </button>
            </aside>

            <div class="flex-1 flex flex-col overflow-hidden">
                <div class="flex-1 flex overflow-hidden">
                    <div class="flex-1 flex items-center justify-center p-12 bg-black/20 relative">
                        <div
                            :class="['relative transition-all duration-500 bg-black border border-white/10 overflow-hidden group shadow-2xl',
                                previewMode === 'mobile' ? 'w-full max-w-[320px] aspect-9/16 rounded-[2.5rem]' : 'w-full max-w-175 aspect-video rounded-2xl']">

                            <video ref="videoRef"
                                :src="`https://sjladpjqerjvlzuusfri.storage.supabase.co/storage/v1/object/public/timeclip/clips/clip_${clipId}.mp4`"
                                @timeupdate="updateCurrentTime" class="w-full h-full object-cover"
                                @play="isPlaying = true" @pause="isPlaying = false"></video>

                            <div class="absolute bottom-20 inset-x-6 text-center z-10 pointer-events-none">
                                <transition name="fade" mode="out-in">
                                    <p :key="activeSegment?.start" v-if="activeSegment"
                                        class="inline-block bg-black/90 text-white px-4 py-2 rounded-xl text-[13px] font-black border border-white/20 uppercase shadow-2xl">
                                        {{ activeSegment.word || activeSegment.text }}
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

                    <div class="w-87 border-l border-white/5 bg-[#0B0F17]/50 flex flex-col overflow-hidden">
                        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0B0F17]">
                            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">Timeline
                                Words</h3>
                            <span class="text-[10px] font-black text-timeclip-emerald">{{ segments.length }}</span>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            <div v-for="(s, index) in segments" :key="index" @click="seekTo(s.start)"
                                :class="['p-4 rounded-xl border transition-all cursor-pointer group',
                                    currentTime >= s.start && currentTime <= s.end ? 'bg-timeclip-emerald/10 border-timeclip-emerald/30' : 'bg-white/5 border-transparent hover:border-white/10']">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[9px] font-black text-gray-500">{{ s.start.toFixed(2) }}s</span>
                                    <div v-if="currentTime >= s.start && currentTime <= s.end"
                                        class="w-1.5 h-1.5 rounded-full bg-timeclip-emerald shadow-[0_0_8px_#10b981]">
                                    </div>
                                </div>
                                <input v-model="s.word"
                                    class="w-full bg-transparent border-none outline-none text-[13px] font-bold text-gray-400 group-hover:text-white focus:text-timeclip-emerald transition-colors p-0"
                                    @click.stop />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-40 border-t border-white/5 bg-[#0B0F17] flex flex-col">
                    <div
                        class="h-10 px-6 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500 uppercase">
                        <div class="flex gap-4">
                            <button @click="isPlaying ? videoRef.pause() : videoRef.play()"
                                class="text-timeclip-emerald">
                                <Pause v-if="isPlaying" class="w-4 h-4" />
                                <Play v-else class="w-4 h-4" />
                            </button>
                            <span>{{ currentTime.toFixed(2) }}s / {{ videoRef?.duration?.toFixed(2) || '0.00' }}s</span>
                        </div>
                        <div class="flex gap-4">
                            <button @click="previewMode = 'mobile'"
                                :class="previewMode === 'mobile' ? 'text-timeclip-emerald' : ''">
                                <Smartphone class="w-4 h-4" />
                            </button>
                            <button @click="previewMode = 'desktop'"
                                :class="previewMode === 'desktop' ? 'text-timeclip-emerald' : ''">
                                <Monitor class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 px-8 flex items-center">
                        <div class="relative h-12 w-full bg-gray-900/50 rounded-xl border border-white/5 cursor-pointer overflow-hidden"
                            @mousedown="scrubVideo">
                            <div class="absolute top-0 bottom-0 left-0 bg-timeclip-emerald/10 border-r border-timeclip-emerald/40"
                                :style="{ width: (currentTime / (videoRef?.duration || 1) * 100) + '%' }"></div>
                            <div class="absolute top-0 bottom-0 w-0.5 bg-timeclip-emerald z-20"
                                :style="{ left: (currentTime / (videoRef?.duration || 1) * 100) + '%' }">
                                <div class="absolute -top-1 -left-1 w-2.5 h-2.5 bg-timeclip-emerald rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>