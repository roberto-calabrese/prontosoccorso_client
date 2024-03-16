<template>
  <div>
    <v-snackbar
        v-model="active"
        elevation="24"
        color="blue"
        :close-on-back="false"
        timeout="-1"
        location="top center"
    >
      <v-icon icon="mdi mdi-access-point-network-off"></v-icon> <span class="mt-2">Connessione Internet assente.</span>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">

const active = ref(false);

const updateOnlineStatus = () => {
  active.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('offline', updateOnlineStatus)
  window.addEventListener('online', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('offline', updateOnlineStatus)
  window.removeEventListener('online', updateOnlineStatus)
})

</script>
