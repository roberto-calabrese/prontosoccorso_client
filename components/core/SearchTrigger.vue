<template>
  <!-- Barra grande, pensata per l'header della home -->
  <button
      v-if="variant === 'hero'"
      type="button"
      class="trigger-hero"
      @click="searchStore.open()"
  >
    <v-icon icon="mdi-magnify" size="22" class="trigger-hero-icon"></v-icon>
    <span class="trigger-hero-testo">
      Cerca <span class="trigger-hero-rotante">{{ esempio }}</span>
    </span>
    <span class="trigger-hero-kbd">
      <kbd>{{ tastoModificatore }}</kbd><kbd>K</kbd>
    </span>
  </button>

  <!-- Icona compatta per la barra di navigazione -->
  <button
      v-else-if="mobile"
      type="button"
      class="trigger-icona"
      aria-label="Cerca"
      @click="searchStore.open()"
  >
    <v-icon icon="mdi-magnify" size="24"></v-icon>
  </button>

  <button v-else type="button" class="trigger-pill" @click="searchStore.open()">
    <v-icon icon="mdi-magnify" size="18"></v-icon>
    <span class="trigger-pill-testo">Cerca…</span>
    <span class="trigger-pill-kbd">
      <kbd>{{ tastoModificatore }}</kbd><kbd>K</kbd>
    </span>
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useSearchStore } from '~/store/search'

withDefaults(defineProps<{ variant?: 'nav' | 'hero' }>(), { variant: 'nav' })

const searchStore = useSearchStore()
const { mobile } = useDisplay()

const tastoModificatore = ref('Ctrl')

/* Esempi che si alternano nel placeholder della barra grande */
const ESEMPI = ['un ospedale', 'una provincia', 'una regione', 'il PS più vicino']
const esempio = ref(ESEMPI[0])
let rotazione: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    tastoModificatore.value = '⌘'
  }

  let i = 0
  rotazione = setInterval(() => {
    i = (i + 1) % ESEMPI.length
    esempio.value = ESEMPI[i]
  }, 2600)
})

onBeforeUnmount(() => {
  if (rotazione) clearInterval(rotazione)
})
</script>

<style scoped lang="scss">
/* ---------- variante hero ---------- */

.trigger-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(560px, 100%);
  margin: 22px auto 0;
  padding: 15px 18px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.32);
  background: linear-gradient(140deg,
      rgba(var(--v-theme-navbar2), 0.92),
      rgba(var(--v-theme-navbar1), 0.92));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
}

.trigger-hero:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.68);
  box-shadow: 0 18px 46px rgba(var(--v-theme-primary), 0.22);
}

.trigger-hero-icon {
  color: rgb(var(--v-theme-primary));
  flex: none;
}

.trigger-hero-testo {
  flex: 1;
  min-width: 0;
  text-align: left;
  color: rgba(var(--v-theme-string), 0.55);
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-hero-rotante {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  animation: sfuma 2.6s ease-in-out infinite;
}

.trigger-hero-kbd {
  flex: none;
  display: flex;
  gap: 3px;
}

/* ---------- variante navbar ---------- */

.trigger-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  margin-right: 6px;
  padding: 0 10px 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-string), 0.16);
  background: rgba(var(--v-theme-string), 0.06);
  color: rgba(var(--v-theme-string), 0.62);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.trigger-pill:hover {
  color: rgb(var(--v-theme-string));
  border-color: rgba(var(--v-theme-primary), 0.55);
  background: rgba(var(--v-theme-primary), 0.1);
}

.trigger-pill-testo {
  font-size: 0.85rem;
  font-weight: 500;
}

.trigger-pill-kbd {
  display: flex;
  gap: 3px;
}

.trigger-icona {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgb(var(--v-theme-string));
  cursor: pointer;
}

.trigger-icona:hover {
  background: rgba(var(--v-theme-primary), 0.12);
}

kbd {
  min-width: 18px;
  padding: 1px 4px;
  border-radius: 5px;
  border: 1px solid rgba(var(--v-theme-string), 0.18);
  background: rgba(var(--v-theme-string), 0.07);
  color: rgba(var(--v-theme-string), 0.6);
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
}

@keyframes sfuma {
  0%, 100% { opacity: 1; }
  46% { opacity: 1; }
  50% { opacity: 0.35; }
  54% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .trigger-hero-rotante { animation: none; }
}
</style>
