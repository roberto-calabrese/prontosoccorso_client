<template>
  <v-dialog
      v-model="aperto"
      class="search-overlay"
      content-class="search-content"
      :fullscreen="mobile"
      :max-width="mobile ? undefined : 700"
      :transition="mobile ? 'dialog-bottom-transition' : 'fade-transition'"
      scrollable
  >
    <div class="palette" :class="{ 'palette--mobile': mobile }">
      <div class="palette-glow"></div>

      <!-- Campo di ricerca -->
      <div class="palette-search">
        <v-icon icon="mdi-magnify" size="22" class="palette-search-icon"></v-icon>

        <input
            ref="inputRef"
            v-model="query"
            class="palette-input"
            type="text"
            :placeholder="placeholder"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            enterkeyhint="go"
            @keydown="gestisciTasto"
        />

        <button v-if="query" class="palette-clear" type="button" aria-label="Cancella" @click="svuota">
          <v-icon icon="mdi-close-circle" size="18"></v-icon>
        </button>

        <button class="palette-esc" type="button" @click="chiudi">
          <span v-if="!mobile">esc</span>
          <v-icon v-else icon="mdi-close" size="20"></v-icon>
        </button>
      </div>

      <div ref="listaRef" class="palette-body">
        <!-- Caricamento indice -->
        <div v-if="searchStore.isLoading && !searchStore.isReady" class="palette-stato">
          <v-progress-circular indeterminate color="primary" size="26" width="3"></v-progress-circular>
          <p>Carico gli ospedali…</p>
        </div>

        <div v-else-if="searchStore.errore" class="palette-stato">
          <v-icon icon="mdi-wifi-off" size="30" color="primary"></v-icon>
          <p>Ricerca non disponibile.</p>
          <v-btn size="small" variant="tonal" color="primary" @click="searchStore.ensureIndex()">Riprova</v-btn>
        </div>

        <!-- Risultati -->
        <template v-else-if="query.trim()">
          <div v-if="!voci.length" class="palette-stato">
            <v-icon icon="mdi-map-search-outline" size="30" color="primary"></v-icon>
            <p>Nessun risultato per «{{ query }}»</p>
            <span class="palette-hint-testo">Prova con il nome dell'ospedale, del comune o della provincia.</span>
          </div>

          <template v-else>
            <template v-for="(voce, i) in voci" :key="voce.doc.url">
              <div v-if="voce.intestazione" class="palette-gruppo">
                {{ voce.intestazione }}
              </div>

              <button
                  :ref="(el) => registraVoce(el, i)"
                  type="button"
                  class="palette-voce"
                  :class="{ 'palette-voce--attiva': i === indiceAttivo }"
                  @click="vai(voce.doc)"
                  @mousemove="indiceAttivo = i"
              >
                <span class="palette-icona" :class="`palette-icona--${voce.doc.tipo}`">
                  <v-icon :icon="iconaDi(voce.doc)" size="20"></v-icon>
                </span>

                <span class="palette-testo">
                  <span class="palette-nome" v-html="highlight(voce.doc.nome, query)"></span>
                  <span class="palette-sotto">
                    <span v-html="highlight(sottotitoloDi(voce.doc), query)"></span>
                    <span v-if="voce.distanza !== undefined" class="palette-distanza">
                      <v-icon icon="mdi-navigation-variant" size="11"></v-icon>
                      {{ voce.distanza.toFixed(1) }} km
                    </span>
                  </span>
                </span>

                <span v-if="voce.doc.tipo === 'ospedale' && voce.doc.adulti === false" class="palette-tag">
                  Pediatrico
                </span>

                <v-icon
                    class="palette-freccia"
                    :icon="i === indiceAttivo ? 'mdi-keyboard-return' : 'mdi-chevron-right'"
                    size="18"
                ></v-icon>
              </button>
            </template>
          </template>
        </template>

        <!-- Stato iniziale -->
        <template v-else>
          <div v-if="searchStore.recenti.length" class="palette-gruppo palette-gruppo--azione">
            Ricerche recenti
            <button type="button" class="palette-azione" @click="searchStore.svuotaRecenti()">Cancella</button>
          </div>

          <button
              v-for="recente in searchStore.recenti"
              :key="recente.url"
              type="button"
              class="palette-voce"
              @click="vaiUrl(recente.url)"
          >
            <span class="palette-icona palette-icona--recente">
              <v-icon icon="mdi-history" size="20"></v-icon>
            </span>
            <span class="palette-testo">
              <span class="palette-nome">{{ recente.nome }}</span>
              <span class="palette-sotto">{{ recente.sottotitolo }}</span>
            </span>
            <v-icon class="palette-freccia" icon="mdi-chevron-right" size="18"></v-icon>
          </button>

          <div class="palette-gruppo">Sfoglia per regione</div>

          <div class="palette-chips">
            <button
                v-for="regione in searchStore.regioni"
                :key="regione.url"
                type="button"
                class="palette-chip"
                @click="vai(regione)"
            >
              <v-icon icon="mdi-map-marker-radius" size="14"></v-icon>
              {{ regione.nome }}
              <span class="palette-chip-num">{{ regione.n_ospedali }}</span>
            </button>
          </div>

          <div class="palette-suggerimenti">
            Prova a scrivere
            <button type="button" @click="query = 'san jacopo'">san jacopo</button>
            <button type="button" @click="query = 'pediatrico'">pediatrico</button>
            <button type="button" @click="query = 'provincia di firenze'">provincia di firenze</button>
          </div>
        </template>
      </div>

      <!-- Barra dei tasti -->
      <div class="palette-footer">
        <span class="palette-tasti"><kbd>↑</kbd><kbd>↓</kbd> naviga</span>
        <span class="palette-tasti"><kbd>↵</kbd> apri</span>
        <span class="palette-tasti"><kbd>esc</kbd> chiudi</span>
        <span class="palette-conteggio" v-if="searchStore.totali">
          {{ searchStore.totali }} voci indicizzate
        </span>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useSearchStore, sottotitoloDi } from '~/store/search'
