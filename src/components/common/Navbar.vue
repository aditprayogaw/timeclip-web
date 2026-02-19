<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Menu, X } from 'lucide-vue-next'

const isResourcesOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Menutup dropdown saat klik di luar
const closeResources = () => {
    isResourcesOpen.value = false
}

// Efek navbar menjadi solid saat scroll
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
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
        'fixed top-0 left-0 right-0 z-100 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-timeclip-dark/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    ]">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-2 group">
                <div
                    class="flex items-center justify-center transition-transform">
                    <img src="/TimeCHoriC.png" alt="TimeClip Logo" class="h-10 w-auto object-contain" />
                </div>
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
                                class="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all font-medium"
                                active-class="text-timeclip-emerald bg-timeclip-emerald/5">
                                {{ link.name }}
                            </router-link>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="hidden md:flex items-center gap-6">
                <router-link to="/login"
                    class="text-sm font-bold text-white hover:text-timeclip-emerald transition-colors">
                    Sign In
                </router-link>
                <router-link to="/register"
                    class="bg-timeclip-emerald text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-timeclip-emerald/20">
                    Sign up
                </router-link>
            </div>

            <button class="md:hidden text-white" @click="isMobileMenuOpen = !isMobileMenuOpen">
                <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
                <X v-else class="w-6 h-6" />
            </button>
        </div>

        <transition name="fade">
            <div v-if="isMobileMenuOpen" class="fixed inset-0 top-18 bg-timeclip-dark z-50 p-6 md:hidden">
                <div class="flex flex-col gap-6">
                    <router-link v-for="link in [...navLinks, ...resourceLinks]" :key="link.path" :to="link.path"
                        @click="isMobileMenuOpen = false" class="text-2xl font-bold text-white">
                        {{ link.name }}
                    </router-link>
                    <hr class="border-gray-800" />
                    <router-link to="/login" class="text-xl font-bold text-white">Sign In</router-link>
                    <router-link to="/register"
                        class="bg-timeclip-emerald text-white p-4 rounded-2xl font-bold text-center">Sign Up
                        Free</router-link>
                </div>
            </div>
        </transition>
    </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>