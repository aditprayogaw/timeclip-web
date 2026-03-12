<template>
    <div class="py-24 px-6 bg-timeclip-dark min-h-screen">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            <aside class="w-full md:w-64 space-y-4">
                <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-6">Introduction</h4>
                <ul class="text-gray-500 space-y-3 text-sm">
                    <li class="text-timeclip-emerald font-bold">Getting Started</li>
                    <li class="hover:text-white cursor-pointer transition">API Overview</li>
                    <li class="hover:text-white cursor-pointer transition">Best Practices</li>
                </ul>
            </aside>

            <article class="flex-1 bg-gray-900/20 border border-gray-800 p-10 rounded-3xl">
                <h2 class="text-3xl font-bold text-white mb-6">Getting Started</h2>
                <p class="text-gray-400 leading-relaxed mb-6">Welcome to TimeClip. Learn how to transform your long
                    videos into viral clips using our AI-powered engine in just a few minutes.</p>
                <div class="bg-black/50 p-6 rounded-xl border border-gray-800 font-mono text-sm text-timeclip-lime">
                    npm install @timeclip/sdk
                </div>
            </article>
        </div>
    </div>
</template>