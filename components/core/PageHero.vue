<template>
  <header class="hero" :class="{ 'hero--con-mappa': haMappa }">
    <core-hero-map v-if="haMappa" :points="mapPoints" />
    <div class="hero-glow"></div>
    <div class="hero-grid"></div>
    <div class="hero-inner">
      <span class="hero-badge">
        <span class="hero-live-dot"></span>
        LIVE
        <template v-if="eyebrow"> · {{ eyebrow }}</template>
      </span>

      <h1 class="hero-title">
        <slot />
      </h1>

      <p v-if="subtitle" class="hero-sub">{{ subtitle }}</p>

      <div v-if="count !== undefined && count !== null" class="hero-stat">
        <v-icon icon="mdi-hospital-building" size="small" class="mr-1"></v-icon>
        <span class="hero-stat-num">{{ display }}</span>
        <span class="hero-stat-label">{{ countLabel }}</span>
      </div>

      <div class="hero-azioni">
        <slot name="azioni" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  subtitle?: string
  count?: number | null
  countLabel?: string
  /** presidi da usare come sfondo cartografico dell'hero */
  mapPoints?: { lat: number; lng: number }[]
}>(), {
  countLabel: 'Ospedali',
  mapPoints: () => [],
})

const haMappa = computed(() => props.mapPoints.length > 0)

/* Conteggio animato */
const display = ref(0)
let raf = 0

function animateTo(target: number) {
  cancelAnimationFrame(raf)
  const start = display.value
  const startTime = performance.now()
  const duration = 900
  const step = (now: number) => {
    const p = Math.min((now - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    display.value = Math.round(start + (target - start) * eased)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

watch(() => props.count, (v) => {
  if (typeof v === 'number') animateTo(v)
}, { immediate: true })
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  text-align: center;
  padding: 44px 20px 30px;
  overflow: hidden;
}

/*
 * Con la cartina dietro l'hero diventa una scena: si prende tutta l'altezza
 * disponibile fino alle tabelle, così la mappa ha spazio per raccontare la
 * provincia invece di comparire come una striscia.
 */
.hero--con-mappa {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(420px, 62vh, 720px);
  padding: 40px 20px 34px;
}

/* con la cartina dietro, alone e reticolo devono farsi da parte */
.hero--con-mappa .hero-glow {
  opacity: 0.55;
}

.hero--con-mappa .hero-grid {
  opacity: 0.4;
}

.hero--con-mappa .hero-title,
.hero--con-mappa .hero-sub {
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
}

.hero--con-mappa .hero-badge,
.hero--con-mappa .hero-stat {
  backdrop-filter: blur(6px);
}

.hero--con-mappa .hero-azioni {
  margin-top: 26px;
}

/*
 * Da qui in su l'hero si sdoppia: il testo occupa la colonna di sinistra e la
 * mappa resta libera a destra, dove HeroMap sposta l'inquadratura dei presidi.
 * Sotto questa soglia si torna alla colonna centrata, con i presidi più in basso.
 */
@media (min-width: 960px) {
  .hero--con-mappa {
    justify-content: flex-start;
    text-align: left;
    padding-left: clamp(24px, 6vw, 96px);
  }

  .hero--con-mappa .hero-inner {
    margin: 0;
    max-width: 600px;
  }

  .hero--con-mappa .hero-sub {
    margin: 0;
  }
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: 0 auto;
}

.hero-glow {
  position: absolute;
  top: -55%;
  left: 50%;
  width: 680px;
  height: 680px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.2), transparent 62%);
  pointer-events: none;
  z-index: 0;
}

.hero-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
      linear-gradient(rgba(var(--v-theme-primary), 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--v-theme-primary), 0.06) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 70%);
  pointer-events: none;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.hero-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.6);
  animation: livepulse 1.6s ease-out infinite;
}

.hero-title {
  margin: 14px 0 8px;
  font-size: clamp(1.7rem, 4.6vw, 2.9rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.5px;
  color: rgb(var(--v-theme-string));
  text-transform: uppercase;
}

.hero-title :deep(.hl) {
  background: linear-gradient(90deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-sub {
  max-width: 560px;
  margin: 0 auto;
  color: rgba(var(--v-theme-string), 0.72);
  font-size: 1rem;
  line-height: 1.5;
}

.hero-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 18px;
  padding: 8px 18px;
  border-radius: 14px;
  color: rgb(var(--v-theme-string));
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.22);
}

.hero-stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: rgb(var(--v-theme-primary));
}

.hero-stat-label {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-string), 0.7);
  text-transform: uppercase;
}

@keyframes livepulse {
  0%   { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(var(--v-theme-primary), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0); }
}

/* Tema chiaro: bagliori neutri, niente alone rosato */
.v-theme--customLightTheme .hero-glow {
  background: radial-gradient(circle, rgba(20, 26, 33, 0.05), transparent 60%);
}

.v-theme--customLightTheme .hero-grid {
  background-image:
      linear-gradient(rgba(20, 26, 33, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(20, 26, 33, 0.05) 1px, transparent 1px);
}

.v-theme--customLightTheme .hero--con-mappa .hero-title,
.v-theme--customLightTheme .hero--con-mappa .hero-sub {
  text-shadow: 0 2px 16px rgba(255, 255, 255, 0.6);
}

.v-theme--customLightTheme .hero-stat {
  background: rgba(20, 26, 33, 0.035);
  border-color: rgba(20, 26, 33, 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .hero-live-dot { animation: none; }
}
</style>
