<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue'
import { useNotificationStore } from './stores/notifications'
import { CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { watch } from 'vue'

const route = useRoute()
const notify = useNotificationStore()

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

    <div id="scroll-container" class="grow relative flex flex-col" :class="[route.meta.hideNav ? 'overflow-hidden' : 'overflow-y-auto']">
      <main class="grow flex flex-col" :class="[!route.meta.hideNav ? 'pt-6' : '', { 'flex': route.meta.isApp }]">
        <router-view v-slot="{ Component, route: slotRoute }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="slotRoute.path" />
          </transition>
        </router-view>
      </main>

      <Footer v-if="!route.meta.hideNav" />
    </div>

    <transition name="toast">...</transition>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-color: #0B0F17;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Toast Animations */
.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.4s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>