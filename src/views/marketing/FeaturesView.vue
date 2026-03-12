<script setup>
import {
    Sparkles, Video, Languages, Scissors,
    Monitor, Zap, Cloud, Smartphone,
    CloudDownload,
    DownloadIcon
} from 'lucide-vue-next'

const allFeatures = [
    { title: 'AI Highlight Detection', desc: 'Automatically finds the most viral-worthy moments.', icon: Sparkles },
    { title: 'Auto Face-Crop', desc: 'Focuses on the speaker automatically for vertical format.', icon: Video },
    { title: 'Multi-Language Subtitles', desc: 'Supports 50+ languages with 99% accuracy.', icon: Languages },
    { title: 'Smart Cut & Trim', desc: 'Removes silences and filler words instantly.', icon: Scissors },
    { title: 'Multi-Platform Export', desc: 'Optimized for TikTok, Reels, and Shorts.', icon: Monitor },
    { title: 'Lightning Speed', desc: 'Process 1 hour of video in less than 2 minutes.', icon: Zap },
    { title: 'Mobile Friendly', desc: 'Edit and share directly from your smartphone.', icon: Smartphone },
    { title: 'Instant Download', desc: 'Get your processed clips immediately.', icon: DownloadIcon },
]
</script>

<template>
    <div class="pt-30 py-24 px-6 bg-timeclip-dark">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h1 class="text-5xl font-bold text-white mb-4">Powerful <span class="text-timeclip-emerald">AI
                        Features</span></h1>
                <p class="text-gray-400 max-w-2xl mx-auto">Everything you need to dominate social media with short-form
                    content.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="feature in allFeatures" :key="feature.title"
                    class="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-timeclip-emerald/40 transition-all group">
                    <div
                        class="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-timeclip-emerald/10">
                        <component :is="feature.icon" class="text-timeclip-emerald w-6 h-6" />
                    </div>
                    <h4 class="text-white font-bold text-lg mb-2">{{ feature.title }}</h4>
                    <p class="text-gray-500 text-sm leading-relaxed">{{ feature.desc }}</p>
                </div>
            </div>
        </div>
    </div>
</template>