import { highlight, type SearchDoc } from '~/utils/search-engine'

const searchStore = useSearchStore()
const router = useRouter()
const { mobile } = useDisplay()

const query = ref('')
const indiceAttivo = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listaRef = ref<HTMLElement | null>(null)
const vociRef = ref<HTMLElement[]>([])

const aperto = computed({
  get: () => searchStore.isOpen,
  set: (valore: boolean) => (valore ? searchStore.open() : searchStore.close()),
})

const placeholder = computed(() =>
    mobile.value ? 'Ospedale, provincia o regione…' : 'Cerca un ospedale, una provincia o una regione…',
)

const ETICHETTE: Record<SearchDoc['tipo'], string> = {
  ospedale: 'Ospedali',
  provincia: 'Province',
  regione: 'Regioni',
}

interface Voce {
  doc: SearchDoc
  distanza?: number
  intestazione?: string
}

/**
 * Risultati raggruppati per tipo mantenendo l'ordine di rilevanza:
 * il gruppo che contiene il match migliore compare per primo.
 */
const voci = computed<Voce[]>(() => {
  const risultati = searchStore.cerca(query.value, 12)
  const gruppi = new Map<SearchDoc['tipo'], Voce[]>()

  for (const risultato of risultati) {
    const tipo = risultato.doc.tipo
    if (!gruppi.has(tipo)) gruppi.set(tipo, [])
    gruppi.get(tipo)!.push({ doc: risultato.doc, distanza: risultato.distanza })
  }

  const elenco: Voce[] = []
  for (const [tipo, vociGruppo] of gruppi) {
    vociGruppo[0].intestazione = ETICHETTE[tipo]
    elenco.push(...vociGruppo)
  }

  return elenco
})

watch(voci, () => {
  indiceAttivo.value = 0
})

watch(
    () => searchStore.isOpen,
    async (isOpen) => {
      if (!isOpen) return
      indiceAttivo.value = 0
      await nextTick()
      inputRef.value?.focus()
    },
)

function registraVoce(el: any, i: number) {
  if (el) vociRef.value[i] = el as HTMLElement
}

function iconaDi(doc: SearchDoc): string {
  if (doc.tipo === 'regione') return 'mdi-map-marker-radius'
  if (doc.tipo === 'provincia') return 'mdi-city-variant-outline'
  return doc.adulti === false ? 'mdi-human-baby-changing-table' : 'mdi-hospital-building'
}

