<template>
    <nav
        class="bg-timeclip-dark border-b border-gray-800 py-4 px-12 flex items-center justify-between w-full sticky top-0 z-50">

        <div class="flex items-center space-x-3">
            <a href="/" class="flex items-center space-x-2"><img src="/TimeCHoriC.png" alt="TimeClip Logo" class="h-10 w-auto object-contain" /></a>
            
        </div>

        <div class="hidden md:flex items-center space-x-10 text-gray-400 font-medium text-sm">
            <router-link to="/features" class="hover:text-timeclip-lime transition">Features</router-link>
            <router-link to="/solutions" class="hover:text-timeclip-lime transition">Solutions</router-link>
            <router-link to="/resources" class="hover:text-timeclip-lime transition">Resources</router-link>
            <router-link to="/pricing" class="hover:text-timeclip-lime transition">Pricing</router-link>
        </div>

        <div class="flex items-center space-x-4">
            <a href="/login">
                <button class="text-white font-medium hover:text-timeclip-emerald transition text-sm px-4 py-2">
                    Sign In
                </button>
            </a>
            <a href="/register">
                <button
                    class="bg-timeclip-emerald text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-opacity-90 transition shadow-lg">
                    Sign up
                </button>
            </a>

        </div>

    </nav>
</template>