<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'

const auth = useAuthStore()
const isLoading = ref(false)

// Step 1: Fungsi untuk mendapatkan Snap Token dari Backend
const handleSubscribe = async (tier) => {
    isLoading.value = true
    try {
        const response = await api.post('/payment/subscribe', {
            tier_plan: tier // starter, pro, atau business
        })

        if (response.data.status === 'success') {
            const snapToken = response.data.snap_token
            openMidtransSnap(snapToken)
        }
    } catch (error) {
        console.error("Gagal membuat transaksi")
    } finally {
        isLoading.value = false
    }
}

// Step 2: Membuka Popup Midtrans 
const openMidtransSnap = (token) => {
    window.snap.pay(token, {
        onSuccess: (result) => {
            // Refresh data user & kredit setelah sukses 
            auth.fetchUserCredits()
            alert("Pembayaran Berhasil! Paket Anda telah diupdate.")
        },
        onPending: (result) => {
            alert("Pembayaran sedang diproses, silakan selesaikan tagihan Anda.")
        },
        onError: (result) => {
            alert("Pembayaran gagal, silakan coba lagi.")
        }
    })
}
</script>

<template>
    <div class="min-h-screen bg-[#05070A] p-10 text-white">
        <h2 class="text-4xl font-black text-center mb-12 uppercase tracking-tighter">Pilih Paket Kreatormu</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div class="bg-[#0E1118] border border-white/5 p-10 rounded-[3rem] flex flex-col items-center">
                <h3 class="text-xl font-bold mb-2">Starter</h3>
                <p class="text-emerald-400 text-3xl font-black mb-6">Rp 100k</p>
                <ul class="text-slate-400 text-sm space-y-3 mb-10 text-center">
                    <li>100 AI Credits</li>
                    <li>Standard Support</li>
                </ul>
                <button @click="handleSubscribe('starter')" :disabled="isLoading"
                    class="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all uppercase text-xs tracking-widest">
                    Pilih Starter
                </button>
            </div>

            <div
                class="bg-indigo-600 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl shadow-indigo-600/20 transform scale-105">
                <h3 class="text-xl font-bold mb-2">Pro</h3>
                <p class="text-white text-3xl font-black mb-6">Rp 250k</p>
                <ul class="text-indigo-100 text-sm space-y-3 mb-10 text-center font-medium">
                    <li>300 AI Credits</li>
                    <li>Priority Support</li>
                    <li>No Watermark</li>
                </ul>
                <button @click="handleSubscribe('pro')" :disabled="isLoading"
                    class="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all uppercase text-xs tracking-widest">
                    Pilih Pro
                </button>
            </div>

            <div class="bg-[#0E1118] border border-white/5 p-10 rounded-[3rem] flex flex-col items-center">
                <h3 class="text-xl font-bold mb-2">Business</h3>
                <p class="text-emerald-400 text-3xl font-black mb-6">Rp 500k</p>
                <ul class="text-slate-400 text-sm space-y-3 mb-10 text-center">
                    <li>Unlimited Credits</li>
                    <li>Custom Branding</li>
                    <li>24/7 Support</li>
                </ul>
                <button @click="handleSubscribe('business')" :disabled="isLoading"
                    class="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all uppercase text-xs tracking-widest">
                    Pilih Business
                </button>
            </div>
        </div>
    </div>
</template>