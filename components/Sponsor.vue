<template>
  <!-- Variante compatta per la Home -->
  <section v-if="mini" class="sponsor-mini">
    <a
        href="https://8route.it/"
        target="_blank"
        rel="noopener"
        class="sponsor-mini-card"
        title="Hosting e connettività fornite da 8route (Giulio Lo Presti)"
    >
      <span class="sponsor-mini-label text-overline">Powered by</span>
      <img
          src="/images/sponsor-8route-logo.png"
          alt="8route"
          class="sponsor-mini-logo"
          loading="lazy"
      />
      <span class="sponsor-mini-text">
        Hosting &amp; connettività · <strong>Giulio Lo Presti</strong>
      </span>
    </a>
  </section>

  <!-- Variante completa -->
  <section v-else class="sponsor-section" :class="{ 'sponsor-compact': compact }">
    <div class="text-center mb-6">
      <span class="sponsor-eyebrow text-overline">
        <v-icon icon="mdi-heart-pulse" size="small" class="mr-1"></v-icon>
        Sponsor & Partner tecnico
      </span>
      <h2 class="sponsor-title mt-2">Infrastruttura & Connettività</h2>
      <p class="sponsor-subtitle mx-auto">
        Questo servizio è reso possibile grazie al supporto di chi crede nel progetto.
      </p>
    </div>

    <v-card class="sponsor-card mx-auto" elevation="0">
      <v-row no-gutters>
        <!-- Colonna visiva: logo 8route + luogo di hosting -->
        <v-col cols="12" md="5" class="sponsor-media">
          <div class="sponsor-media-inner">
            <a
                href="https://8route.it/"
                target="_blank"
                rel="noopener"
                title="8route - born by expertise"
            >
              <img
                  src="/images/sponsor-8route-logo.png"
                  alt="8route"
                  class="sponsor-logo"
                  loading="lazy"
              />
            </a>
            <div class="sponsor-media-caption">
              <v-icon icon="mdi-map-marker" size="small"></v-icon>
              Ospitato presso Mediterra Data Centers · PMO01 · Palermo
            </div>
          </div>
        </v-col>

        <!-- Colonna testo -->
        <v-col cols="12" md="7" class="pa-6">
          <p class="sponsor-lead">
            L'infrastruttura di <strong>hosting</strong> e i servizi di
            <strong>connettività</strong> di Pronto Soccorso Live sono forniti da
            <a href="https://8route.it/" target="_blank" rel="noopener" class="sponsor-link">8route</a>,
            azienda di networking e infrastrutture digitali <em>«born by expertise»</em>,
            grazie a <strong>Giulio Lo Presti</strong>. I server sono ospitati nel data center
            <a href="https://mediterradatacenters.com/it/pmo-01/" target="_blank" rel="noopener" class="sponsor-link">Mediterra Data Centers</a>
            (PMO01), a Palermo.
          </p>

          <div class="sponsor-person">
            <v-avatar color="primary" size="44" class="mr-3">
              <v-icon icon="mdi-account-tie" color="white"></v-icon>
            </v-avatar>
            <div>
              <div class="sponsor-person-name">Giulio Lo Presti</div>
              <div class="sponsor-person-role">
                8route · ha fornito hosting e connettività
              </div>
              <a
                  href="https://www.linkedin.com/in/glpr/"
                  target="_blank"
                  rel="noopener"
                  class="sponsor-linkedin"
              >
                <v-icon icon="mdi-linkedin" size="small"></v-icon>
                Profilo LinkedIn
              </a>
            </div>
          </div>

          <div class="sponsor-chips">
            <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-transit-connection-variant">
              IP Transit
            </v-chip>
            <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-lan-connect">
              Remote Peering
            </v-chip>
            <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-shield-check">
              Network Protection
            </v-chip>
            <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-router-network">
              AS34428
            </v-chip>
            <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-map-marker">
              Mediterra · Palermo
            </v-chip>
          </div>

          <v-btn
              class="mt-5"
              color="primary"
              variant="flat"
              href="https://8route.it/"
              target="_blank"
              rel="noopener"
              append-icon="mdi-arrow-top-right"
          >
            Scopri 8route
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  /** Versione più contenuta (margini ridotti) */
  compact?: boolean
  /** Versione mini: banner ridotto per la Home */
  mini?: boolean
}>()
</script>

<style scoped lang="scss">
/* --- Variante mini (Home) --- */
.sponsor-mini {
  display: flex;
  justify-content: center;
  margin: 40px auto 8px;
}

.sponsor-mini-card {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  border-radius: 999px;
  text-decoration: none;
  /* pill sempre scura: il logo bianco resta leggibile in entrambi i temi */
  background: linear-gradient(135deg, #1b222b, #0f1216);
  border: 1px solid rgba(var(--v-theme-primary), 0.4);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.sponsor-mini-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.85);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.25);
  transform: translateY(-2px);
}

.sponsor-mini-label {
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 1.5px;
  font-weight: 700;
}

.sponsor-mini-logo {
  height: 22px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.sponsor-mini-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .sponsor-mini-text {
    display: none;
  }
}

/* --- Variante completa --- */
.sponsor-section {
  margin-top: 72px;
  margin-bottom: 24px;
}

.sponsor-section.sponsor-compact {
  margin-top: 40px;
}

.sponsor-eyebrow {
  color: rgb(var(--v-theme-primary));
  letter-spacing: 2px;
  font-weight: 700;
}

.sponsor-title {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 800;
  line-height: 1.15;
  color: rgb(var(--v-theme-string));
}

.sponsor-subtitle {
  max-width: 520px;
  margin-top: 6px;
  color: rgba(var(--v-theme-string), 0.7);
  font-size: 0.95rem;
}

.sponsor-card {
  max-width: 960px;
  border-radius: 20px !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.22);
  background: linear-gradient(155deg,
      rgba(var(--v-theme-surface), 1),
      rgba(var(--v-theme-navbar1), 1)) !important;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28) !important;
}

.sponsor-media {
  position: relative;
  background:
      linear-gradient(160deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.82)),
      url("/images/sponsor-datacenter.jpg") center / cover no-repeat;
  min-height: 220px;
}

.sponsor-media-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 28px 20px;
}

.sponsor-logo {
  width: 100%;
  max-width: 240px;
  height: auto;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.5));
}

.sponsor-media-caption {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-align: center;
}

.sponsor-lead {
  color: rgba(var(--v-theme-string), 0.9);
  line-height: 1.6;
  font-size: 1rem;
}

.sponsor-link,
.sponsor-linkedin,
.sponsor-media a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 600;
}

.sponsor-link:hover,
.sponsor-linkedin:hover {
  text-decoration: underline;
}

.sponsor-person {
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.sponsor-person-name {
  font-weight: 700;
  color: rgb(var(--v-theme-string));
  font-size: 1.05rem;
}

.sponsor-person-role {
  color: rgba(var(--v-theme-string), 0.7);
  font-size: 0.85rem;
}

.sponsor-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.85rem;
}

.sponsor-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
