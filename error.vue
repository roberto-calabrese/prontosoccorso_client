<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

console.log(error);

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>{{ error.statusCode }}</h2>
    <h2>{{ error.statusMessage }}</h2>
    <button @click="handleError">Clear errors</button>
  </div>
</template>