function muovi(delta: number) {
  if (!voci.value.length) return

  const totale = voci.value.length
  indiceAttivo.value = (indiceAttivo.value + delta + totale) % totale

  nextTick(() => {
    vociRef.value[indiceAttivo.value]?.scrollIntoView({ block: 'nearest' })
  })
}

function gestisciTasto(evento: KeyboardEvent) {
  switch (evento.key) {
    case 'ArrowDown':
      evento.preventDefault()
      muovi(1)
      break
    case 'ArrowUp':
      evento.preventDefault()
      muovi(-1)
      break
    case 'Enter': {
      evento.preventDefault()
      const voce = voci.value[indiceAttivo.value]
      if (voce) vai(voce.doc)
      break
    }
    case 'Escape':
      chiudi()
      break
  }
}

/** Un ospedale apre direttamente il suo dettaglio, provincia e regione la relativa pagina. */
function vai(doc: SearchDoc) {
  searchStore.aggiungiRecente(doc)
  vaiUrl(doc.url)
}

function vaiUrl(url: string) {
  chiudi()
  router.push(url)
}

function svuota() {
  query.value = ''
  inputRef.value?.focus()
}

function chiudi() {
  searchStore.close()
  setTimeout(() => {
    query.value = ''
  }, 200)
}

/** ⌘K / Ctrl+K ovunque, "/" quando non si sta già scrivendo. */
function scorciatoia(evento: KeyboardEvent) {
  const bersaglio = evento.target as HTMLElement | null
  const staScrivendo =
      !!bersaglio &&
      (bersaglio.tagName === 'INPUT' ||
          bersaglio.tagName === 'TEXTAREA' ||
          bersaglio.isContentEditable)

  if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k') {
    evento.preventDefault()
    searchStore.isOpen ? chiudi() : searchStore.open()
    return
  }

  if (evento.key === '/' && !staScrivendo && !searchStore.isOpen) {
    evento.preventDefault()
    searchStore.open()
  }
}

onMounted(() => {
  searchStore.caricaRecenti()
  window.addEventListener('keydown', scorciatoia)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', scorciatoia)
})
</script>

<style lang="scss">
/* Lo scrim appartiene all'overlay di Vuetify: niente scoped qui. */
.search-overlay .v-overlay__scrim {
  backdrop-filter: blur(6px);
  opacity: 0.72;
}

.search-content {
  align-self: flex-start;
  margin-top: 10vh;
}

@media (max-width: 960px) {
  .search-content {
    margin-top: 0;
  }
}
</style>

<style scoped lang="scss">
.palette {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 76vh;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
  background: linear-gradient(160deg,
      rgba(var(--v-theme-navbar2), 0.98),
      rgba(var(--v-theme-navbar1), 0.99));
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
}

.palette--mobile {
  max-height: 100%;
  height: 100%;
  border-radius: 0;
  border: none;
}

.palette-glow {
  position: absolute;
  top: -160px;
  left: 50%;
  width: 460px;
  height: 320px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.28), transparent 68%);
  pointer-events: none;
  z-index: 0;
}

/* ---------- input ---------- */

.palette-search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 14px 18px;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.palette-search-icon {
  color: rgb(var(--v-theme-primary));
  flex: none;
}

.palette-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: rgb(var(--v-theme-string));
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.6;
}

.palette-input::placeholder {
  color: rgba(var(--v-theme-string), 0.45);
  font-weight: 400;
}

.palette-clear,
.palette-esc {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-string), 0.55);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
}

.palette-clear:hover,
.palette-esc:hover {
  color: rgb(var(--v-theme-primary));
}

.palette-esc {
  padding: 3px 9px;
  border-radius: 7px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  border: 1px solid rgba(var(--v-theme-string), 0.2);
}

/* ---------- corpo ---------- */

.palette-body {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px;
}

.palette-gruppo {
  display: flex;
  align-items: center;
  padding: 12px 10px 6px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(var(--v-theme-string), 0.45);
}

.palette-gruppo--azione {
  justify-content: space-between;
}

.palette-azione {
  border: none;
  background: transparent;
  color: rgba(var(--v-theme-primary), 0.9);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  cursor: pointer;
}

.palette-voce {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 13px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease, transform 0.12s ease;
}

