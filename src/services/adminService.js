import api from '../utils/axios';

export const adminService = {
    // Ambil statistik (Total User, Gemini Chart, FFmpeg Health)
    async getStats() {
        return await api.get('/admin/stats');
    },

    // Ambil 20 log sistem terbaru
    async getLogs() {
        return await api.get('/admin/logs');
    },

    // List user dengan pencarian dan pagination
    async getUsers(params = { search: '', page: 1 }) {
        return await api.get('/admin/users', { params });
    },

    // Update data user (tier, role, dll)
    async updateUser(id, userData) {
        return await api.put(`/admin/users/${id}`, userData);
    },

    // Tambah/kurangi kredit manual dengan alasan
    async adjustCredits(id, amount, reason) {
        return await api.post(`/admin/users/${id}/adjust-credits`, { amount, reason });
    },

    // Hapus user
    async deleteUser(id) {
        return await api.delete(`/admin/users/${id}`);
    }
};