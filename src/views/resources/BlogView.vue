<script setup>
const posts = [
    { title: 'How AI is Revolutionizing Short-Form Content', date: 'Feb 15, 2026', category: 'Technology' },
    { title: '10 Tips to Make Your Clips Go Viral on TikTok', date: 'Feb 10, 2026', category: 'Guide' },
    { title: 'Why Subtitles are Crucial for Engagement', date: 'Feb 05, 2026', category: 'Marketing' }
]
</script>

<template>
    <div class="py-24 px-6 bg-timeclip-dark min-h-screen">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-5xl font-black text-white mb-12 text-center">TimeClip <span
                    class="text-timeclip-emerald">Blog</span></h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="post in posts" :key="post.title"
                    class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:border-timeclip-emerald/30 transition-all">
                    <span class="text-timeclip-emerald text-[10px] font-bold uppercase tracking-widest">{{ post.category
                        }}</span>
                    <h3 class="text-white font-bold text-xl mt-3 mb-6 leading-tight">{{ post.title }}</h3>
                    <p class="text-gray-500 text-sm">{{ post.date }}</p>
                </div>
            </div>
        </div>
    </div>
</template>