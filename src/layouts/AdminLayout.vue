<script setup>
import { LayoutDashboard, Users, CreditCard, LogOut, ChevronRight, Zap, Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
}
</script>

<template>
    <div class="flex h-screen bg-[#0A0C12] text-slate-300 font-sans">

        <aside class="w-64 bg-[#0E1118] border-r border-white/5 flex flex-col shrink-0">
            <div class="p-8">
                <a href="/dashboard" class="flex items-center gap-3">
                    <img src="/TimeCHoriC.png" alt="Logo" class="h-10 opacity-90" />
                </a>
                <div
                    class="mt-2 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <Sparkles class="w-2.5 h-2.5 text-emerald-400" />
                    <span class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Admin Control</span>
                </div>
            </div>

            <nav class="flex-1 px-4 space-y-1.5 mt-4">
                <p class="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Management</p>

                <router-link to="/admin/dashboard"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
                    active-class="bg-white/5 text-emerald-400 border border-white/5 shadow-lg shadow-black/20">
                    <LayoutDashboard class="w-4 h-4" /> Dashboard
                </router-link>

                <router-link to="/admin/transactions"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
                    active-class="bg-white/5 text-emerald-400 border border-white/5 shadow-lg shadow-black/20">
                    <CreditCard class="w-4 h-4" /> Marketing & Rev
                </router-link>

                <router-link to="/admin/users"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
                    active-class="bg-white/5 text-emerald-400 border border-white/5 shadow-lg shadow-black/20">
                    <Users class="w-4 h-4" /> User Management
                </router-link>
            </nav>

            <div class="p-6 border-t border-white/5">
                <button @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-rose-400 transition-all text-xs font-bold uppercase tracking-widest">
                    <LogOut class="w-4 h-4" /> Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col overflow-hidden">
            <header
                class="h-16 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-[#0A0C12]/80 backdrop-blur-md">
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                    System
                    <ChevronRight class="w-3 h-3 text-slate-700" /> <span class="text-emerald-400">{{ $route.name
                        }}</span>
                </div>

                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="text-sm font-bold text-white leading-none">{{ authStore.user?.name || 'Admin' }}</p>
                        <span
                            class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 inline-block">Authorized
                            Access</span>
                    </div>
                    <div
                        class="w-10 h-10 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 font-bold shadow-xl">
                        AD
                    </div>
                </div>
            </header>

            <section class="flex-1 overflow-y-auto p-10 bg-[#0A0C12] no-scrollbar">
                <router-view />
            </section>
        </main>
    </div>
</template>