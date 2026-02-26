<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, CheckCircle2, Wand2, Youtube, Clapperboard, Scissors } from 'lucide-vue-next'
import api from '../../utils/axios'

const route = useRoute()
const router = useRouter()
const videoId = route.params.id

const progress = ref(0)
const currentStepIndex = ref(0)
const isCompleted = ref(false)

// Daftar langkah pemrosesan AI
const steps = [
    { label: 'Fetching Video', icon: Youtube },
    { label: 'Transcribing Audio', icon: Wand2 },
    { label: 'Analyzing Viral Moments', icon: Clapperboard },
    { label: 'Generating Clips', icon: Scissors }
]

// Fungsi untuk mengecek status secara berkala (Polling)
let pollInterval = null

const checkStatus = async () => {
    try {
        // Memanggil endpoint status video berdasarkan ID
        const response = await api.get(`/videos/${videoId}`)
        const videoData = response.data.data

        // Simulasi progres berdasarkan status dari backend
        if (videoData.status === 'processing') {
            if (progress.value < 90) progress.value += 5 // Simulasi progres naik

            // Logika perpindahan step visual
            if (progress.value > 25) currentStepIndex.value = 1
            if (progress.value > 50) currentStepIndex.value = 2
            if (progress.value > 75) currentStepIndex.value = 3
        }

        if (videoData.status === 'completed') {
            progress.value = 100
            isCompleted.value = true
            clearInterval(pollInterval)

            // Tunggu sebentar lalu arahkan ke hasil klip
            setTimeout(() => {
                router.push(`/dashboard/clips/${videoId}`)
            }, 2000)
        }
    } catch (error) {
        console.error("Gagal mengecek status:", error)
    }
}

onMounted(() => {
    // Mulai polling setiap 3 detik
    pollInterval = setInterval(checkStatus, 3000)
})

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-[#0B0F17] text-white p-6 font-sans">
        <div class="w-full max-w-2xl">

            <div class="text-center mb-12">
                <div class="relative w-40 h-40 mx-auto mb-8">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="8" fill="transparent"
                            class="text-gray-800" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="8" fill="transparent"
                            class="text-timeclip-emerald transition-all duration-500"
                            :style="{ strokeDasharray: 440, strokeDashoffset: 440 - (440 * progress) / 100 }" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-3xl font-black">{{ progress }}%</span>
                    </div>
                </div>

                <h2 class="text-3xl font-black mb-2">
                    {{ isCompleted ? 'Magic Complete!' : 'AI is analyzing your video...' }}
                </h2>
                <p class="text-gray-500 font-medium tracking-wide">
                    {{ steps[currentStepIndex].label }}
                </p>
            </div>

            <div class="grid gap-4">
                <div v-for="(step, index) in steps" :key="index"
                    class="flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500" :class="[
                        index === currentStepIndex ? 'bg-timeclip-emerald/10 border-timeclip-emerald/30' : 'bg-gray-900/40 border-gray-800',
                        index < currentStepIndex || isCompleted ? 'opacity-50' : ''
                    ]">
                    <div class="p-3 rounded-xl bg-gray-800">
                        <component :is="step.icon" class="w-6 h-6"
                            :class="index === currentStepIndex ? 'text-timeclip-emerald' : 'text-gray-500'" />
                    </div>

                    <div class="flex-1">
                        <h3 class="font-bold text-sm uppercase tracking-widest"
                            :class="index === currentStepIndex ? 'text-white' : 'text-gray-500'">
                            {{ step.label }}
                        </h3>
                    </div>

                    <div v-if="index < currentStepIndex || isCompleted">
                        <CheckCircle2 class="w-6 h-6 text-timeclip-emerald" />
                    </div>
                    <div v-else-if="index === currentStepIndex">
                        <Loader2 class="w-6 h-6 text-timeclip-emerald animate-spin" />
                    </div>
                </div>
            </div>

            <div class="fixed bottom-10 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
                <img src="/TimeCHoriC.png" alt="TimeClip" class="h-8" />
            </div>
        </div>
    </div>
</template>