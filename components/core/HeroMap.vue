<template>
  <div ref="root" class="heromap" :class="{ 'heromap--ripiego': ripiego }" aria-hidden="true">
    <div class="heromap-lente">
      <div class="heromap-scena">
        <div class="heromap-deriva">
          <img
              v-for="tile in tiles"
              :key="tile.key"
              class="heromap-tile"
              :class="{ 'heromap-tile--su': caricate[tile.key] }"
              :src="tile.url"
              :style="{ left: `${tile.x}px`, top: `${tile.y}px`, width: `${TILE * SCALA}px`, height: `${TILE * SCALA}px` }"
              decoding="async"
              alt=""
              @load="caricate[tile.key] = true"
              @error="segnalaErrore"
          />

          <span
              v-for="(punto, i) in puntiProiettati"
              :key="`p-${i}`"
              class="heromap-punto"
              :style="{ left: `${punto.x}px`, top: `${punto.y}px`, animationDelay: `${(i % 7) * 0.42}s` }"
          ></span>
        </div>
      </div>
    </div>

    <div class="heromap-velo"></div>
    <small class="heromap-credit">© OpenStreetMap<template v-if="!ripiego"> · © Esri</template></small>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'

interface Punto {
  lat: number | string
  lng: number | string
}

const props = withDefaults(defineProps<{
  /** presidi da inquadrare: la vista si adatta a contenerli tutti (anche come stringhe) */
  points?: Punto[]
  /** zoom massimo consentito, per non scendere al livello "via per via" */
  maxZoom?: number
}>(), {
  points: () => [],
  maxZoom: 12,
})

const TILE = 256
/*
 * Le tile vengono ingrandite rispetto alla loro risoluzione nativa: ne servono
 * molte meno per coprire l'hero (meno richieste al servizio di mappe) e il
 * disegno risulta più morbido, che è esattamente quello che serve a un fondale.
 */
const SCALA = 1.6
/*
 * Le tile coprono più superficie del riquadro visibile: la scena respira con una
 * lenta deriva (ken burns) e senza margine si vedrebbero i bordi scoperti.
 */
const MARGINE = TILE

const tema = useTheme()
const temaChiaro = computed(() => !tema.global.current.value.dark)

const root = ref<HTMLElement | null>(null)
/* dimensioni del riquadro convertite in pixel-mappa (cioè al netto dell'ingrandimento) */
const larghezza = ref(0)
const altezza = ref(0)
/* larghezza vera del riquadro: decide da che parte lasciare spazio al testo */
const larghezzaCss = ref(0)
/* tile già arrivate: ognuna compare per conto suo, senza aspettare le altre */
const caricate = ref<Record<string, true>>({})
/* se la basemap non risponde si ripiega su OpenStreetMap, adattata via CSS */
const ripiego = ref(false)

let osservatore: ResizeObserver | null = null
let attesa: ReturnType<typeof setTimeout> | null = null

/* ------------------------------------------------------------------ *
 * Proiezione Web Mercator (le stesse formule delle tile)
 * ------------------------------------------------------------------ */

function proiettaX(lng: number, mondo: number) {
  return ((lng + 180) / 360) * mondo
}

function proiettaY(lat: number, mondo: number) {
  const rad = (lat * Math.PI) / 180
  const y = Math.log(Math.tan(rad) + 1 / Math.cos(rad))
  return ((1 - y / Math.PI) / 2) * mondo
}

/*
 * Le coordinate arrivano dall'API anche come stringhe ("38.12"): vanno convertite
 * una volta sola qui, invece di fidarsi del tipo dichiarato.
 */
const puntiValidi = computed(() =>
    props.points
        .map(p => ({ lat: Number(p?.lat), lng: Number(p?.lng) }))
        .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng)),
)

if (import.meta.dev) {
  watchEffect(() => {
    if (props.points.length && !puntiValidi.value.length) {
      console.warn('[HeroMap] nessuna coordinata utilizzabile, la mappa resta vuota:', props.points[0])
    }
  })
}

/** Riquadro geografico dei presidi */
const bounds = computed(() => {
  const punti = puntiValidi.value
  if (!punti.length) return null

  return {
    minLat: Math.min(...punti.map(p => p.lat)),
    maxLat: Math.max(...punti.map(p => p.lat)),
    minLng: Math.min(...punti.map(p => p.lng)),
    maxLng: Math.max(...punti.map(p => p.lng)),
  }
})

/*
 * I presidi non vanno inquadrati al centro: lì ci sono titolo e pulsanti, e una
 * provincia con un solo pronto soccorso finirebbe esattamente dietro al testo.
 * Su schermi larghi il testo sta a sinistra e la mappa si sposta a destra; su
 * schermi stretti il testo sta in alto e i presidi scendono sotto.
 */
const scostamento = computed(() =>
    larghezzaCss.value >= 960 ? { x: 0.15, y: 0 } : { x: 0, y: 0.14 },
)