.palette-voce--attiva {
  background: rgba(var(--v-theme-primary), 0.13);
  border-color: rgba(var(--v-theme-primary), 0.42);
}

.palette-icona {
  flex: none;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  color: rgb(var(--v-theme-primary));
  background: radial-gradient(circle at 40% 30%,
      rgba(var(--v-theme-primary), 0.3),
      rgba(var(--v-theme-primary), 0.08) 75%);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.palette-icona--regione,
.palette-icona--recente {
  color: rgba(var(--v-theme-string), 0.75);
  background: rgba(var(--v-theme-string), 0.07);
  border-color: rgba(var(--v-theme-string), 0.14);
}

.palette-testo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.palette-nome {
  color: rgb(var(--v-theme-string));
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-sotto {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(var(--v-theme-string), 0.55);
  font-size: 0.78rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-distanza {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 7px;
  border-radius: 999px;
  color: rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.12);
  font-weight: 700;
  font-size: 0.7rem;
}

.palette-tag {
  flex: none;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.14);
  border: 1px solid rgba(var(--v-theme-info), 0.3);
}

.palette-freccia {
  flex: none;
  color: rgba(var(--v-theme-string), 0.3);
}

.palette-voce--attiva .palette-freccia {
  color: rgb(var(--v-theme-primary));
}

:deep(mark) {
  padding: 0 1px;
  border-radius: 3px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.16);
  font-weight: 800;
}

/* ---------- stati ---------- */

.palette-stato {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 42px 20px;
  text-align: center;
  color: rgba(var(--v-theme-string), 0.7);
}

.palette-stato p {
  margin: 0;
  font-weight: 600;
}

.palette-hint-testo {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-string), 0.45);
}

.palette-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 2px 10px 6px;
}

.palette-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
  background: rgba(var(--v-theme-primary), 0.07);
  color: rgb(var(--v-theme-string));
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.palette-chip:hover {
  background: rgba(var(--v-theme-primary), 0.16);
  border-color: rgba(var(--v-theme-primary), 0.5);
  transform: translateY(-1px);
}

.palette-chip-num {
  color: rgba(var(--v-theme-string), 0.5);
  font-size: 0.72rem;
  font-weight: 700;
}

.palette-suggerimenti {
  padding: 14px 12px 8px;
  color: rgba(var(--v-theme-string), 0.4);
  font-size: 0.78rem;
}

.palette-suggerimenti button {
  margin: 0 2px;
  padding: 2px 8px;
  border-radius: 7px;
  border: 1px dashed rgba(var(--v-theme-string), 0.2);
  background: transparent;
  color: rgba(var(--v-theme-string), 0.62);
  font-size: 0.76rem;
  cursor: pointer;
}

.palette-suggerimenti button:hover {
  color: rgb(var(--v-theme-primary));
  border-color: rgba(var(--v-theme-primary), 0.45);
}

/* ---------- footer ---------- */

.palette-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 9px 16px;
  border-top: 1px solid rgba(var(--v-theme-string), 0.08);
  background: rgba(var(--v-theme-navbar1), 0.6);
  color: rgba(var(--v-theme-string), 0.45);
  font-size: 0.72rem;
}

.palette-tasti {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.palette-conteggio {
  margin-left: auto;
  white-space: nowrap;
}

kbd {
  min-width: 19px;
  padding: 1px 5px;
  border-radius: 5px;
  border: 1px solid rgba(var(--v-theme-string), 0.18);
  background: rgba(var(--v-theme-string), 0.06);
  color: rgba(var(--v-theme-string), 0.7);
  font-family: inherit;
  font-size: 0.7rem;
  text-align: center;
}

@media (max-width: 600px) {
  .palette-footer .palette-tasti {
    display: none;
  }

  .palette-conteggio {
    margin: 0 auto;
  }
}

/* Tema chiaro */
.v-theme--customLightTheme {
  .palette {
    background: linear-gradient(160deg, #ffffff, #f4f7fa);
    box-shadow: 0 26px 70px rgba(20, 26, 33, 0.28);
  }

  .palette-glow {
    background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.12), transparent 68%);
  }

  .palette-footer {
    background: rgba(20, 26, 33, 0.03);
  }
}
</style>
