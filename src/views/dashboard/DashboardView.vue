<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    Home, LayoutGrid, FolderOpen, Calendar, LogOut,
    Link as LinkIcon, Upload, Cloud, Loader2
} from 'lucide-vue-next'
import { useNotificationStore } from '../../stores/notifications'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios' 

const router = useRouter()
const notify = useNotificationStore()
const authStore = useAuthStore()

const videoUrl = ref('')
const isLoading = ref(false)

const handleLogout = () => {
    authStore.logout()
    notify.show('Logged out successfully', 'success')
    router.push('/login')
}

// Fungsi Utama untuk Memproses Video
const handleProcessVideo = async () => {
    if (!videoUrl.value) {
        notify.show('Please paste a YouTube or Twitch link first', 'error')
        return
    }

    isLoading.value = true
    try {
        // Mengirim URL ke endpoint Laravel
        const response = await api.post('/videos/process', {
            url: videoUrl.value
        })

        notify.show('Video processing started!', 'success')

        router.push(`/dashboard/process/${response.data.data.id}`)
    } catch (error) {
        // Error 422 atau Kredit Habis akan ditangani oleh Interceptor Axios kamu
        console.error('Processing error:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="flex h-screen w-full overflow-hidden bg-[#0B0F17] font-sans">
        <aside class="w-64 border-r border-gray-800 flex flex-col p-4 bg-[#0B0F17] shrink-0">
            <div class="mb-8 px-2">
                <router-link to="/">
                    <img src="/TimeCHoriC.png" alt="Logo" class="h-12" />
                </router-link>
            </div>

            <nav class="flex-1 space-y-1">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2 mb-2">Create</p>
                <a href="#"
                    class="flex items-center gap-3 px-3 py-2 text-white bg-gray-800 rounded-xl text-sm font-bold">
                    <Home class="w-4 h-4" /> Home
                </a>
                <!-- <a href="#"
                    class="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-white transition-all text-sm font-bold">
                    <LayoutGrid class="w-4 h-4" /> Brand template
                </a>
                <a href="#"
                    class="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-white transition-all text-sm font-bold">
                    <FolderOpen class="w-4 h-4" /> Asset library
                </a>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2 mt-6 mb-2">Post</p>
                <a href="#"
                    class="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-white transition-all text-sm font-bold">
                    <Calendar class="w-4 h-4" /> Calendar
                </a> -->
            </nav>

            <div class="border-t border-gray-800 pt-4 space-y-1">
                <div
                    class="px-3 py-4 bg-linear-to-br from-timeclip-emerald/20 to-transparent rounded-2xl border border-timeclip-emerald/10 mb-4">
                    <p class="text-xs text-timeclip-emerald font-black uppercase tracking-widest mb-1">
                        {{ authStore.user?.remaining_credits || 0 }} Credits
                    </p>
                    <button
                        class="text-[10px] bg-timeclip-emerald text-white px-3 py-1 rounded-lg font-bold hover:bg-emerald-400 transition-colors">
                        Upgrade
                    </button>
                </div>
                <button @click="handleLogout"
                    class="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-400/10 w-full rounded-xl text-sm font-bold transition-all">
                    <LogOut class="w-4 h-4" /> Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div
                class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <h1 class="text-[20vw] font-black uppercase italic tracking-tighter">TimeClip</h1>
            </div>

            <div class="w-full max-w-2xl z-10">
                <div class="bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
                    <div class="relative group">
                        <LinkIcon
                            class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-timeclip-emerald transition-colors" />
                        <input v-model="videoUrl" type="text" :disabled="isLoading"
                            placeholder="Drop a YouTube or Twitch link"
                            class="w-full bg-[#161B26] border border-gray-700 text-white pl-16 pr-6 py-6 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all text-lg font-medium placeholder:text-gray-600 disabled:opacity-50" />
                    </div>

                    <div class="flex items-center justify-center gap-8 mt-6">
                        <button
                            class="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold disabled:opacity-50"
                            :disabled="isLoading">
                            <Upload class="w-4 h-4" /> Upload
                        </button>
                        <button
                            class="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold disabled:opacity-50"
                            :disabled="isLoading">
                            <Cloud class="w-4 h-4" /> Google Drive
                        </button>
                    </div>

                    <button @click="handleProcessVideo" :disabled="isLoading"
                        class="w-full mt-8 bg-white text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100">
                        <Loader2 v-if="isLoading" class="w-6 h-6 animate-spin" />
                        <span>{{ isLoading ? 'Processing AI...' : 'Get clips in 1 click' }}</span>
                    </button>
                </div>

                <div class="flex justify-center gap-10 mt-12">
                    <div v-for="item in ['AI Captions', 'Auto Reframe', 'Smart B-Roll']" :key="item"
                        class="flex flex-col items-center gap-2">
                        <div
                            class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 border border-gray-700">
                            <div class="w-5 h-5 bg-current rounded-sm opacity-20"></div>
                        </div>
                        <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ item }}</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>