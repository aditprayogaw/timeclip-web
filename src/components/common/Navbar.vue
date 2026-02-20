<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router' // Tambahkan router untuk navigasi
import { useAuthStore } from '../../stores/auth'
import { ChevronDown, Menu, X, LayoutDashboard, LogOut } from 'lucide-vue-next'

const router = useRouter()
const isResourcesOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const authStore = useAuthStore()

// Fungsi Logout untuk reset status login
const handleLogout = () => {
    authStore.logout()
    isMobileMenuOpen.value = false
    router.push('/login')
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    const container = document.getElementById('scroll-container')
    container?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

const resourceLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Documentation', path: '/docs' },
    { name: 'Support', path: '/support' }
]

const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Pricing', path: '/pricing' }
]
</script>

<template>
    <nav :class="[
        'fixed top-0 left-0 right-0 z-100 transition-all duration-300 px-6 py-4 bg-timeclip-dark/80 backdrop-blur-md border-b border-gray-800',
    ]">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-2 group">
                <img src="/TimeCHoriC.png" alt="TimeClip Logo" class="h-10 w-auto object-contain" />
            </router-link>

            <div class="hidden md:flex items-center gap-8">
                <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
                    class="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    active-class="text-timeclip-emerald">
                    {{ link.name }}
                </router-link>

                <div class="relative" @mouseenter="isResourcesOpen = true" @mouseleave="isResourcesOpen = false">
                    <button
                        class="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                        :class="{ 'text-white': isResourcesOpen }">
                        Resources
                        <ChevronDown class="w-4 h-4 transition-transform duration-300"
                            :class="{ 'rotate-180': isResourcesOpen }" />
                    </button>

                    <transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
                        <div v-show="isResourcesOpen"
                            class="absolute top-full left-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-2">
                            <router-link v-for="link in resourceLinks" :key="link.path" :to="link.path"
                                class="flex px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all font-medium">
                                {{ link.name }}
                            </router-link>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="hidden md:flex items-center gap-6">
                <template v-if="authStore.isAuthenticated">
                    <router-link to="/dashboard"
                        class="flex items-center gap-2 text-sm font-bold text-white hover:text-timeclip-emerald transition-colors">
                        <LayoutDashboard class="w-4 h-4" />
                        Dashboard
                    </router-link>
                    <button @click="handleLogout"
                        class="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-400 transition-colors">
                        <LogOut class="w-4 h-4" />
                        Logout
                    </button>
                </template>

                <template v-else>
                    <router-link to="/login"
                        class="text-sm font-bold text-white hover:text-timeclip-emerald transition-colors">
                        Sign In
                    </router-link>
                    <router-link to="/register"
                        class="bg-timeclip-emerald text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-timeclip-emerald/20">
                        Sign up
                    </router-link>
                </template>
            </div>

            <button class="md:hidden text-white" @click="isMobileMenuOpen = !isMobileMenuOpen">
                <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
                <X v-else class="w-6 h-6" />
            </button>
        </div>

        <transition name="fade">
            <div v-if="isMobileMenuOpen"
                class="fixed inset-0 top-18 bg-timeclip-dark z-50 p-6 md:hidden flex flex-col gap-8">
                <div class="flex flex-col gap-6">
                    <router-link v-for="link in [...navLinks, ...resourceLinks]" :key="link.path" :to="link.path"
                        @click="isMobileMenuOpen = false" class="text-3xl font-black text-white">
                        {{ link.name }}
                    </router-link>
                </div>

                <div class="mt-auto space-y-4">
                    <template v-if="authStore.isAuthenticated">
                        <div class="bg-gray-900 p-6 rounded-4xl border border-gray-800 mb-4">
                            <p class="text-white text-xl font-black mb-1">{{ authStore.user?.name }}</p>
                            <p class="text-timeclip-emerald text-xs font-black uppercase tracking-widest">
                                {{ authStore.userCredits }} Credits Left
                            </p>
                        </div>
                        <router-link to="/dashboard" @click="isMobileMenuOpen = false"
                            class="w-full py-4 text-center bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2">
                            <LayoutDashboard class="w-5 h-5" /> Dashboard
                        </router-link>
                        <button @click="handleLogout"
                            class="w-full py-4 text-center text-red-400 font-bold border border-red-400/20 rounded-2xl flex items-center justify-center gap-2">
                            <LogOut class="w-5 h-5" /> Logout
                        </button>
                    </template>

                    <template v-else>
                        <router-link to="/login" @click="isMobileMenuOpen = false"
                            class="flex w-full py-4 text-center text-white font-bold border border-gray-800 rounded-2xl">Sign
                            In</router-link>
                        <router-link to="/register" @click="isMobileMenuOpen = false"
                            class="flex w-full py-4 text-center bg-timeclip-emerald text-white font-bold rounded-2xl">Sign
                            Up</router-link>
                    </template>
                </div>
            </div>
        </transition>
    </nav>
</template>