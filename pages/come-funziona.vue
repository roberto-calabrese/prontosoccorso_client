<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="display-2">Come Funziona il Servizio</h2>
        <p class="subtitle-1">
          Ti spiego in dettaglio il processo dietro le quinte e come vengono forniti i dati relativi ai pronto soccorso.
        </p>
        <div class="mt-4">
          <buy-me-coffe />
        </div>
      </v-col>
    </v-row>


    <v-row>

    </v-row>


    <v-row>



      <v-col md="8" cols="12">
        <!-- Scraping dei Dati -->
        <v-card class="elevation-3 mb-5">
          <v-card-title>
            <h4 class="headline text-amber-accent-2"><v-icon icon="mdi-bullseye-arrow"></v-icon> Scraping dei Dati</h4>
          </v-card-title>
          <v-card-text>
            <p>
              Il sistema utilizza un processo di scraping per raccogliere informazioni dai siti web dei pronto soccorso.<br>
              Questo avviene attraverso code e job che lavorano in parallelo.<br>
              Grazie a questa tecnica, i dati sono indipendenti dalle varie fonti e vengono raccolti in modo efficiente.
            </p>
          </v-card-text>
        </v-card>

        <!-- Comunicazione in Tempo Reale -->
        <v-card class="elevation-3 mb-5">
        <v-card-title>
          <h4 class="headline text-amber-accent-2"><v-icon icon="mdi-lightning-bolt-circle"></v-icon> Comunicazione in Tempo Reale</h4>
        </v-card-title>
        <v-card-text>
          <p>
            Una volta che i dati sono stati recuperati, vengono inviati al client tramite WebSocket.<br>
            Il tuo browser è costantemente in ascolto e si aggiorna automaticamente con i nuovi dati appena sono disponibili.
          </p>
        </v-card-text>
      </v-card>

        <!-- Attivazione del Polling -->
        <v-card class="elevation-3 mb-5">
          <v-card-title>
            <h4 class="headline text-amber-accent-2"><v-icon icon="mdi-sync"></v-icon> Attivazione del Polling</h4>
          </v-card-title>
          <v-card-text>
            <p>
              Quando un utente specifico richiede i dati per una determinata località (ad esempio, Palermo), si attiva un polling nella pagina corrispondente.<br>
              Questo processo avvia i job necessari per recuperare i dati specifici richiesti dall'utente.
            </p>
          </v-card-text>
        </v-card>


        <!-- Cache dei Dati -->
        <v-card class="elevation-3 mb-5">
          <v-card-title>
            <h4 class="headline text-amber-accent-2"><v-icon icon="mdi-database-clock"></v-icon> Cache dei Dati</h4>
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


      <v-col md="4" cols="12">
        <v-card class="elevation-3 mb-5">
          <v-img
              class="mx-auto"
              height="300"
              lazy-src="/images/lazy-come-funziona-dark.png"
              max-width="500"
              src="/images/come-funziona-white.gif"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
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
.v-card-title {
  white-space: initial;
}
</style>
