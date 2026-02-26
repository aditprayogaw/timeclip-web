<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
    Play, Download, Share2, Sparkles,
    ArrowLeft, MoreVertical, ExternalLink
} from 'lucide-vue-next'
import api from '../../utils/axios'

const route = useRoute()
const videoId = route.params.id
const clips = ref([])
const isLoading = ref(true)

const fetchClips = async () => {
    try {
        // Mengambil klip dari video spesifik
        const response = await api.get(`/videos/${videoId}/clips`)
        clips.value = response.data.data
    } catch (error) {
        console.error("Gagal memuat klip:", error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchClips)
</script>

<template>
    <div class="min-h-screen bg-[#0B0F17] font-sans text-white p-8">
        <header class="flex items-center justify-between mb-12">
            <div class="flex items-center gap-6">
                <router-link to="/dashboard"
                    class="p-3 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all text-gray-400 hover:text-white">
                    <ArrowLeft class="w-5 h-5" />
                </router-link>
                <div>
                    <h1 class="text-3xl font-black tracking-tight">Your Viral Clips</h1>
                    <p class="text-gray-500 text-sm font-medium">AI successfully generated {{ clips.length }} clips from
                        your video</p>
                </div>
            </div>

            <button
                class="flex items-center gap-2 px-6 py-3 bg-timeclip-emerald text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-timeclip-emerald/10">
                <Sparkles class="w-4 h-4" /> Export All Clips
            </button>
        </header>

        <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="clip in clips" :key="clip.id"
                class="bg-gray-900/40 rounded-[2.5rem] border border-gray-800 overflow-hidden group hover:border-timeclip-emerald/50 transition-all duration-500">

                <div class="relative aspect-9/16 bg-black overflow-hidden">
                    <img :src="clip.thumbnail"
                        class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                    <div class="absolute top-6 left-6 flex flex-col items-center gap-1">
                        <div
                            class="bg-timeclip-emerald px-4 py-1.5 rounded-full text-black text-[11px] font-black shadow-2xl">
                            {{ clip.viral_score }} VIRAL SCORE
                        </div>
                    </div>

                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            class="p-5 bg-white rounded-full text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 cursor-pointer">
                            <Play class="w-8 h-8 fill-current" />
                        </div>
                    </div>
                </div>

                <div class="p-6 space-y-5">
                    <div class="flex items-start justify-between gap-4">
                        <h3 class="font-bold text-white line-clamp-2 leading-snug">{{ clip.title }}</h3>
                        <button class="text-gray-600 hover:text-white transition-colors">
                            <MoreVertical class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button
                            class="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-black text-xs hover:bg-gray-200 transition-all">
                            <ExternalLink class="w-4 h-4" /> Edit
                        </button>
                        <button
                            class="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl font-black text-xs hover:bg-gray-700 transition-all">
                            <Download class="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="n in 4" :key="n"
                class="aspect-9/22 bg-gray-900 animate-pulse rounded-[2.5rem] border border-gray-800"></div>
        </div>
    </div>
</template>