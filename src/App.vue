<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue'
import { useNotificationStore } from './stores/notifications'
import { useAuthStore } from './stores/auth' // Tambahkan ini
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next'
import { watch, onMounted } from 'vue' // Tambahkan onMounted
import echo from './utils/echo' // Impor instance Echo kamu

const route = useRoute()
const notify = useNotificationStore()
const auth = useAuthStore()

// --- KODE MATA-MATA WEBSOCKET ---
onMounted(() => {
  console.log("%c🕵️ Monitoring WebSocket Aktif", "color: #10b981; font-weight: bold; font-size: 12px;");

  if (window.Pusher && window.Pusher.instances.length > 0) {
    const pusher = window.Pusher.instances[0];

    // 1. Pantau Perubahan Status
    pusher.connection.bind('state_change', (states) => {
      const colors = {
        connected: '#10b981',
        connecting: '#f59e0b',
        unavailable: '#ef4444',
        failed: '#ef4444',
        disconnected: '#6b7280'
      };
      console.log(`%c[WS Status]: ${states.current}`, `color: ${colors[states.current] || '#fff'}; font-weight: bold`);
    });

    // 2. Tangkap Error Spesifik
    pusher.connection.bind('error', (err) => {
      console.error("%c❌ WEBSOCKET ERROR DETECTED", "background: #ef4444; color: white; padding: 2px 5px; border-radius: 4px;");

      if (err.error) {
        console.error("Pesan Error:", err.error.message);
        console.error("Kode Error:", err.error.code);
      }

      // Analisa Error 404 (Sesuai gambar kamu tadi)
      if (err.status === 404 || (err.error && err.error.message.includes('404'))) {
        console.warn("💡 Analisa: Server Reverb di Backend belum jalan atau Ngrok salah arah port.");
      }
    });
  }

  // 3. Jalankan Listener jika sudah login
  if (auth.isAuthenticated && auth.user) {
    notify.listenToVideoUpdates(auth.user.id);
  }
})
// --- END KODE MATA-MATA ---

watch(() => route.path, () => {
  const container = document.getElementById('scroll-container')
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <div class="h-screen flex flex-col bg-timeclip-dark overflow-hidden">
    <Navbar v-if="!route.meta.hideNav" />

    <div id="scroll-container" class="grow relative flex flex-col"
      :class="[route.meta.hideNav ? 'overflow-hidden' : 'overflow-y-auto']">
      <main class="grow flex flex-col" :class="[!route.meta.hideNav ? 'pt-6' : '', { 'flex': route.meta.isApp }]">
        <router-view v-slot="{ Component, route: slotRoute }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="slotRoute.path" />
          </transition>
        </router-view>
      </main>

      <Footer v-if="!route.meta.hideNav" />
    </div>

    <transition name="toast">
      <div v-if="notify.isVisible"
        class="fixed bottom-10 right-10 z-200 flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 min-w-[320px]"
        :class="notify.type === 'success'
          ? 'bg-timeclip-emerald/10 border-timeclip-emerald/20 text-timeclip-emerald'
          : 'bg-red-500/10 border-red-500/20 text-red-500'">

        <div class="shrink-0">
          <CheckCircle2 v-if="notify.type === 'success'" class="w-6 h-6" />
          <AlertCircle v-else class="w-6 h-6" />
        </div>

        <div class="flex-1">
          <p class="text-[10px] uppercase font-black tracking-widest opacity-50 mb-0.5">
            {{ notify.type === 'success' ? 'Success' : 'Attention' }}
          </p>
          <p class="font-bold text-sm leading-tight text-white">{{ notify.message }}</p>
        </div>

        <button @click="notify.isVisible = false" class="hover:opacity-70 transition-opacity">
          <X class="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </transition>
  </div>
</template>