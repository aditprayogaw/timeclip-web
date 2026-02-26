<script setup>
import {
    Zap,
    BrainCircuit,
    Scissors,
    Download,
    Clock,
    TrendingUp,
    Link,
    Sparkles,
    Eye,
    Share2
} from 'lucide-vue-next'

const stats = [
    { label: 'Clips Generated', value: '10M+' },
    { label: 'Creators', value: '50K+' },
    { label: 'Accuracy', value: '99%' },
    { label: 'Processing Time', value: '<5s' }
]

const features = [
    {
        title: 'AI-Powered Detection',
        description: 'Advanced algorithms identify the most engaging moments in your videos automatically.',
        icon: BrainCircuit
    },
    {
        title: 'Lightning Fast',
        description: 'Process videos in seconds, not hours. Get your clips ready instantly.',
        icon: Zap
    },
    {
        title: 'Smart Editing',
        description: 'Perfectly trimmed clips with smooth transitions and optimal timing.',
        icon: Scissors
    },
    {
        title: 'Easy Export',
        description: 'Download clips in multiple formats optimized for any platform.',
        icon: Download
    },
    {
        title: 'Save Hours',
        description: 'Automate your workflow and focus on creating more content.',
        icon: Clock
    },
    {
        title: 'Boost Engagement',
        description: 'Extract viral-worthy moments that capture attention and drive views.',
        icon: TrendingUp
    }
]

const steps = [
    { title: 'Paste URL', desc: 'Simply paste your YouTube or TikTok video link into the input field.', icon: Link },
    { title: 'AI Analysis', desc: 'Our AI scans your video and identifies the most engaging moments.', icon: Sparkles },
    { title: 'Review Clips', desc: 'Preview all generated clips and select your favorites.', icon: Eye },
    { title: 'Export & Share', desc: 'Download clips optimized for any platform and start sharing.', icon: Share2 }
]
</script>

<template>
    <div class="bg-timeclip-dark min-h-screen text-white">
        <header class="pt-30 pb-16 px-6 text-center">
            <div
                class="inline-flex items-center space-x-2 bg-gray-900/50 border border-timeclip-lime/30 px-4 py-1.5 rounded-full mb-8">
                <span class="text-timeclip-lime text-[10px] font-bold tracking-widest uppercase">✨ AI-Powered By TimeClip</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Turn Videos Into <br />
                <span class="text-timeclip-emerald">Viral Clips</span>
            </h1>

            <p class="text-gray-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
                Extract the best moments from your YouTube and TikTok videos instantly.
                Powered by AI to find the most engaging clips automatically.
            </p>

            <div
                class="max-w-3xl mx-auto bg-gray-900/40 p-2 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-3">
                <input type="text" placeholder="Paste YouTube or TikTok URL here..."
                    class="flex-1 bg-transparent px-6 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-timeclip-emerald/50" />
                <a href="/login">
                    <button
                        class="bg-timeclip-emerald text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                        Get Clips
                    </button>
                </a>
            </div>
        </header>

        <section class="py-12 border-y border-gray-900/50">
            <div class="max-w-7xl mx-auto px-6">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="stat in stats" :key="stat.label" class="text-center p-6">
                        <h3 class="text-4xl font-bold text-white mb-1">{{ stat.value }}</h3>
                        <p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{{ stat.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24">
            <div class="max-w-7xl mx-auto px-6 text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Powerful Features for <span class="text-timeclip-emerald">Content Creators</span>
                </h2>
                <p class="text-gray-400 text-sm">Everything you need to turn long-form content into viral clips</p>
            </div>

            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="feature in features" :key="feature.title"
                    class="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-timeclip-emerald/30 transition-all group">
                    <div
                        class="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-timeclip-emerald/10">
                        <component :is="feature.icon" class="text-timeclip-emerald w-6 h-6" />
                    </div>
                    <h4 class="text-white font-bold text-lg mb-3">{{ feature.title }}</h4>
                    <p class="text-gray-500 text-sm leading-relaxed">{{ feature.description }}</p>
                </div>
            </div>
        </section>

        <section class="py-24 bg-gray-900/10">
            <div class="max-w-7xl mx-auto px-6 text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold">How It Works</h2>
                <p class="text-gray-400 text-sm mt-2">From video to viral clips in four simple steps</p>
            </div>

            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="(step, index) in steps" :key="index" class="relative">
                    <div class="bg-gray-900 border border-gray-800 p-8 rounded-3xl h-full">
                        <div
                            class="w-8 h-8 bg-timeclip-emerald text-white rounded-full flex items-center justify-center font-bold text-sm mb-6">
                            {{ index + 1 }}
                        </div>
                        <div class="text-timeclip-emerald mb-4">
                            <component :is="step.icon" class="w-6 h-6 opacity-50" />
                        </div>
                        <h5 class="text-white font-bold mb-3 text-lg">{{ step.title }}</h5>
                        <p class="text-gray-500 text-xs leading-relaxed">{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 text-center">
            <h2 class="text-4xl font-bold mb-8 text-white px-6">Ready to go viral?</h2>
            <a href="/login">
                <button
                    class="bg-timeclip-emerald text-white px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-timeclip-emerald/10">
                    Start Creating for Free
                </button>
            </a>
        </section>
    </div>
</template>