/**
 * Lo zoom più stretto che tiene dentro tutti i presidi lasciando aria attorno:
 * la mappa è decorativa, quindi meglio troppa provincia che troppo poca.
 * Lo spazio utile si stringe quanto più l'inquadratura è spostata di lato.
 */
const zoom = computed(() => {
  const b = bounds.value
  if (!b || !larghezza.value || !altezza.value) return 10

  const utileX = larghezza.value * (0.62 - Math.abs(scostamento.value.x) * 0.8)
  const utileY = altezza.value * (0.62 - Math.abs(scostamento.value.y) * 0.8)

  for (let z = props.maxZoom; z >= 5; z--) {
    const mondo = TILE * 2 ** z
    const dx = Math.abs(proiettaX(b.maxLng, mondo) - proiettaX(b.minLng, mondo))
    const dy = Math.abs(proiettaY(b.minLat, mondo) - proiettaY(b.maxLat, mondo))
    if (dx <= utileX && dy <= utileY) return z
  }

  return 5
})

/** Centro della vista in pixel assoluti al livello di zoom scelto */
const centro = computed(() => {
  const b = bounds.value
  const mondo = TILE * 2 ** zoom.value
  if (!b) return { x: proiettaX(12.5, mondo), y: proiettaY(41.9, mondo), mondo }

  return {
    x: (proiettaX(b.minLng, mondo) + proiettaX(b.maxLng, mondo)) / 2,
    y: (proiettaY(b.minLat, mondo) + proiettaY(b.maxLat, mondo)) / 2,
    mondo,
  }
})

/** Angolo alto-sinistro della scena in pixel assoluti, scostamento compreso */
const origine = computed(() => ({
  x: centro.value.x - larghezza.value * (0.5 + scostamento.value.x),
  y: centro.value.y - altezza.value * (0.5 + scostamento.value.y),
}))

/*
 * Basemap Esri Canvas: grigia, senza etichette (dietro a un titolo grande i
 * toponimi sarebbero solo rumore) e soprattutto senza chiave — le basemap CARTO
 * rispondono con una tile "API key required" invece di un errore HTTP, quindi
 * un ripiego automatico non potrebbe nemmeno accorgersene. È lo stesso servizio
 * già usato dalla mappa dei presidi per la vista satellitare.
 * Attenzione all'ordine: qui la riga precede la colonna.
 */
function urlTile(z: number, x: number, y: number) {
  if (ripiego.value) {
    const osm = ['a', 'b', 'c'][(x + y) % 3]
    return `https://${osm}.tile.openstreetmap.org/${z}/${x}/${y}.png`
  }

  const canvas = temaChiaro.value ? 'World_Light_Gray_Base' : 'World_Dark_Gray_Base'
  return `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${canvas}/MapServer/tile/${z}/${y}/${x}`
}

function segnalaErrore() {
  ripiego.value = true
}

const tiles = computed(() => {
  if (!bounds.value || !larghezza.value || !altezza.value) return []

  const z = zoom.value
  const massimo = 2 ** z
  const { x: ox, y: oy } = origine.value

  const daX = Math.floor((ox - MARGINE) / TILE)
  const aX = Math.floor((ox + larghezza.value + MARGINE) / TILE)
  const daY = Math.floor((oy - MARGINE) / TILE)
  const aY = Math.floor((oy + altezza.value + MARGINE) / TILE)

  const elenco: { key: string; url: string; x: number; y: number }[] = []

  for (let tx = daX; tx <= aX; tx++) {
    for (let ty = daY; ty <= aY; ty++) {
      if (ty < 0 || ty >= massimo) continue
      // longitudine ciclica: alle estremità del mondo si riparte dall'altro lato
      const wx = ((tx % massimo) + massimo) % massimo
      elenco.push({
        key: `${ripiego.value ? 'osm' : 'esri'}/${temaChiaro.value ? 'c' : 's'}/${z}/${tx}/${ty}`,
        url: urlTile(z, wx, ty),
        x: (tx * TILE - ox) * SCALA,
        y: (ty * TILE - oy) * SCALA,
      })
    }
  }

  return elenco
})

const puntiProiettati = computed(() => {
  if (!bounds.value || !larghezza.value) return []
  const { mondo } = centro.value
  const { x: ox, y: oy } = origine.value

  return puntiValidi.value.map(p => ({
    x: (proiettaX(p.lng, mondo) - ox) * SCALA,
    y: (proiettaY(p.lat, mondo) - oy) * SCALA,
  }))
})

function misura() {
  if (!root.value) return

  const l = root.value.clientWidth
  const a = root.value.clientHeight
  // al primo giro il riquadro può non avere ancora un layout: si riprova al frame dopo
  if (!l || !a) {
    requestAnimationFrame(misura)
    return
  }

  larghezza.value = l / SCALA
  altezza.value = a / SCALA
  larghezzaCss.value = l
}

