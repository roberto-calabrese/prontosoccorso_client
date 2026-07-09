<template>
  <div class="pj">
    <!-- Parallax Header -->
    <v-parallax height="450" dark src="/images/ps-live-progetto.png">
      <div class="pj-hero d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-1 btn-shine">
          Pronto Soccorso Live
        </h1>
        <h4 class="subheading">
          Un progetto open source per monitorare lo stato dei pronto soccorso in Italia
        </h4>
      </div>
    </v-parallax>

    <!-- Main Content -->
    <v-container class="pj-content">
      <!-- Introduzione -->
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="pj-card pj-card--intro" elevation="0">
            <div class="pj-card-head">
              <div class="pj-icon"><v-icon icon="mdi-human-greeting-variant" size="26"></v-icon></div>
              <h2 class="pj-card-title">Introduzione</h2>
            </div>
            <v-card-text class="pj-card-text">
              Benvenuti su <strong>Pronto Soccorso Live</strong>, un progetto nato dalla passione per la tecnologia e dal desiderio di offrire un servizio utile alla comunità. Qui trovi una panoramica in tempo reale dello stato dei pronto soccorso in Italia, suddiviso per provincia. Tutti i dati provengono da <strong>fonti istituzionali ufficiali</strong>, con l'obiettivo di renderli facilmente accessibili a tutti.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Griglia feature -->
      <v-row class="mt-2">
        <v-col
            v-for="(f, i) in features"
            :key="i"
            cols="12"
            md="4"
            :id="f.id"
        >
          <v-card class="pj-card h-100" elevation="0">
            <div class="pj-card-head">
              <div class="pj-icon"><v-icon :icon="f.icon" size="24"></v-icon></div>
              <h3 class="pj-card-title pj-card-title--sm">{{ f.title }}</h3>
            </div>
            <v-card-text class="pj-card-text" v-html="f.text"></v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sostieni il Progetto -->
      <v-row class="mt-6">
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="pj-card pj-card--support text-center" elevation="0">
            <div class="pj-support-icon">
              <v-icon icon="mdi-hand-heart" size="34"></v-icon>
            </div>
            <h2 class="pj-card-title justify-center">Sostieni il progetto</h2>
            <v-card-text class="pj-card-text">
              Se trovi utile questo servizio e vuoi che continui a crescere, considera una donazione su
              <v-icon color="orange" size="small">mdi-coffee</v-icon>
              <a href="https://buymeacoffee.com/roberto.calabrese?l=it" target="_blank" rel="noopener">Buy Me a Coffee</a>.
              Ogni contributo aiuta a coprire i costi e a migliorare il progetto.
            </v-card-text>
            <div class="text-center mb-2">
              <buy-me-coffe />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sponsor -->
      <v-row class="mt-6">
        <v-col cols="12" md="10" offset-md="1">
          <Sponsor compact />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Pronto Soccorso Live - Progetto`,
  meta: [
    { name: 'description', content: `Perché lo faccio, come lo faccio, fallo anche tu.` },
  ],
})

const features = [
  {
    id: 'contribute',
    icon: 'mdi-code-json',
    title: 'Codice & collaborazione',
    text: `Il progetto è <strong>work in progress</strong> e open source su <a href="https://github.com/roberto-calabrese" target="_blank" rel="noopener">GitHub</a>. Sviluppatori, designer o semplici appassionati: ogni contributo per arricchire la banca dati è ben accetto!`,
  },
  {
    id: '',
    icon: 'mdi-database-eye-off-outline',
    title: 'Trasparenza & privacy',
    text: `Non sostituiamo le informazioni ufficiali. I dati non vengono salvati in modo permanente e non raccogliamo informazioni personali: solo una cache temporanea e statistiche di visita del tutto anonime.`,
  },
  {
    id: '',
    icon: 'mdi-server-network',
    title: 'Tecnologie & costi',
    text: `L'infrastruttura di hosting e connettività è fornita tramite <strong>Open Hub Med</strong> e <a href="https://mediterradatacenters.com/it/pmo-01/" target="_blank" rel="noopener">Mediterra Data Centers</a>, grazie al supporto di <strong>Giulio Lo Presti</strong>. Restano comunque dei costi (dominio, risorse cloud) da sostenere.`,
  },
]
</script>

<style scoped lang="scss">
.pj-content {
  margin-top: -60px;
  position: relative;
  z-index: 2;
}

.pj-card {
  border-radius: 18px !important;
  padding: 22px 24px;
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  background: linear-gradient(160deg,
      rgba(var(--v-theme-surface), 1),
      rgba(var(--v-theme-navbar1), 0.92)) !important;
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.22) !important;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.pj-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 18px 44px rgba(var(--v-theme-primary), 0.18) !important;
}

.pj-card--intro {
  border-color: rgba(var(--v-theme-primary), 0.28);
}

.pj-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 4px;
}

.pj-icon {
  width: 50px;
  height: 50px;
  flex: 0 0 auto;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: radial-gradient(circle at 40% 30%,
      rgba(var(--v-theme-primary), 0.3),
      rgba(var(--v-theme-primary), 0.08) 75%);
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
}

.pj-card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: rgb(var(--v-theme-string));
  line-height: 1.15;
  display: flex;
}

.pj-card-title--sm {
  font-size: 1.1rem;
}

.pj-card-text {
  color: rgba(var(--v-theme-string), 0.8);
  line-height: 1.58;
  padding-left: 0;
  padding-right: 0;
}

.pj-card-text a {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  text-decoration: none;
}
.pj-card-text a:hover { text-decoration: underline; }

/* Support card */
.pj-card--support {
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.pj-support-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.28), rgba(var(--v-theme-primary), 0.05) 72%);
  border: 1px solid rgba(var(--v-theme-primary), 0.4);
  animation: floaty 3.5s ease-in-out infinite;
}

@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

/* Hero shine (invariato) */
.subheading {
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

@keyframes shine {
  0% { background-position: 0; }
  60% { background-position: 400px; }
  100% { background-position: 400px; }
}
</style>
