<template>
  <div class="cf">
    <!-- Hero -->
    <div class="cf-hero">
      <div class="cf-hero-inner">
        <span class="cf-eyebrow text-overline">
          <v-icon icon="mdi-cog-sync" size="small" class="mr-1"></v-icon>
          Dietro le quinte
        </span>
        <h1 class="cf-title">Come funziona il servizio</h1>
        <p class="cf-subtitle">
          Dall'apertura della pagina fino al dato aggiornato sul tuo schermo:
          ecco il viaggio delle informazioni sui pronto soccorso, in tempo reale.
        </p>
      </div>
      <div class="cf-hero-glow"></div>
    </div>

    <v-container>
      <!-- Animazione del flusso -->
      <v-card class="cf-flow-card mx-auto mb-10" elevation="0">
        <div class="cf-flow-head">
          <v-icon icon="mdi-transit-connection-variant" class="mr-2"></v-icon>
          Il percorso del dato
        </div>
        <SystemFlow />
      </v-card>

      <!-- Step dettagliati -->
      <v-row>
        <v-col
            v-for="(s, i) in steps"
            :key="i"
            cols="12"
            md="6"
        >
          <v-card class="cf-step h-100" elevation="0">
            <div class="cf-step-head">
              <div class="cf-step-icon">
                <v-icon :icon="s.icon" size="26"></v-icon>
              </div>
              <div>
                <span class="cf-step-num">0{{ i + 1 }}</span>
                <h3 class="cf-step-title">{{ s.title }}</h3>
              </div>
            </div>
            <v-card-text class="cf-step-text" v-html="s.text"></v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-center my-10">
        <p class="cf-cta-text mb-3">Ti è utile questo servizio?</p>
        <buy-me-coffe />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Pronto Soccorso Live - Come Funziona`,
  meta: [
    { name: 'description', content: `dettaglio del processo dietro le quinte su come vengono forniti i dati relativi ai pronto soccorso.` },
  ],
})

const steps = [
  {
    icon: 'mdi-bullseye-arrow',
    title: 'Scraping dei dati',
    text: `Il sistema raccoglie le informazioni dai siti ufficiali dei pronto soccorso tramite <strong>code e job che lavorano in parallelo</strong>. Così i dati restano indipendenti dalle singole fonti e vengono raccolti in modo efficiente.`,
  },
  {
    icon: 'mdi-sync',
    title: 'Attivazione del polling',
    text: `Quando apri la pagina di una località (ad esempio <strong>Palermo</strong>) si attiva un polling dedicato: partono i job necessari a recuperare esattamente i dati che ti servono.`,
  },
  {
    icon: 'mdi-database-clock',
    title: 'Cache dei dati',
    text: `I risultati vengono memorizzati in <strong>Redis</strong> con un TTL di circa un minuto. Le richieste successive leggono dalla cache: risposta immediata e <strong>carico minimo</strong> sui siti originali.`,
  },
  {
    icon: 'mdi-lightning-bolt-circle',
    title: 'Comunicazione in tempo reale',
    text: `I dati aggiornati arrivano al browser via <strong>WebSocket</strong>. La pagina è sempre in ascolto e si aggiorna da sola, senza bisogno di ricaricare.`,
  },
]
</script>

<style scoped lang="scss">
.cf-hero {
  position: relative;
  text-align: center;
  padding: 56px 20px 40px;
  overflow: hidden;
}

.cf-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.cf-hero-glow {
  position: absolute;
  top: -40%;
  left: 50%;
  width: 620px;
  height: 620px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.22), transparent 62%);
  pointer-events: none;
  z-index: 0;
}

.cf-eyebrow {
  color: rgb(var(--v-theme-primary));
  letter-spacing: 2px;
  font-weight: 700;
}

.cf-title {
  font-size: clamp(1.8rem, 4.5vw, 2.8rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 6px 0 12px;
  color: rgb(var(--v-theme-string));
}

.cf-subtitle {
  color: rgba(var(--v-theme-string), 0.72);
  font-size: 1.02rem;
  line-height: 1.55;
  max-width: 600px;
  margin: 0 auto;
}

.cf-flow-card {
  max-width: 940px;
  border-radius: 20px !important;
  padding: 22px 18px 26px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  background: linear-gradient(160deg,
      rgba(var(--v-theme-surface), 1),
      rgba(var(--v-theme-navbar1), 1)) !important;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.25) !important;
}

.cf-flow-head {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: rgb(var(--v-theme-string));
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.cf-step {
  border-radius: 16px !important;
  padding: 20px 22px;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: rgba(var(--v-theme-surface), 0.6) !important;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.cf-step:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 14px 34px rgba(var(--v-theme-primary), 0.18);
}

.cf-step-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 6px;
}

.cf-step-icon {
  width: 52px;
  height: 52px;
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

.cf-step-num {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: rgba(var(--v-theme-primary), 1);
}

.cf-step-title {
  font-size: 1.12rem;
  font-weight: 700;
  color: rgb(var(--v-theme-string));
  line-height: 1.2;
}

.cf-step-text {
  color: rgba(var(--v-theme-string), 0.78);
  line-height: 1.55;
  padding-top: 4px;
  padding-left: 0;
  padding-right: 0;
}

.cf-cta-text {
  color: rgba(var(--v-theme-string), 0.7);
  font-size: 0.95rem;
}

/* Tema chiaro: bagliore hero neutro, niente alone rosato */
.v-theme--customLightTheme .cf-hero-glow {
  background: radial-gradient(circle, rgba(20, 26, 33, 0.05), transparent 62%);
}
</style>
