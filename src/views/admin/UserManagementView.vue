<script setup>
import { ref, onMounted } from 'vue'
import {
    Users, Search, Mail, Zap, Trash2, Edit2,
    X, Check, Loader2, Shield, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import api from '../../utils/axios'

// State Data & Loading
const users = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const searchQuery = ref('')

// State Pagination (Sesuai Laravel Paginator)
const currentPage = ref(1)
const lastPage = ref(1)
const totalUsers = ref(0)

// State Modals
const isEditModalOpen = ref(false)
const isAdjustModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// State Selected User & Action Data
const selectedUser = ref({ id: null, name: '', role: '', tier: '', remaining_credits: 0 })
const adjustment = ref({ userId: null, userName: '', amount: 0, reason: '' })
const userIdToDelete = ref(null)

// --- ACTIONS ---

const fetchUsers = async (page = 1) => {
    isLoading.value = true
    try {
        // Mengirim parameter search dan page sesuai dokumen [cite: 271]
        const response = await api.get('/admin/users', {
            params: { search: searchQuery.value, page: page }
        })
        if (response.data.status === 'success') {
            const result = response.data.data
            users.value = result.data // Mengambil array user dari paginator [cite: 286]
            currentPage.value = result.current_page
            lastPage.value = result.last_page
            totalUsers.value = result.total
        }
    } catch (error) {
        console.error("Gagal mengambil data user [cite: 248]")
    } finally {
        isLoading.value = false
    }
}

const handleUpdateUser = async () => {
    isSubmitting.value = true
    try {
        // Update user sesuai endpoint PUT /admin/users/{id} [cite: 287]
        await api.put(`/admin/users/${selectedUser.value.id}`, {
            name: selectedUser.value.name,
            role: selectedUser.value.role,
            tier: selectedUser.value.tier,
            remaining_credits: selectedUser.value.remaining_credits
        })
        isEditModalOpen.value = false
        fetchUsers(currentPage.value)
    } catch (error) {
        alert("Gagal memperbarui otoritas user")
    } finally {
        isSubmitting.value = false
    }
}

const handleAdjustCredits = async () => {
    isSubmitting.value = true
    try {
        // Menambah/kurangi kredit wajib menyertakan alasan [cite: 290, 292]
        await api.post(`/admin/users/${adjustment.value.userId}/adjust-credits`, {
            amount: adjustment.value.amount,
            reason: adjustment.value.reason
        })
        isAdjustModalOpen.value = false
        fetchUsers(currentPage.value)
    } catch (error) {
        alert("Gagal menyesuaikan kredit")
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    // Proteksi sisi kode: Pastikan target bukan admin
    const target = users.value.find(u => u.id === userIdToDelete.value)
    if (target?.role === 'admin') {
        alert("Role Admin tidak dapat dihapus untuk alasan keamanan.")
        isDeleteModalOpen.value = false
        return
    }

    isSubmitting.value = true
    try {
        // Endpoint DELETE /admin/users/{id} [cite: 251]
        await api.delete(`/admin/users/${userIdToDelete.value}`)
        isDeleteModalOpen.value = false
        fetchUsers(currentPage.value)
    } catch (error) {
        alert("Gagal menghapus user")
    } finally {
        isSubmitting.value = false
        userIdToDelete.value = null
    }
}

onMounted(() => fetchUsers())
</script>

<template>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Users class="text-indigo-400" /> User Management
            </h2>
            <div class="relative w-full md:w-80">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input v-model="searchQuery" @keyup.enter="fetchUsers(1)" type="text" placeholder="Search user..."
                    class="w-full bg-[#0E1118] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-all shadow-xl" />
            </div>
        </div>

        <div class="bg-[#0E1118] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table class="w-full text-left">
                <thead
                    class="bg-white/2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                        <th class="px-8 py-6">User Profile</th>
                        <th class="px-8 py-6">Role / Tier</th>
                        <th class="px-8 py-6 text-emerald-400">Credits</th>
                        <th class="px-8 py-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/2">
                    <tr v-for="user in users" :key="user.id" class="group hover:bg-white/1 transition-all">
                        <td class="px-8 py-6">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-indigo-400 text-xs">
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-slate-200">{{ user.name }}</p>
                                    <p class="text-[11px] text-slate-600 font-medium">{{ user.email }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <div class="flex gap-2">
                                <span
                                    class="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase border border-indigo-500/20 tracking-widest">{{
                                    user.role }}</span>
                                <span
                                    class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase border border-amber-500/20 tracking-widest">{{
                                    user.tier }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <button
                                @click="adjustment = { userId: user.id, userName: user.name, amount: 0, reason: '' }; isAdjustModalOpen = true"
                                class="flex items-center gap-2 font-mono text-emerald-400 font-bold hover:scale-110 transition-transform">
                                <Zap class="w-3.5 h-3.5 fill-emerald-400/20" /> {{ user.remaining_credits }}
                            </button>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button @click="selectedUser = { ...user }; isEditModalOpen = true"
                                    class="p-2.5 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-xl transition-all">
                                    <Edit2 class="w-4 h-4" />
                                </button>
                                <button v-if="user.role !== 'admin'"
                                    @click="userIdToDelete = user.id; isDeleteModalOpen = true"
                                    class="p-2.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex items-center justify-between px-4">
            <p class="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Total {{ totalUsers }} Users</p>
            <div class="flex gap-2">
                <button @click="fetchUsers(currentPage - 1)" :disabled="currentPage === 1"
                    class="p-2.5 bg-[#0E1118] border border-white/5 rounded-xl disabled:opacity-20 hover:text-white transition-colors">
                    <ChevronLeft class="w-5 h-5" />
                </button>
                <div
                    class="px-6 flex items-center bg-[#0E1118] border border-white/5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest">
                    Page {{ currentPage }} / {{ lastPage }}
                </div>
                <button @click="fetchUsers(currentPage + 1)" :disabled="currentPage === lastPage"
                    class="p-2.5 bg-[#0E1118] border border-white/5 rounded-xl disabled:opacity-20 hover:text-white transition-colors">
                    <ChevronRight class="w-5 h-5" />
                </button>
            </div>
        </div>

        <div v-if="isEditModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <div class="bg-[#0E1118] border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
                <h3 class="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tighter">
                    <Shield class="w-5 h-5 text-indigo-400" /> Update User Otoritas
                </h3>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display
                            Name</label>
                        <input v-model="selectedUser.name" type="text"
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/30" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</label>
                            <select v-model="selectedUser.role"
                                class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white outline-none dark-select">
                                <option value="admin">Admin</option>
                                <option value="creator">Creator</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tier</label>
                            <select v-model="selectedUser.tier"
                                class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white outline-none dark-select">
                                <option value="free">Free</option>
                                <option value="starter">Starter</option>
                                <option value="pro">Pro</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button @click="isEditModalOpen = false"
                            class="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold text-sm uppercase">Cancel</button>
                        <button @click="handleUpdateUser" :disabled="isSubmitting"
                            class="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase">Save
                            Changes</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isAdjustModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <div class="bg-[#0E1118] border border-white/10 w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl">
                <div class="text-center mb-8">
                    <Zap class="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-white uppercase tracking-tighter">Adjust Credits</h3>
                    <p class="text-slate-500 text-[10px] uppercase font-bold mt-1">{{ adjustment.userName }}</p>
                </div>
                <div class="space-y-6">
                    <input v-model.number="adjustment.amount" type="number" placeholder="Amount (+/-)"
                        class="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-6 text-3xl font-bold text-white outline-none text-center" />
                    <textarea v-model="adjustment.reason" rows="2" placeholder="Reason (Required)"
                        class="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-300 outline-none focus:border-emerald-500/30"></textarea>
                    <div class="flex gap-3">
                        <button @click="isAdjustModalOpen = false"
                            class="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold text-sm uppercase">Cancel</button>
                        <button @click="handleAdjustCredits" :disabled="!adjustment.reason || isSubmitting"
                            class="flex-1 px-6 py-4 rounded-2xl bg-emerald-600 text-[#05070A] font-bold text-sm uppercase disabled:opacity-30">Apply</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isDeleteModalOpen"
            class="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm p-6">
            <div class="bg-[#0E1118] border border-white/10 w-full max-w-sm rounded-[3rem] p-12 shadow-2xl text-center">
                <div
                    class="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                    <Trash2 class="w-8 h-8 text-rose-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-2 uppercase tracking-tight">Hapus User?</h3>
                <p class="text-slate-500 text-xs mb-10 leading-relaxed uppercase font-medium tracking-widest">Tindakan
                    ini permanen dan akan menghapus semua data terkait user.</p>
                <div class="flex gap-3">
                    <button @click="isDeleteModalOpen = false"
                        class="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold text-sm uppercase tracking-widest">Batal</button>
                    <button @click="confirmDelete" :disabled="isSubmitting"
                        class="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">Ya,
                        Hapus</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Paksa dropdown option berwarna gelap agar tidak putih nabrak [cite: 605] */
.dark-select option {
    background-color: #0E1118;
    color: #94a3b8;
}
</style>