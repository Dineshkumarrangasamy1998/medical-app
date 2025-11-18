<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main class="mx-auto max-w-7xl p-4">
    <RouterView />
  </main>
  
</template>