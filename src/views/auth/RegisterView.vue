<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../utils/axios'
import { useNotificationStore } from '../../stores/notifications'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const notify = useNotificationStore()

const isLoading = ref(false)
const showPassword = ref(false)

const socialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/redirect`;
}

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const handleRegister = async () => {
    // Validasi sederhana client-side
    if (form.value.password.length < 8) {
        notify.show('Password must be at least 8 characters', 'error')
        return
    }

    if (form.value.password !== form.value.password_confirmation) {
        notify.show('Passwords do not match', 'error')
        return
    }

    isLoading.value = true
    try {
        const response = await api.post('/register', form.value)

        notify.show('Account created! Please log in.', 'success')

        router.push('/login')
    } catch (error) {
        // Error 422
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-timeclip-dark px-6 py-12">
        <div class="mt-8 flex flex-col items-center mb-8">
            <img src="/TimeCVerC.png" alt="TimeClip" class="h-24 w-auto mb-2" />
        </div>

        <div class="w-full max-w-110 bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-black text-white mb-2">Join TimeClip</h2>
                <p class="text-gray-500 text-sm">Create viral clips with 10 free credits</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Full name</label>
                    <div class="relative">
                        <User class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.name" type="text" placeholder="ex: Nobaru" required
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Email
                        address</label>
                    <div class="relative">
                        <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.email" type="email" placeholder="you@example.com" required
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Password (min. 8
                        char)</label>
                    <div class="relative">
                        <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                            required
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Confirm
                        Password</label>
                    <div class="relative">
                        <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input v-model="form.password_confirmation" :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••" required
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                    </div>
                </div>

                <button :disabled="isLoading"
                    class="w-full bg-timeclip-emerald text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-xl shadow-timeclip-emerald/10 disabled:opacity-50">
                    <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                    <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
                </button>

                <span class="flex items-center gap-4 my-6">
                    <hr class="flex-1 border-gray-700" />
                     <span class="text-gray-500 text-[10px] uppercase tracking-widest font-black">Or continue with</span>
                    <hr class="flex-1 border-gray-700" />
                </span>

                <div class="grid grid-cols-2 gap-4 mt-5">
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

            </form>

            <div class="mt-8 text-center text-sm">
                <span class="text-gray-500">Already have an account? </span>
                <router-link to="/login" class="text-timeclip-emerald font-black hover:underline">Sign In</router-link>
            </div>
        </div>
    </div>
</template>