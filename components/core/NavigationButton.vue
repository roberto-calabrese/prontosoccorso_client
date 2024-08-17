<template>
  <div>
    <v-fab-transition>
      <v-btn
          v-if="canGoBack"
          class="fab-button-back"
          @click="goBack"
          icon="mdi-arrow-left"
      >
      </v-btn>
    </v-fab-transition>
    <v-fab-transition>
      <v-btn
          v-if="canGoForward"
          class="fab-button-next"
          @click="goForward"
          icon="mdi-arrow-right"
      >
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

// Mantieni lo storico delle pagine visitate
const historyStack = ref([]);
const currentPageIndex = ref(-1);

// Computed per determinare se mostrare i pulsanti
const canGoBack = computed(() => currentPageIndex.value > 0);
const canGoForward = computed(() => currentPageIndex.value < historyStack.value.length - 1);

// Funzione per andare indietro
const goBack = () => {
  if (canGoBack.value) {
    currentPageIndex.value--;
    router.push(historyStack.value[currentPageIndex.value]);
  }
};

// Funzione per andare avanti
const goForward = () => {
  if (canGoForward.value) {
    currentPageIndex.value++;
    router.push(historyStack.value[currentPageIndex.value]);
  }
};

// Aggiorna lo storico delle pagine quando cambia il percorso
watch(route, (newRoute) => {
  if (historyStack.value[currentPageIndex.value] !== newRoute.path) {
    // Rimuovi le pagine future se ne visiti una nuova
    historyStack.value.splice(currentPageIndex.value + 1);
    historyStack.value.push(newRoute.path);
    currentPageIndex.value = historyStack.value.length - 1;
  }
});
</script>

<style scoped>
.fab-button-back {
  z-index: 100;
  position: fixed;
  bottom: 5%;
  left: 20px;
}

.fab-button-next {
  z-index: 10;
  position: fixed;
  bottom: 5%;
  right: 20px;
}
</style>