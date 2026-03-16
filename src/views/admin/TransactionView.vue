<script setup>
import { ref, onMounted } from 'vue'
import {
    CreditCard, Search, Download, Filter,
    CheckCircle2, Clock, AlertCircle, Zap
} from 'lucide-vue-next'
import api from '../../utils/axios'

const transactions = ref([])
const isLoading = ref(true)

const fetchTransactions = async () => {
    isLoading.value = true
    try {
        const response = await api.get('/admin/transactions')
        transactions.value = response.data.data || []
    } catch (error) {
        console.error("Gagal mengambil data transaksi:", error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchTransactions)

const getStatusTheme = (status) => {
    const s = status?.toLowerCase()
    if (s === 'settlement' || s === 'success')
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    if (s === 'pending')
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    if (s === 'expire' || s === 'failure')
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    return 'text-slate-400 bg-slate-800 border-white/5'
}
</script>

<template>
    <div class="space-y-8 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                        <CreditCard class="w-5 h-5 text-sky-400" />
                    </div>
                    <h2 class="text-3xl font-bold text-white tracking-tight">Revenue Management</h2>
                </div>
                <p class="text-slate-500 text-sm">Monitoring sirkulasi saldo dan upgrade tier user.</p>
            </div>

            <!-- <button
                class="flex items-center gap-2 px-4 py-2.5 bg-[#0E1118] border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest">
                <Download class="w-4 h-4" /> Export CSV
            </button> -->
        </div>

        <div class="bg-[#0E1118] border border-white/5 rounded-4xl overflow-hidden shadow-2xl">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                        <th class="px-8 py-6">Order ID</th>
                        <th class="px-8 py-6">Customer & Tier</th>
                        <th class="px-8 py-6">Amount</th>
                        <th class="px-8 py-6">Status</th>
                        <th class="px-8 py-6 text-right">Transaction Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/2">
                    <tr v-if="isLoading" v-for="i in 5" :key="i" class="animate-pulse">
                        <td colspan="5" class="px-8 py-6 h-16 bg-white/1"></td>
                    </tr>

                    <tr v-else v-for="tx in transactions" :key="tx.id" class="group hover:bg-white/1 transition-all">
                        <td class="px-8 py-6">
                            <span
                                class="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                                {{ tx.external_id }}
                            </span>
                        </td>

                        <td class="px-8 py-6">
                            <div class="flex flex-col gap-1.5">
                                <span class="text-sm font-medium text-slate-400">{{ tx.user?.email || 'User ID: ' +
                                    tx.user_id }}</span>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded text-[9px] font-black uppercase tracking-tighter">
                                        {{ tx.tier_plan }}
                                    </span>
                                </div>
                            </div>
                        </td>

                        <td class="px-8 py-6 text-sm font-bold text-white">
                            Rp {{ parseFloat(tx.amount).toLocaleString() }}
                        </td>

                        <td class="px-8 py-6">
                            <div
                                :class="['inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase border', getStatusTheme(tx.status)]">
                                <component
                                    :is="tx.status === 'settlement' || tx.status === 'success' ? CheckCircle2 : Clock"
                                    class="w-3 h-3" />
                                {{ tx.status }}
                            </div>
                        </td>

                        <td class="px-8 py-6 text-right">
                            <div class="flex flex-col items-end">
                                <span class="text-sm text-slate-400 font-medium">
                                    {{ new Date(tx.created_at).toLocaleDateString('id-ID') }}
                                </span>
                                <span class="text-[10px] text-slate-600 font-bold uppercase mt-1">
                                    {{ new Date(tx.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                    minute:'2-digit'}) }}
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>