<template>
  <div>
    <v-slide-y-reverse-transition>
      <v-btn
          v-if="isVisible"
          class="fab-button-back"
          variant="elevated"
          color="teal-lighten-3"
          @click="goBack"
          icon="mdi-arrow-left"
      />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Definizione props
const props = defineProps({
  destination: {
    type: String,
    required: true
  }
});

// Stato per controllare la visibilità del bottone
const isVisible = ref(false);

// Funzione per la navigazione
const goBack = () => {
  isVisible.value = false;
  const path = props.destination.startsWith('/') ? props.destination : '/' + props.destination;
  navigateTo(path);
};

// Mostra il bottone dopo un ritardo
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500); // Ritardo di 500ms
});
</script>

<style scoped>
.fab-button-back {
  z-index: 100;
  position: fixed;
  bottom: 5%;
  left: 20px;
}
</style>