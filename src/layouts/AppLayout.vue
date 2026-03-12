<template>
  <div class="min-h-screen bg-timeclip-dark text-white font-sans">
    <header>
      <slot name="navbar"></slot>
    </header>
    
    <main>
      <router-view />
    </main>

    </div>
</template>