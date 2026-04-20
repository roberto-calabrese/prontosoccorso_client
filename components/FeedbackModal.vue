<template>
  <div class="feedback-wrapper">
    <!-- Pulsante per aprire la modale -->
    <v-btn
      color="primary"
      icon="mdi-message-alert"
      class="feedback-fab"
      elevation="4"
      @click="openDialog"
      title="Segnala un errore o lascia un feedback"
    ></v-btn>

    <!-- Modale del Feedback -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 pb-2">
          Feedback / Segnala Errore
        </v-card-title>

        <v-card-text>
          <div v-if="successMessage" class="text-success mb-4">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="text-error mb-4">
            {{ errorMessage }}
          </div>

          <v-form ref="form" v-model="isFormValid" @submit.prevent="submitFeedback">
            <v-text-field
              v-model="formData.name"
              :rules="[v => !!v || 'Il nome è obbligatorio']"
              label="Il tuo nome"
              required
              variant="outlined"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="formData.email"
              :rules="[
                v => !!v || 'L\'email è obbligatoria',
                v => /.+@.+\..+/.test(v) || 'Inserisci un indirizzo email valido'
              ]"
              label="La tua email"
              type="email"
              required
              variant="outlined"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="formData.message"
              :rules="[v => !!v || 'Il messaggio è obbligatorio']"
              label="Messaggio o segnalazione"
              required
              variant="outlined"
              rows="4"
              class="mb-2"
            ></v-textarea>

            <!-- Container per Turnstile -->
            <div id="turnstile-container" class="mt-2 mb-2 d-flex justify-center"></div>

          </v-form>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog" :disabled="loading">Annulla</v-btn>
          <v-btn 
            color="primary" 
            :loading="loading" 
            :disabled="!isFormValid || !turnstileToken" 
            @click="submitFeedback"
            variant="elevated"
          >
            Invia
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { useRuntimeConfig, useHead } from '#imports';

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey;

const dialog = ref(false);
const isFormValid = ref(false);
const loading = ref(false);
const turnstileToken = ref('');
const turnstileWidgetId = ref<string | null>(null);

const successMessage = ref('');
const errorMessage = ref('');

const formData = reactive({
  name: '',
  email: '',
  message: ''
});

// Aggiungiamo lo script di Turnstile se non c'è già
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
      defer: true
    }
  ]
});

const openDialog = async () => {
  dialog.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  formData.name = '';
  formData.email = '';
  formData.message = '';
  turnstileToken.value = '';
  
  await nextTick();
  renderTurnstile();
};

const closeDialog = () => {
  dialog.value = false;
  resetTurnstile();
};

const renderTurnstile = () => {
  if (typeof window !== 'undefined' && window.turnstile) {
    try {
      turnstileWidgetId.value = window.turnstile.render('#turnstile-container', {
        sitekey: siteKey,
        callback: (token: string) => {
          turnstileToken.value = token;
        },
        'error-callback': () => {
          errorMessage.value = 'Errore nel caricamento del Captcha. Riprova.';
          turnstileToken.value = '';
        },
        'expired-callback': () => {
          errorMessage.value = 'Il Captcha è scaduto. Riprova.';
          turnstileToken.value = '';
        }
      });
    } catch (e) {
      console.error('Turnstile render error:', e);
    }
  } else {
    // Riprova tra poco se lo script non è ancora caricato
    setTimeout(renderTurnstile, 500);
  }
};

const resetTurnstile = () => {
  if (typeof window !== 'undefined' && window.turnstile && turnstileWidgetId.value !== null) {
    window.turnstile.reset(turnstileWidgetId.value);
    turnstileToken.value = '';
  }
};

const submitFeedback = async () => {
  if (!isFormValid.value || !turnstileToken.value) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/feedback`, {
      method: 'POST',
      body: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        'cf-turnstile-response': turnstileToken.value
      }
    });

    if (response && response.success) {
      successMessage.value = 'Feedback inviato con successo! Grazie per il tuo contributo.';
      formData.name = '';
      formData.email = '';
      formData.message = '';
      resetTurnstile();
      
      // Chiudi la modale dopo un po'
      setTimeout(() => {
        closeDialog();
      }, 3000);
    } else {
      errorMessage.value = response.message || 'Si è verificato un errore.';
      resetTurnstile();
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Si è verificato un errore durante l\'invio.';
    resetTurnstile();
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.feedback-wrapper {
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 99;
}

.feedback-fab {
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-error {
  color: #ff5252;
}

.text-success {
  color: #4caf50;
}
</style>
