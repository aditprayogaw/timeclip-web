<script setup>
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue' 
</script>

<template>
  <div class="min-h-screen bg-timeclip-dark flex flex-col">
    <Navbar />
    
    <main class="grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>