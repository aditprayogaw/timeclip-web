<template>
    <div class="py-24 px-6 bg-timeclip-dark min-h-screen text-center">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-5xl font-bold text-white mb-6">How can we <span class="text-timeclip-emerald">help?</span>
            </h1>
            <p class="text-gray-400 mb-12">Search our knowledge base or contact our support team directly.</p>

            <div class="relative mb-16">
                <input type="text" placeholder="Search for articles..."
                    class="w-full bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-2xl focus:border-timeclip-emerald outline-none" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl">
                    <h3 class="text-white font-bold mb-2">Email Support</h3>
                    <p class="text-gray-500 text-sm mb-4">Response time: &lt; 24 hours</p>
                    <a href="mailto:support@timeclip.test"
                        class="text-timeclip-emerald font-bold">support@timeclip.test</a>
                </div>
                <div class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl">
                    <h3 class="text-white font-bold mb-2">Live Chat</h3>
                    <p class="text-gray-500 text-sm mb-4">Available for Pro & Team users</p>
                    <button class="text-timeclip-emerald font-bold uppercase text-xs tracking-widest">Start
                        Chat</button>
                </div>
            </div>
        </div>
    </div>
</template>