onMounted(() => {
  misura()
  osservatore = new ResizeObserver(misura)
  if (root.value) osservatore.observe(root.value)

  /*
   * Una richiesta che resta appesa non fa scattare `error`: se dopo qualche
   * secondo non è arrivata nemmeno una tile, si passa comunque a OpenStreetMap.
   */
  if (!ripiego.value) {
    attesa = setTimeout(() => {
      if (!Object.keys(caricate.value).length) ripiego.value = true
    }, 6000)
  }
})

onBeforeUnmount(() => {
  osservatore?.disconnect()
  osservatore = null
  if (attesa) clearTimeout(attesa)
})
</script>

<style scoped lang="scss">
.heromap {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

/*
 * La dissolvenza è divisa su due strati perché una sola maschera con più
 * gradienti li sommerebbe invece di intersecarli: la lente sfuma i lati, la
 * scena sfuma sopra e sotto. Così la mappa si spegne nel nulla su tutti e
 * quattro i bordi, senza dover coprire i bordi con il colore del fondo — che
 * qui è un gradiente animato e tradirebbe subito il rettangolo.
 */
.heromap-lente {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(90deg, transparent 0%, #000 17%, #000 83%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 17%, #000 83%, transparent 100%);
}

.heromap-scena {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(180deg, transparent 0%, #000 26%, rgba(0, 0, 0, 0.85) 72%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 26%, rgba(0, 0, 0, 0.85) 72%, transparent 100%);
}

/* la deriva sta sotto le maschere, altrimenti trascinerebbe anche le sfumature */
.heromap-deriva {
  position: absolute;
  inset: 0;
  transform-origin: 50% 45%;
  animation: heromap-deriva 46s ease-in-out infinite alternate;
  will-change: transform;
}

/*
 * La basemap scura è quasi nera: sovrapposta com'è, dipinge solo un rettangolo
 * più scuro del fondo e il disegno non si legge. Con "screen" il nero non tocca
 * il fondo e restano le strade, che salgono come un ricamo di luce; nel tema
 * chiaro vale il ragionamento opposto, con "multiply" sparisce il bianco.
 */
.heromap-tile {
  position: absolute;
  display: block;
  opacity: 0;
  mix-blend-mode: screen;
  filter: saturate(0.7) brightness(1.7) contrast(1.15);
  transition: opacity 1.1s ease;
}

.heromap-tile--su {
  opacity: 0.9;
}

/* Ripiego su OpenStreetMap: basemap chiara, va scurita e desaturata a mano */
.heromap--ripiego .heromap-tile {
  mix-blend-mode: soft-light;
  filter: grayscale(1) brightness(1.35) contrast(0.85);
}

.heromap--ripiego .heromap-tile--su {
  opacity: 0.6;
}

.heromap-punto {
  position: absolute;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 12px 3px rgba(var(--v-theme-primary), 0.6);
  opacity: 0.8;
  animation: heromap-battito 3.4s ease-out infinite;
}

/* velo di colore che salda la mappa al fondo della pagina */
.heromap-velo {
  position: absolute;
  inset: 0;
  background:
      radial-gradient(62% 58% at 50% 40%, rgba(var(--v-theme-primary), 0.16), transparent 72%),
      linear-gradient(180deg,
          transparent 0%,
          transparent 46%,
          rgba(var(--v-theme-bg1), 0.28) 82%,
          rgba(var(--v-theme-bg1), 0.5) 100%);
}

.heromap-credit {
  position: absolute;
  right: 10px;
  bottom: 6px;
  font-size: 0.6rem;
  letter-spacing: 0.4px;
  color: rgba(var(--v-theme-string), 0.3);
}

/* Tema chiaro: basemap chiara su fondo chiaro, serve più presenza per leggersi */
.v-theme--customLightTheme {
  .heromap-tile {
    mix-blend-mode: multiply;
    filter: saturate(0.6) contrast(1.1) brightness(0.98);
  }

  .heromap-tile--su {
    opacity: 0.8;
  }

  /* niente alone rosato: nel tema chiaro il resto dell'hero usa bagliori neutri */
  .heromap-velo {
    background:
        radial-gradient(62% 58% at 50% 40%, rgba(20, 26, 33, 0.06), transparent 72%),
        linear-gradient(180deg,
            transparent 0%,
            transparent 46%,
            rgba(var(--v-theme-bg1), 0.32) 82%,
            rgba(var(--v-theme-bg1), 0.6) 100%);
  }

  .heromap--ripiego .heromap-tile {
    mix-blend-mode: multiply;
    filter: grayscale(0.9) contrast(0.9);
  }

  .heromap-punto {
    opacity: 0.65;
  }
}

@keyframes heromap-deriva {
  from { transform: scale(1.06) translate3d(-1.1%, -0.7%, 0); }
  to   { transform: scale(1.14) translate3d(1.1%, 0.8%, 0); }
}

@keyframes heromap-battito {
  0%   { transform: scale(0.6); opacity: 0; }
  22%  { opacity: 0.9; }
  70%  { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .heromap-deriva { animation: none; transform: scale(1.06); }
  .heromap-punto { animation: none; opacity: 0.65; }
  .heromap-tile { transition: none; }
}
</style>
