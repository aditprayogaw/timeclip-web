<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '../../services/adminService'
import { Zap, Activity, ShieldAlert, BarChart3, Clock } from 'lucide-vue-next'

const stats = ref(null)
const summary = ref({})
const logs = ref([])

onMounted(async () => {
    try {
        const statsRes = await adminService.getStats()
        stats.value = statsRes.data.data
        summary.value = statsRes.data.data.summary

        const logsRes = await adminService.getLogs()
        logs.value = logsRes.data.data
    } catch (e) {
        console.error("Gagal memuat data dashboard")
    }
})

// Logika warna level log sesuai guide [cite: 266, 267]
const getLogLevelColor = (level) => {
    if (level === 'ERROR') return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    if (level === 'WARNING') return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
}
</script>

<template>
    <div class="space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
                class="bg-[#0E1118] border border-white/5 p-6 rounded-4xl hover:border-indigo-500/30 transition-all group">
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Total Users</p>
                <h3 class="text-3xl font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">{{
                    summary.total_users || 0 }}</h3>
            </div>
            <div
                class="bg-[#0E1118] border border-white/5 p-6 rounded-4xl hover:border-emerald-500/30 transition-all group">
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Videos Processed</p>
                <h3 class="text-3xl font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">{{
                    summary.total_videos || 0 }}</h3>
            </div>
            <div
                class="bg-[#0E1118] border border-white/5 p-6 rounded-4xl hover:border-sky-500/30 transition-all group">
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Clips Generated</p>
                <h3 class="text-3xl font-bold text-white mt-2 group-hover:text-sky-400 transition-colors">{{
                    summary.total_clips || 0 }}</h3>
            </div>
            <div
                class="bg-[#0E1118] border border-white/5 p-6 rounded-4xl hover:border-rose-500/30 transition-all group">
                <p class="text-rose-500/50 text-[10px] font-bold uppercase tracking-[0.2em]">System Errors</p>
                <h3 class="text-3xl font-bold text-white mt-2 group-hover:text-rose-500 transition-colors">{{
                    summary.total_system_errors || 0 }}</h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-[#0E1118] border border-white/5 p-8 rounded-[2.5rem]">
                <div class="flex justify-between items-center mb-8">
                    <h4 class="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <Activity class="w-4 h-4 text-emerald-400" /> Render Health
                    </h4>
                </div>
                <div class="space-y-6">
                    <div>
                        <div class="flex justify-between text-[10px] font-bold uppercase mb-2">
                            <span class="text-emerald-400">Success ({{ stats?.ffmpeg_health?.success }})</span>
                            <span class="text-slate-500">{{ Math.round((stats?.ffmpeg_health?.success /
                                (stats?.ffmpeg_health?.success + stats?.ffmpeg_health?.failed)) * 100) || 0 }}%</span>
                        </div>
                        <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 transition-all duration-1000"
                                :style="{ width: (stats?.ffmpeg_health?.success / (stats?.ffmpeg_health?.success + stats?.ffmpeg_health?.failed) * 100) + '%' }">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-[10px] font-bold uppercase mb-2">
                            <span class="text-rose-500">Failed ({{ stats?.ffmpeg_health?.failed }})</span>
                        </div>
                        <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-rose-500 transition-all duration-1000"
                                :style="{ width: (stats?.ffmpeg_health?.failed / (stats?.ffmpeg_health?.success + stats?.ffmpeg_health?.failed) * 100) + '%' }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-[#0E1118] border border-white/5 p-8 rounded-[2.5rem]">
                <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Clock class="w-4 h-4 text-amber-400" /> Queue Status
                </h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-6 bg-white/2 border border-white/5 rounded-2xl text-center">
                        <p class="text-[10px] font-bold text-slate-500 uppercase">Pending</p>
                        <p class="text-3xl font-bold text-amber-500 mt-2">{{ stats?.queue_status?.pending || 0 }}</p>
                    </div>
                    <div class="p-6 bg-white/2 border border-white/5 rounded-2xl text-center">
                        <p class="text-[10px] font-bold text-slate-500 uppercase">Processing</p>
                        <p class="text-3xl font-bold text-indigo-500 mt-2">{{ stats?.queue_status?.processing || 0 }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-[#0E1118] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <h4 class="text-white font-bold mb-8 text-sm uppercase tracking-widest">Recent System Logs</h4>
            <div class="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="log in logs" :key="log.id"
                    class="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/4 transition-all group">
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2">
                            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ log.service
                                }}</span>
                            <span :class="getLogLevelColor(log.level)"
                                class="text-[8px] font-bold px-2 py-0.5 rounded border uppercase">{{ log.level }}</span>
                        </div>
                        <p class="text-sm text-slate-400">{{ log.message }}</p>
                        <span class="text-[9px] text-slate-600 font-medium tracking-tight">{{ log.created_at }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ffffff10;
    border-radius: 10px;
}
</style>