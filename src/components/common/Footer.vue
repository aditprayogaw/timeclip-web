<template>
    <footer class="bg-timeclip-dark border-t border-gray-800 pt-20 pb-10 px-6">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div class="space-y-6">
                    <router-link to="/" class="flex items-center gap-2">
                        <div class="flex items-center justify-center w-26">
                            <img src="/TimeCVerC.png" alt="TimeClip"/>
                        </div>
                    </router-link>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        Transforming long-form content into viral short clips using advanced AI technology.
                    </p>
                </div>

                <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
                    <ul class="space-y-4 text-sm">
                        <li><router-link to="/features"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Features</router-link>
                        </li>
                        <li><router-link to="/solutions"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Solutions</router-link>
                        </li>
                        <li><router-link to="/pricing"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Pricing</router-link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
                    <ul class="space-y-4 text-sm">
                        <li><router-link to="/blog"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Blog</router-link>
                        </li>
                        <li><router-link to="/docs"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Documentation</router-link>
                        </li>
                        <li><router-link to="/support"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Support</router-link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
                    <ul class="space-y-4 text-sm">
                        <li><router-link to="/privacy-policy"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Privacy
                                Policy</router-link></li>
                        <li><router-link to="/terms-of-service"
                                class="text-gray-500 hover:text-timeclip-emerald transition-colors">Terms of
                                Service</router-link></li>
                    </ul>
                </div>
            </div>

            <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-gray-600 text-xs">
                    © 2026 TimeClip AI. All rights reserved.
                </p>
                <div class="flex gap-6">
                    <a href="#" class="text-gray-600 hover:text-white transition-colors"><span
                            class="sr-only">Twitter</span><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-gray-600 hover:text-white transition-colors"><span
                            class="sr-only">GitHub</span><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    </footer>
</template>