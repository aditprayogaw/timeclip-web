<script setup>
import { ref } from 'vue'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-vue-next'

// State untuk mengatur visibilitas password
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-timeclip-dark px-6 py-12">
        <div class="flex flex-col items-center mb-8">
            <img src="/TimeCVerC.png" alt="TimeClip" class="h-24 w-auto mb-2" />
        </div>

        <div class="w-full max-w-100 bg-gray-900/40 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-black text-white mb-2">Create your account</h2>
                <p class="text-gray-500 text-sm">Start creating viral clips today</p>
            </div>

            <form @submit.prevent="" class="space-y-5">
                <div class="space-y-2">
                    <label class="text-gray-400 text-xs font-bold uppercase ml-1">Full name</label>
                    <div class="relative">
                        <User class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input type="text" placeholder="ex: Nobaru"
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-xs font-bold uppercase ml-1">Email address</label>
                    <div class="relative">
                        <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input type="email" placeholder="you@example.com"
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-400 text-xs font-bold uppercase ml-1">Password</label>
                    <div class="relative">
                        <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

                        <input :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                            class="w-full bg-gray-800/40 border border-gray-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:border-timeclip-emerald transition-all" />

                        <button type="button" @click="togglePassword"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div class="flex items-start space-x-3 py-2">
                    <input type="checkbox" class="mt-1 accent-timeclip-emerald w-4 h-4" />
                    <p class="text-xs text-gray-500 leading-tight">
                        I agree to the <span class="text-timeclip-emerald cursor-pointer hover:underline">Terms of
                            Service</span> and <span
                            class="text-timeclip-emerald cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>

                <button
                    class="w-full bg-timeclip-emerald text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm shadow-xl shadow-timeclip-emerald/10">
                    Create account
                </button>
            </form>

            <div class="relative my-8 text-center">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-800"></div>
                </div>
                <span class="relative bg-gray-900 px-4 text-[10px] text-gray-500 uppercase tracking-widest">Or continue
                    with</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button
                    class="flex items-center justify-center space-x-2 bg-gray-800/50 border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
                    <span>Google</span>
                </button>
                <button
                    class="flex items-center justify-center space-x-2 bg-gray-800/50 border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold">
                    <img src="https://www.svgrepo.com/show/512317/github-142.svg" class="w-5 h-5 invert" />
                    <span>GitHub</span>
                </button>
            </div>

            <div class="mt-8 text-center text-sm">
                <span class="text-gray-500">Already have an account? </span>
                <router-link to="/login" class="text-timeclip-emerald font-bold hover:underline">Sign up</router-link>
            </div>
        </div>
    </div>
</template>