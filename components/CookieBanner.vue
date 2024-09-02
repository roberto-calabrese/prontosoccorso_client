<template>
  <v-snackbar
      v-model="showBanner"
      :timeout="-1"
      color="primary"
      variant="tonal"
      elevation=24

  >
    <div class="d-flex flex-column fill-height justify-center align-center text-white">
      <div class="mb-3">
        Questo sito utilizza Google Analytics per scopi di monitoraggio.
      </div>
      <div>
        <v-btn class="mr-3" @click="acceptCookies">Accetta</v-btn>
        <v-btn @click="declineCookies">Rifiuta</v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup>
import {ref, onMounted, shallowRef} from 'vue';
import { useRuntimeConfig } from '#app';

const showBanner = ref(false);
const config = useRuntimeConfig();
const GA_MEASUREMENT_ID = config.public.ga_measurement_id;

const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', 'true');
  showBanner.value = false;
  initializeGoogleAnalytics();
};

const declineCookies = () => {
  localStorage.setItem('cookiesAccepted', 'false');
  showBanner.value = false;
};

const initializeGoogleAnalytics = () => {
  console.log('initializeGoogleAnalytics')
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
};

onMounted(() => {
  const consent = localStorage.getItem('cookiesAccepted');
  if (consent === null) {
    // Mostra il banner solo se non c'è consenso o rifiuto
    showBanner.value = true;
  } else if (consent === 'true') {
    // Se l'utente ha già accettato, inizializza Google Analytics
    initializeGoogleAnalytics();
  }
});
</script>

<style scoped>
/* Aggiungi qualsiasi stile personalizzato qui, se necessario */
</style>