<script setup>
const plans = [
    {
        name: 'Free',
        price: '0',
        desc: 'Perfect for trying out TimeClip',
        features: ['10 clips per month', '720p export quality', 'Basic AI detection', 'YouTube & TikTok support', 'Community support'],
        button: 'Get Started',
        popular: false
    },
    {
        name: 'Pro',
        price: '29',
        desc: 'For serious content creators',
        features: ['Unlimited clips', '4K export quality', 'Advanced AI detection', 'All platform support', 'Priority support', 'Custom branding', 'Batch processing', 'API access'],
        button: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Team',
        price: '99',
        desc: 'For teams and agencies',
        features: ['Everything in Pro', '5 team members', 'Shared workspace', 'Advanced analytics', 'Dedicated support', 'Custom integrations', 'SSO authentication', 'Volume discounts'],
        button: 'Contact Sales',
        popular: false
    }
]

const faqs = [
    { q: 'Can I change plans later?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
    { q: 'What happens if I exceed my clip limit?', a: 'On the Free plan, you\'ll need to upgrade to continue. Pro and Team plans have unlimited clips.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 14-day money-back guarantee on all paid plans.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Team plans.' }
]
</script>

<template>
    <div class="py-30 px-6 bg-timeclip-dark min-h-screen">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h1 class="text-5xl font-bold text-white mb-4">Simple, Transparent <span
                        class="text-timeclip-emerald">Pricing</span></h1>
                <p class="text-gray-400">Choose the plan that fits your needs. No hidden fees, cancel anytime.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                <div v-for="plan in plans" :key="plan.name"
                    class="bg-gray-900 border p-10 rounded-[2.5rem] flex flex-col relative transition-all"
                    :class="plan.popular ? 'border-timeclip-emerald scale-105 shadow-2xl shadow-timeclip-emerald/10' : 'border-gray-800'">

                    <div v-if="plan.popular"
                        class="absolute -top-4 left-1/2 -translate-x-1/2 bg-timeclip-emerald text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                        Most Popular
                    </div>

                    <h3 class="text-white font-bold text-2xl mb-1">{{ plan.name }}</h3>
                    <p class="text-gray-500 text-xs mb-6">{{ plan.desc }}</p>

                    <div class="flex items-baseline mb-8">
                        <span class="text-4xl font-bold text-white">${{ plan.price }}</span>
                        <span class="text-gray-500 text-sm ml-2">/ per month</span>
                    </div>

                    <ul class="space-y-4 mb-10 grow">
                        <li v-for="feat in plan.features" :key="feat" class="flex items-center text-gray-400 text-sm">
                            <span class="text-timeclip-emerald mr-3 font-bold">✓</span>
                            {{ feat }}
                        </li>
                    </ul>

                    <button
                        :class="plan.popular ? 'bg-timeclip-emerald text-white' : 'bg-gray-800 text-white hover:bg-gray-700'"
                        class="w-full py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest">
                        {{ plan.button }}
                    </button>
                </div>
            </div>

            <div class="max-w-3xl mx-auto mb-32">
                <h2 class="text-3xl font-bold text-white text-center mb-12 tracking-tight">Frequently Asked Questions
                </h2>
                <div class="space-y-4">
                    <div v-for="faq in faqs" :key="faq.q" class="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
                        <h4 class="text-white font-bold mb-2">{{ faq.q }}</h4>
                        <p class="text-gray-500 text-sm leading-relaxed">{{ faq.a }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-gray-900 border border-gray-800 p-16 rounded-[3rem] text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Still have questions?</h2>
                <p class="text-gray-400 mb-10 text-sm">Our team is here to help you find the perfect plan</p>
                <button
                    class="bg-timeclip-emerald text-white px-12 py-4 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(29,155,102,0.3)] transition-all uppercase tracking-widest text-sm">
                    Contact Sales
                </button>
            </div>
        </div>
    </div>
</template>