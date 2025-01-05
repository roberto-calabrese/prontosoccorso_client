<template>
  <v-btn rounded @click="toggleTheme" class="text-string">
    <v-icon>{{ themeStore.themeIcon }}</v-icon>
  </v-btn>
</template>

<script setup>
import { useThemeStore } from '@/store/theme'

// Accedi allo store
const themeStore = useThemeStore()

// Funzione per cambiare il tema
const toggleTheme = themeStore.toggleTheme
</script>