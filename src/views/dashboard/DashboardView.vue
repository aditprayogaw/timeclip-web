<script setup>
import { ref } from 'vue'
import {
    Home, LayoutGrid, FolderOpen, Calendar, BarChart2,
    UserPlus, CreditCard, BookOpen, HelpCircle, LogOut,
    Link as LinkIcon, Upload, Cloud
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const videoUrl = ref('')
</script>

<template>
    <div class="flex h-screen w-full overflow-hidden bg-[#0B0F17] pt-10">
        <aside class="w-64 border-r border-gray-800 flex flex-col p-4 bg-[#0B0F17]">
            <div class="mb-8 px-2">
                <a href="/">
                    <img src="/TimeCHoriC.png" alt="Logo" class="h-12" />
                </a>
            </div>

            <nav class="flex-1 space-y-1">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2 mb-2">Create</p>
                <a href="#"
                    class="flex items-center gap-3 px-3 py-2 text-white bg-gray-800 rounded-xl text-sm font-bold">
                    <Home class="w-4 h-4" /> Home
                </a>
                <a href="#"
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
                </a>
            </nav>

            <div class="border-t border-gray-800 pt-4 space-y-1">
                <div
                    class="px-3 py-4 bg-linear-to-br from-timeclip-emerald/20 to-transparent rounded-2xl border border-timeclip-emerald/10 mb-4">
                    <p class="text-xs text-timeclip-emerald font-black uppercase tracking-widest mb-1">{{
                        authStore.userCredits }} Credits</p>
                    <button
                        class="text-[10px] bg-timeclip-emerald text-white px-3 py-1 rounded-lg font-bold">Upgrade</button>
                </div>
                <button @click="authStore.logout()"
                    class="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-400/10 w-full rounded-xl text-sm font-bold transition-all">
                    <LogOut class="w-4 h-4" /> Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div
                class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <h1 class="text-[20vw] font-black uppercase italic">TimeClip</h1>
            </div>

            <div class="w-full max-w-2xl z-10">
                <div class="bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
                    <div class="relative group">
                        <LinkIcon
                            class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-timeclip-emerald transition-colors" />
                        <input v-model="videoUrl" type="text" placeholder="Drop a YouTube or Twitch link"
                            class="w-full bg-[#161B26] border border-gray-700 text-white pl-16 pr-6 py-6 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all text-lg font-medium" />
                    </div>

                    <div class="flex items-center justify-center gap-8 mt-6">
                        <button
                            class="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold">
                            <Upload class="w-4 h-4" /> Upload
                        </button>
                        <button
                            class="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold">
                            <Cloud class="w-4 h-4" /> Google Drive
                        </button>
                    </div>

                    <button
                        class="w-full mt-8 bg-white text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5">
                        Get clips in 1 click
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