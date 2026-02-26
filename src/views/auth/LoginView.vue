<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const notify = useNotificationStore()

const errorMessage = ref('')
const showPassword = ref(false)
const form = ref({ email: '', password: '' })
const isLoading = ref(false)

const socialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/redirect`;
}

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        await authStore.login(form.value)

        const notify = useNotificationStore()
        notify.show('Selamat datang kembali!', 'success')

        router.push('/dashboard')
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Login failed'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-timeclip-dark flex flex-col items-center justify-center p-6">
        <div class="mb-12 flex flex-col items-center">
            <img src="/TimeCVerC.png" alt="TimeClip" class="h-24 w-auto mb-2" />
        </div>

        <div class="w-full max-w-110 bg-gray-900 border border-gray-800/50 rounded-[2.5rem] p-10 shadow-2xl">
            <div class="text-center mb-10">
                <h1 class="text-3xl font-bold text-white mb-1">Welcome Back</h1>
                <p class="text-gray-400 text-sm">Enter your credentials to continue</p>
            </div>

            <div v-if="errorMessage"
                class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center font-bold">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Email
                        Address</label>
                    <div class="relative">
                        <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.email" type="email" placeholder="you@example.com" required
                            class="w-full bg-[#1F2937]/50 border border-gray-700/50 text-white pl-12 pr-4 py-4 rounded-2xl focus:border-timeclip-emerald outline-none transition-all placeholder:text-gray-600" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
                    <div class="relative">
                        <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                            required
                            class="w-full bg-[#1F2937]/50 border border-gray-700/50 text-white pl-12 pr-12 py-4 rounded-2xl focus:border-timeclip-emerald outline-none transition-all placeholder:text-gray-600" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button :disabled="authStore.isLoading"
                    class="w-full bg-timeclip-emerald text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-lg shadow-timeclip-emerald/20 disabled:opacity-50">
                    <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
                    <span>{{ authStore.isLoading ? 'Processing...' : 'Sign In' }}</span>
                </button>

                <span
                    class="block text-right text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">Forgot
                    password?
                </span>

                <span class="flex items-center gap-4 my-6">
                    <hr class="flex-1 border-gray-700" />
                    <span class="text-gray-500 text-[10px] uppercase tracking-widest font-black">Or continue with</span>
                    <hr class="flex-1 border-gray-700" />
                </span>

                <div class="grid grid-cols-2 gap-4">
                    <button type="button" @click="socialLogin('google')"
                        class="flex items-center justify-center space-x-2 bg-gray-800/50 border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
                        <span>Google</span>
                    </button>
                    <button type="button" @click="socialLogin('github')"
                        class="flex items-center justify-center space-x-2 bg-gray-800/50 border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold">
                        <img src="https://www.svgrepo.com/show/512317/github-142.svg" class="w-5 h-5 invert" />
                        <span>GitHub</span>
                    </button>
                </div>

                <p class="text-center text-gray-500 text-sm mt-8">
                    New to TimeClip? <router-link to="/register"
                        class="text-timeclip-emerald font-bold hover:underline">Sign up</router-link>
                </p>
            </form>
        </div>
    </div>
</template>