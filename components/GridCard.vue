<template>
  <v-card class="grid-card" :to="to" flat>
    <div class="gc-glow"></div>
    <div class="gc-top">
      <div class="gc-icon">
        <v-icon :icon="icon" size="26"></v-icon>
      </div>
      <v-icon class="gc-arrow" icon="mdi-arrow-right" size="20"></v-icon>
    </div>

    <h3 class="gc-title">{{ title }}</h3>

    <div class="gc-count">
      <span class="gc-dot"></span>
      <strong>{{ count }}</strong>
      <span class="gc-count-label">{{ countLabel }}</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  to: string
  title: string
  count?: number | string
  icon?: string
  countLabel?: string
}>(), {
  icon: 'mdi-map-marker-radius',
  countLabel: 'ospedali',
})
</script>

<style scoped lang="scss">
.grid-card {
  position: relative;
  height: 100%;
  padding: 18px 18px 16px;
  border-radius: 18px !important;
  overflow: hidden;
  text-align: left;
  border: 1px solid rgba(var(--v-theme-primary), 0.18) !important;
  background: linear-gradient(155deg,
      rgba(var(--v-theme-navbar2), 1),
      rgba(var(--v-theme-navbar1), 1)) !important;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.28s ease,
              border-color 0.28s ease;
}

.grid-card:hover {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
  box-shadow: 0 16px 38px rgba(var(--v-theme-primary), 0.25) !important;
}

.gc-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 85% -10%,
      rgba(var(--v-theme-primary), 0.22), transparent 55%);
  opacity: 0.6;
  transition: opacity 0.28s ease;
  pointer-events: none;
}
.grid-card:hover .gc-glow { opacity: 1; }

.gc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.gc-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: radial-gradient(circle at 40% 30%,
      rgba(var(--v-theme-primary), 0.32),
      rgba(var(--v-theme-primary), 0.08) 75%);
  border: 1px solid rgba(var(--v-theme-primary), 0.38);
}

.gc-arrow {
  color: rgb(var(--v-theme-primary));
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.grid-card:hover .gc-arrow {
  opacity: 1;
  transform: translateX(0);
}

.gc-title {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: rgb(var(--v-theme-string));
}

.gc-count {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  font-size: 0.82rem;
  color: rgba(var(--v-theme-string), 0.65);
}

.gc-count strong {
  color: rgb(var(--v-theme-primary));
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
}

.gc-count-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.72rem;
}

.gc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-success));
  box-shadow: 0 0 8px rgba(var(--v-theme-success), 0.8);
  animation: gcpulse 2s ease-in-out infinite;
}

@keyframes gcpulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.4); opacity: 0.6; }
}

/* Tema chiaro: card bianche pulite, accento rosso solo su icona/freccia */
.v-theme--customLightTheme .grid-card {
  background: #ffffff !important;
  border-color: rgba(20, 26, 33, 0.1) !important;
  box-shadow: 0 6px 20px rgba(20, 26, 33, 0.08) !important;
}

.v-theme--customLightTheme .grid-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.45) !important;
  box-shadow: 0 16px 34px rgba(20, 26, 33, 0.14) !important;
}

.v-theme--customLightTheme .gc-glow {
  background: radial-gradient(120% 80% at 85% -10%,
      rgba(20, 26, 33, 0.04), transparent 55%);
}

@media (prefers-reduced-motion: reduce) {
  .gc-dot { animation: none; }
}
</style>
