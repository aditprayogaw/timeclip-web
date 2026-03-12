<script setup>
import { Users, Briefcase, Mic2 } from 'lucide-vue-next'

const solutions = [
    {
        title: 'Content Creators',
        target: 'Influencers & YouTubers',
        desc: 'Ubah video durasi panjang menjadi puluhan konten TikTok dan Reels dalam hitungan detik untuk menjaga retensi penonton.',
        icon: Users,
        points: ['Auto-captioning', 'Viral moment detection', 'Vertical re-framing']
    },
    {
        title: 'Agencies',
        target: 'Social Media Management',
        desc: 'Kelola banyak klien dengan lebih efisien. Produksi konten batch tanpa perlu editor tambahan untuk setiap video.',
        icon: Briefcase,
        points: ['High-speed processing', 'Consistent quality', 'Cost effective']
    },
    {
        title: 'Podcasters',
        target: 'Talkshows & Interviews',
        desc: 'Ambil highlight terbaik dari percakapan panjang untuk promosi di media sosial dan tarik trafik ke episode penuh Anda.',
        icon: Mic2,
        points: ['Speaker tracking', 'Noise reduction', 'Dynamic subtitles']
    }
]
</script>

<template>
    <div class="py-30 px-6 bg-timeclip-dark min-h-screen">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h1 class="text-5xl font-bold text-white mb-6">Built for Every <span
                        class="text-timeclip-emerald">Workflow</span></h1>
                <p class="text-gray-400 max-w-2xl mx-auto font-medium">
                    TimeClip menyesuaikan dengan kebutuhan produksi konten Anda, baik bekerja sendiri maupun dalam tim
                    besar.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="sol in solutions" :key="sol.title"
                    class="bg-gray-900 border border-gray-800 p-10 rounded-4xl flex flex-col hover:border-timeclip-emerald/30 transition-all group">
                    <div
                        class="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-timeclip-emerald/10 transition-colors">
                        <component :is="sol.icon" class="text-timeclip-emerald w-7 h-7" />
                    </div>

                    <h3 class="text-white font-bold text-2xl mb-1">{{ sol.title }}</h3>
                    <p class="text-timeclip-lime text-xs font-bold uppercase tracking-widest mb-6">{{ sol.target }}</p>

                    <p class="text-gray-400 text-sm leading-relaxed mb-8 grow">{{ sol.desc }}</p>

                    <ul class="space-y-3">
                        <li v-for="point in sol.points" :key="point"
                            class="flex items-center text-gray-300 text-sm font-medium">
                            <span class="w-1.5 h-1.5 bg-timeclip-emerald rounded-full mr-3"></span>
                            {{ point }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mt-20 bg-gray-900/30 border border-gray-800 p-12 rounded-[2.5rem] text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Ready to Scale Your Content?</h2>
                <a href="/login">
                    <button
                        class="bg-timeclip-emerald text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                        Get Started Now
                    </button>
                </a>
            </div>
        </div>
    </div>
</template>