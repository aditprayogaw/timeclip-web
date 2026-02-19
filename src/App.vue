<script setup>
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue' 
</script>

<template>
  <div class="min-h-screen bg-timeclip-dark flex flex-col">
    <Navbar />

    <main class="grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<style>
/* Animasi Smooth Page Transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Efek melayang naik sedikit */
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>