<template>
    <!-- Parallax Header -->
    <v-parallax dark src="/images/ps-live-progetto.png">
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-1 btn-shine">
          Pronto Soccorso Live
        </h1>
        <h4 class="subheading">
          Un progetto open source per monitorare lo stato dei pronto soccorso in Italia
        </h4>
      </div>
    </v-parallax>

    <!-- Main Content -->
    <v-container class="mt-10">
      <!-- Introduzione -->
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="headline">Introduzione</v-card-title>
            <v-card-text>
              Benvenuti su <strong>Pronto Soccorso Live</strong>, un progetto nato dalla passione per la tecnologia e per offrire un servizio utile alla comunità. Qui troverai una panoramica in tempo reale dello stato dei pronto soccorso in Italia, suddiviso per provincia. Tutti i dati provengono da fonti istituzionali ufficiali il cui obiettivo è rendere queste informazioni facilmente accessibili a tutti.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Collaborazione -->
      <v-row class="mt-10" id="contribute">
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="headline">Codice Sorgente e Collaborazione</v-card-title>
            <v-card-text>
              Il codice sorgente del progetto è disponibile su <v-icon color="blue">mdi-github</v-icon> <a href="https://github.com/roberto-calabrese" target="_blank">GitHub</a>. Se sei uno sviluppatore, un designer, o semplicemente un appassionato, ti invito a unirti per migliorare il progetto. Ogni contributo è ben accetto!
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Trasparenza e Privacy -->
      <v-row class="mt-10">
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="headline">Trasparenza e Privacy</v-card-title>
            <v-card-text>
              <p><strong>Pronto Soccorso Live</strong> non intende sostituire le informazioni ufficiali. I dati non vengono salvati permanentemente e non vengono raccolte informazioni sugli utenti. Viene utilizzata una cache temporanea per ridurre le richieste alle fonti, e Google Analytics per monitorare le visite, in modo del tutto anonimo.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tecnologie e Costi -->
      <v-row class="mt-10">
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="headline">Tecnologie e Costi</v-card-title>
            <v-card-text>
              Questo progetto utilizza tecnologie moderne e un'infrastruttura ospitata su AWS. Nonostante sia sviluppato nel tempo libero e senza scopo di lucro, ci sono dei costi da sostenere, come il dominio e le risorse cloud. Il tuo supporto può fare la differenza.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Supporta il Progetto -->
      <v-row class="mt-10">
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="pa-4">
            <v-card-title class="headline">Supporta il Progetto</v-card-title>
            <v-card-text>
              Se trovi utile questo servizio e desideri che continui a crescere, considera una donazione su <v-icon color="orange">mdi-coffee</v-icon> <a href="https://buymeacoffee.com/roberto.calabrese?l=it" target="_blank">Buy Me a Coffee</a>. Il tuo contributo aiuterà a coprire i costi e a migliorare il progetto.
            </v-card-text>
            <v-btn
                color="orange"
                dark
                large
                href="https://buymeacoffee.com/roberto.calabrese?l=it"
                target="_blank"
            >
              Offrimi un caffè
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
 useHead({
  title: `Pronto Soccorso Live -Progetto`,
  meta: [
{name: 'description', content: `Perché lo faccio, come lo faccio, fallo anche tu.`},
  ],
})
</script>

<style scoped>
.headline {
  font-weight: bold;
}

/* From Uiverse.io by neerajbaniwal */
.btn-shine {
  padding: 0 48px;
  color: #fff;
  background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
  background-position: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s infinite linear;
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  white-space: nowrap;
  font-family: "Poppins", sans-serif;
}

.subheading{
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  max-width: 80%;
  text-align: center;
  color: #c3c3c3;
}


@-moz-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 400px;
  }
  100% {
    background-position: 400px;
  }
}
@-webkit-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 400px;
  }
  100% {
    background-position: 400px;
  }
}
@-o-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 400px;
  }
  100% {
    background-position: 400px;
  }
}
@keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 400px;
  }
  100% {
    background-position: 400px;
  }
}

</style>