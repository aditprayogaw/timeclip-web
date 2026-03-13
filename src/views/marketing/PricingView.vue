<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)

const plans = [
    {
        id: 'starter', // ID sesuai backend 
        name: 'Starter',
        price: '100.000', // Sesuai harga backend 
        desc: 'Great for rising content creators',
        features: [
            '100 Credits (One-time purchase)', 
            'Max 30 Min Video Duration',
            '1080p Export Quality',
            'No Watermark',
            'Full AI Agent Access',
            '10 GB Cloud Storage'
        ],
        button: 'Choose Starter',
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '250.000', 
        desc: 'For serious professional creators',
        features: [
            '300 Credits (One-time purchase)',
            'Max 60 Min Video Duration',
            '4K Export Quality',
            'No Watermark',
            'Priority AI Agent Access',
            '50 GB Cloud Storage',
            'Batch Processing'
        ],
        button: 'Start Pro Plan',
        popular: true
    },
    {
        id: 'business',
        name: 'Business',
        price: '500.000', // 
        desc: 'For teams and production houses',
        features: [
            'Unlimited Credits (9999)', 
            'Unlimited Video Duration',
            '4K + Pro-Res Export',
            'No Watermark',
            'Custom AI Model Training',
            '500 GB Cloud Storage',
            'Dedicated Account Manager'
        ],
        button: 'Choose Business',
        popular: false
    }
]

// Fungsi Integrasi Midtrans 
const handlePayment = async (tierId) => {
    if (!auth.isAuthenticated) {
        return router.push('/login')
    }

    isLoading.value = true
    try {
        // 1. Request Snap Token dari Backend 
        const response = await api.post('/payment/subscribe', {
            tier_plan: tierId
        })

        if (response.data.status === 'success') {
            const snapToken = response.data.snap_token

            // 2. Buka Popup Midtrans Snap 
            window.snap.pay(snapToken, {
                onSuccess: (result) => {
                    // Update data kredit user di store 
                    auth.fetchUserCredits()
                    router.push('/dashboard?payment=success')
                },
                onPending: (result) => {
                    router.push('/dashboard?payment=pending')
                },
                onError: (result) => {
                    alert("Pembayaran gagal, silakan coba lagi.")
                },
                onClose: () => {
                    console.log('User closed the popup without finishing the payment')
                }
            })
        }
    } catch (error) {
        console.error("Payment initiation failed:", error)
        alert(error.response?.data?.message || "Terjadi kesalahan sistem.")
    } finally {
        isLoading.value = false
    }
}

const faqs = [
    { q: 'Can I change plans later?', a: 'Yes! You can upgrade your plan at any time to get more credits.' },
    { q: 'What happens to my credits?', a: 'Credits are added to your balance immediately after a successful payment.' },
    { q: 'What payment methods are supported?', a: 'Via Midtrans, we accept E-wallets (GoPay, OVO), Bank Transfers, and Credit Cards.' }
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

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 text-left">
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
                        <span class="text-gray-400 text-lg mr-1">Rp</span>
                        <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
                    </div>

                    <ul class="space-y-4 mb-10 grow">
                        <li v-for="feat in plan.features" :key="feat" class="flex items-center text-gray-400 text-sm">
                            <span class="text-timeclip-emerald mr-3 font-bold">✓</span>
                            {{ feat }}
                        </li>
                    </ul>

                    <button @click="handlePayment(plan.id)" :disabled="isLoading"
                        :class="plan.popular ? 'bg-timeclip-emerald text-white' : 'bg-gray-800 text-white hover:bg-gray-700'"
                        class="w-full py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest disabled:opacity-50">
                        {{ isLoading ? 'Processing...' : plan.button }}
                    </button>
                </div>
            </div>

            <div class="max-w-3xl mx-auto mb-32">
                <h2 class="text-3xl font-bold text-white text-center mb-12 tracking-tight">Frequently Asked Questions
                </h2>
                <div class="space-y-4">
                    <div v-for="faq in faqs" :key="faq.q"
                        class="bg-gray-900 border border-gray-800 p-8 rounded-3xl text-left">
                        <h4 class="text-white font-bold mb-2">{{ faq.q }}</h4>
                        <p class="text-gray-500 text-sm leading-relaxed">{{ faq.a }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>