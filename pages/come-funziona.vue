<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="display-2">Come Funziona il Servizio</h2>
        <p class="subtitle-1">
          Ti spiego in dettaglio il processo dietro le quinte e come vengono forniti i dati relativi ai pronto soccorso.
        </p>
      </v-col>
    </v-row>

    <!-- Scraping dei Dati -->
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title>
            <h3 class="headline">1. Scraping dei Dati</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Il sistema utilizza un processo di scraping per raccogliere informazioni dai siti web dei pronto soccorso.<br>
              Questo avviene attraverso code e job che lavorano in parallelo.<br>
              Grazie a questa tecnica, i dati sono indipendenti dalle varie fonti e vengono raccolti in modo efficiente.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Comunicazione in Tempo Reale -->
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title>
            <h3 class="headline">2. Comunicazione in Tempo Reale</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Una volta che i dati sono stati recuperati, li inviamo al client tramite WebSocket.<br>
              Viene utilizzato Pusher.io per garantire una comunicazione in tempo reale.<br>
              Il tuo browser è costantemente in ascolto e si aggiorna automaticamente con i nuovi dati appena sono disponibili.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Attivazione del Polling -->
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title>
            <h3 class="headline">3. Attivazione del Polling</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Quando un utente specifico richiede i dati per una determinata località (ad esempio, Palermo), si attiva un polling nella pagina corrispondente.<br>
              Questo processo avvia i job necessari per recuperare i dati specifici richiesti dall'utente.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cache dei Dati -->
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title>
            <h3 class="headline">4. Cache dei Dati</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Per evitare richieste eccessive ai siti originali i dati vengono memorizzati in Redis.<br>
              Ogni dato ha un time-to-live (TTL) di un minuto (configurabile).<br>
              In questo modo, quando un utente richiede nuovamente i dati, non vengono effettuate ulteriori richieste di scraping ai siti originali.<br>
              Al contrario, i dati vengono presi dalla cache e restituiti all’utente in modo rapido e efficiente.<br>
              Questo approccio riduce il carico sui siti di pronto soccorso e garantisce che i dati siano sempre pronti per essere visualizzati dagli utenti.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ComeFunziona',
}
</script>

<style scoped>
</style>
