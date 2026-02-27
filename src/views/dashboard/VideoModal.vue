<script setup>
import { X, Download, Scissors, Share2 } from 'lucide-vue-next'

const props = defineProps({
    isOpen: Boolean,
    clip: Object
})

const emit = defineEmits(['close'])

const closeOnOverlay = (e) => {
    if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 z-1000 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            @click="closeOnOverlay">

            <div class="relative w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">
                <button @click="$emit('close')"
                    class="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors">
                    <X class="w-8 h-8" />
                </button>

                <div
                    class="w-full max-w-85 aspect-9/16 bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <video v-if="clip?.clip_path" :src="`http://127.0.0.1:8000/storage/${clip.clip_path}`" controls
                        autoplay class="w-full h-full object-cover">
                    </video>
                </div>

                <div class="flex-1 space-y-6 w-full">
                    <div>
                        <div
                            class="bg-timeclip-emerald/20 text-timeclip-emerald text-[10px] font-black px-3 py-1 rounded-full w-fit mb-3">
                            {{ clip?.viral_score }} VIRAL SCORE
                        </div>
                        <h2 class="text-2xl font-black text-white leading-tight">{{ clip?.title }}</h2>
                    </div>

                    <div class="grid grid-cols-1 gap-3">
                        <button
                            class="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
                            <Scissors class="w-5 h-5" /> Edit Captions
                        </button>
                        <button
                            class="flex items-center justify-center gap-3 bg-gray-800 text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-700 transition-all">
                            <Download class="w-5 h-5" /> Download Video
                        </button>
                        <button
                            class="flex items-center justify-center gap-3 bg-gray-900 border border-gray-800 text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all">
                            <Share2 class="w-5 h-5" /> Share to TikTok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
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