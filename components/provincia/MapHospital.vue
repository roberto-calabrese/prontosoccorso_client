<template>
  <div class="psm" :style="{ height }">
    <div ref="mapEl" class="psm-map"></div>

    <!-- Suggerimento: il compromesso migliore fra strada da fare e affollamento -->
    <transition name="psm-fade">
      <div v-if="consigliato && mostraStrumenti" class="psm-suggerito">
        <span class="psm-suggerito-icona">
          <v-icon icon="mdi-star-four-points" size="18"></v-icon>
        </span>
        <div class="psm-suggerito-testo">
          <span class="psm-suggerito-label">{{ mobile ? 'Consigliato ora' : 'Scelta più conveniente ora' }}</span>
          <strong>
            <span class="psm-suggerito-nome">{{ consigliato.nome }}</span>
            <span v-if="!consigliato.adulti" class="psm-suggerito-pediatrico">
              <v-icon icon="mdi-human-baby-changing-table" size="11"></v-icon>
              Solo pediatrico
            </span>
          </strong>
          <span class="psm-suggerito-dett">
            {{ formattaDistanza(consigliato.distanza!) }} · ~{{ consigliato.minuti }} min ·
            {{ consigliato.carico.etichetta.toLowerCase() }}
          </span>
          <span class="psm-suggerito-nota">
            <v-icon icon="mdi-information-outline" size="11"></v-icon>
            <template v-if="!consigliato.adulti">Presidio riservato ai minori · distanza in linea d'aria</template>
            <template v-else>Distanza in linea d'aria, non su percorso stradale</template>
          </span>
        </div>
        <v-btn
            size="small"
            variant="flat"
            color="primary"
            rounded="lg"
            @click="seleziona(consigliato.key, true)"
        >
          Vedi
        </v-btn>
        <button class="psm-suggerito-chiudi" type="button" aria-label="Nascondi" @click="suggerimentoNascosto = true">
          <v-icon icon="mdi-close" size="16"></v-icon>
        </button>
      </div>
    </transition>

    <!-- Strumenti -->
    <div class="psm-toolbar">
      <button
          v-if="mostraStrumenti"
          type="button"
          class="psm-tool"
          :class="{ 'psm-tool--attivo': pannelloAperto }"
          title="Elenco presidi"
          @click="pannelloAperto = !pannelloAperto"
      >
        <v-icon icon="mdi-format-list-bulleted" size="20"></v-icon>
      </button>

      <button type="button" class="psm-tool" title="Inquadra tutto" @click="inquadraTutto">
        <v-icon icon="mdi-fit-to-screen-outline" size="20"></v-icon>
      </button>

      <button
          v-if="posizioneUtente"
          type="button"
          class="psm-tool"
          title="Il più vicino a me"
          @click="vaiAlPiuVicino"
      >
        <v-icon icon="mdi-near-me" size="20"></v-icon>
      </button>

      <button
          v-if="posizioneUtente && mostraStrumenti"
          type="button"
          class="psm-tool"
          :class="{ 'psm-tool--attivo': raggiVisibili }"
          title="Raggi di distanza"
          @click="raggiVisibili = !raggiVisibili"
      >
        <v-icon icon="mdi-radar" size="20"></v-icon>
      </button>

      <button
          type="button"
          class="psm-tool"
          :class="{ 'psm-tool--attivo': satellite }"
          title="Vista satellite"
          @click="satellite = !satellite"
      >
        <v-icon icon="mdi-satellite-variant" size="20"></v-icon>
      </button>
    </div>

    <!-- Legenda dei livelli di affollamento -->
    <div v-if="mostraStrumenti" class="psm-legenda">
      <span v-for="livello in livelliLegenda" :key="livello.chiave" class="psm-legenda-voce">
        <i :style="{ background: livello.colore }"></i>{{ livello.testo }}
      </span>
    </div>

    <!-- Elenco ordinabile -->
    <transition name="psm-slide">
      <aside v-if="pannelloAperto && mostraStrumenti" class="psm-pannello">
        <header class="psm-pannello-head">
          <span class="psm-pannello-titolo">{{ ospedaliCalcolati.length }} presidi</span>
          <button type="button" class="psm-pannello-chiudi" aria-label="Chiudi" @click="pannelloAperto = false">
            <v-icon icon="mdi-close" size="18"></v-icon>
          </button>
        </header>

        <div class="psm-ordina">
          <button
              v-for="opzione in ordinamentiDisponibili"
              :key="opzione.valore"
              type="button"
              class="psm-ordina-chip"
              :class="{ 'psm-ordina-chip--attivo': ordinamento === opzione.valore }"
              @click="ordinamento = opzione.valore"
          >
            <v-icon :icon="opzione.icona" size="13"></v-icon>
            {{ opzione.testo }}
          </button>
        </div>

        <div v-if="!posizioneUtente" class="psm-gps">
          <v-icon icon="mdi-crosshairs-gps" size="16"></v-icon>
          <span>Attiva il GPS per distanze e suggerimenti</span>
          <v-btn size="x-small" variant="tonal" color="primary" @click="geolocationStore.trackPosition()">
            Attiva
          </v-btn>
        </div>

        <ul class="psm-lista">
          <li v-for="ospedale in ospedaliOrdinati" :key="ospedale.key">
            <button
                type="button"
                class="psm-riga"
                :class="{ 'psm-riga--attiva': ospedale.key === selezionato }"
                @click="seleziona(ospedale.key, true)"
                @mouseenter="evidenzia(ospedale.key, true)"
                @mouseleave="evidenzia(ospedale.key, false)"
            >
              <span class="psm-riga-stato" :style="{ background: ospedale.carico.colore }"></span>

              <span class="psm-riga-testo">
                <span class="psm-riga-nome">
                  {{ ospedale.nome }}
                  <v-icon
                      v-if="!ospedale.adulti"
                      icon="mdi-human-baby-changing-table"
                      size="13"
                      class="psm-riga-baby"
                  ></v-icon>
                </span>
                <span class="psm-riga-meta">
                  <template v-if="ospedale.distanza !== null">
                    {{ formattaDistanza(ospedale.distanza) }} · ~{{ ospedale.minuti }} min
                  </template>
                  <template v-else>{{ ospedale.carico.etichetta }}</template>
                </span>
              </span>

              <span v-if="ospedale.key === consigliato?.key" class="psm-riga-badge">Top</span>

              <span
                  v-if="ospedale.carico.inAttesa !== null"
                  class="psm-riga-attesa"
                  :style="{ color: ospedale.carico.colore }"
              >
                {{ ospedale.carico.inAttesa }}
                <small>in attesa</small>
              </span>
            </button>
          </li>
        </ul>

        <p class="psm-nota">
          Le distanze sono calcolate in linea d'aria fra te e il presidio: il percorso
          stradale reale è più lungo e i minuti sono una stima. I presidi contrassegnati
          come pediatrici accettano solo minori. In emergenza chiama il <strong>112</strong>.
        </p>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useGeolocationStore } from '~/store/geolocation'
import { createSlug } from '~/utils/string-utils'
import {
    calcolaCarico,
    codiciColore,
    costoStimato,
    formattaDistanza,
    minutiStimati,
    COLORI_CARICO,
    type Carico,
} from '~/utils/hospital-metrics'

interface Ospedale {
    lat: string | number
    lng: string | number
    nome: string
    descrizione?: string
    adulti: boolean
    indirizzo?: string
    telefono?: string
    email?: string
    web?: string
    google_maps?: string
    data?: Record<string, any>
}

interface OspedaleCalcolato {
    key: string
    nome: string
    adulti: boolean
    lat: number
    lng: number
    carico: Carico
    distanza: number | null
    minuti: number | null
    costo: number | null
    origine: Ospedale
}

const props = withDefaults(defineProps<{
    ospedali: Ospedale[]
    height?: string
    embedded?: boolean
}>(), {
    height: '400px',
    embedded: false,
})

const router = useRouter()
const { mobile } = useDisplay()
const geolocationStore = useGeolocationStore()

const mapEl = ref<HTMLElement | null>(null)
const mappa = shallowRef<L.Map | null>(null)
const gruppoMarker = shallowRef<L.MarkerClusterGroup | null>(null)
const tileLayer = shallowRef<L.TileLayer | null>(null)
const markerUtente = shallowRef<L.Marker | null>(null)
const lineaPercorso = shallowRef<L.Polyline | null>(null)
const gruppoRaggi = shallowRef<L.LayerGroup | null>(null)

const marker = new Map<string, L.Marker>()

const selezionato = ref<string | null>(null)
const pannelloAperto = ref(false)
const raggiVisibili = ref(false)
const satellite = ref(false)
const suggerimentoNascosto = ref(false)

let osservatore: ResizeObserver | null = null
/** vero finché la mappa può ancora riposizionarsi da sola (prima che l'utente la muova) */
let inquadraturaLibera = true

/* ------------------------------------------------------------------ *
 * Dati derivati
 * ------------------------------------------------------------------ */

const posizioneUtente = computed(() =>
    geolocationStore.geolocation.init ? geolocationStore.userPosition : null,
)

/** Con un solo presidio (scheda ospedale) la mappa resta essenziale. */
const mostraStrumenti = computed(() => props.ospedali.length > 1)

const ospedaliCalcolati = computed<OspedaleCalcolato[]>(() =>
    props.ospedali
        .map((ospedale) => {
            const lat = Number.parseFloat(String(ospedale.lat))
            const lng = Number.parseFloat(String(ospedale.lng))
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

            const carico = calcolaCarico(ospedale.data)
            const posizione = posizioneUtente.value
            const distanza = posizione
                ? geolocationStore.calculateDistance(posizione.latitude, posizione.longitude, lat, lng)
                : null

            return {
                key: createSlug(ospedale.nome),
                nome: ospedale.nome,
                adulti: ospedale.adulti,
                lat,
                lng,
                carico,
                distanza,
                minuti: distanza !== null ? minutiStimati(distanza) : null,
                costo: costoStimato(distanza, carico),
                origine: ospedale,
            } as OspedaleCalcolato
        })
        .filter((o): o is OspedaleCalcolato => o !== null),
)

const piuVicino = computed(() => {
    const conDistanza = ospedaliCalcolati.value.filter((o) => o.distanza !== null)
    if (!conDistanza.length) return null
    return conDistanza.reduce((a, b) => (a.distanza! <= b.distanza! ? a : b))
})

/**
 * Il "consigliato" ha senso solo se batte davvero il più vicino:
 * altrimenti il suggerimento sarebbe rumore. I presidi pediatrici restano
 * candidati, ma vengono dichiarati come tali in modo evidente.
 */
const consigliato = computed(() => {
    if (suggerimentoNascosto.value || !mostraStrumenti.value) return null

    const candidati = ospedaliCalcolati.value.filter((o) => o.costo !== null)
    if (candidati.length < 2) return null

    const migliore = candidati.reduce((a, b) => (a.costo! <= b.costo! ? a : b))
    if (migliore.carico.livello === 'sconosciuto') return null

    return migliore
})

const ordinamento = ref<'vicinanza' | 'attesa' | 'consigliato' | 'nome'>('nome')

const ordinamentiDisponibili = computed(() => {
    const opzioni = [
        { valore: 'nome' as const, testo: 'Nome', icona: 'mdi-sort-alphabetical-variant' },
        { valore: 'attesa' as const, testo: 'Attesa', icona: 'mdi-account-clock-outline' },
    ]

    if (posizioneUtente.value) {
        opzioni.unshift({ valore: 'vicinanza' as const, testo: 'Vicinanza', icona: 'mdi-map-marker-distance' })
        opzioni.push({ valore: 'consigliato' as const, testo: 'Consigliato', icona: 'mdi-star-four-points' })
    }

    return opzioni
})

const ospedaliOrdinati = computed(() => {
    const elenco = [...ospedaliCalcolati.value]
    const infinito = Number.POSITIVE_INFINITY

    switch (ordinamento.value) {
        case 'vicinanza':
            return elenco.sort((a, b) => (a.distanza ?? infinito) - (b.distanza ?? infinito))
        case 'attesa':
            return elenco.sort((a, b) => (a.carico.inAttesa ?? infinito) - (b.carico.inAttesa ?? infinito))
        case 'consigliato':
            return elenco.sort((a, b) => (a.costo ?? infinito) - (b.costo ?? infinito))
        default:
            return elenco.sort((a, b) => a.nome.localeCompare(b.nome))
    }
})

const livelliLegenda = [
    { chiave: 'scarico', testo: 'Poco affollato', colore: COLORI_CARICO.scarico },
    { chiave: 'moderato', testo: 'Media', colore: COLORI_CARICO.moderato },
    { chiave: 'affollato', testo: 'Affollato', colore: COLORI_CARICO.affollato },
    { chiave: 'critico', testo: 'Molto affollato', colore: COLORI_CARICO.critico },
]

/* ------------------------------------------------------------------ *
 * Mappa
 * ------------------------------------------------------------------ */

/*
 * Anche con l'app in tema scuro la mappa resta chiara: le basemap scure
 * perdono gran parte dei punti di interesse (padiglioni, farmacie, parcheggi,
 * ingressi) che qui servono davvero a chi deve raggiungere un pronto soccorso.
 */
const urlTile = computed(() =>
    satellite.value
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
)

const attribuzione = computed(() =>
    satellite.value
        ? 'Immagini © <a href="https://www.esri.com">Esri</a>'
        : 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
)

function creaMappa() {
    if (!mapEl.value || mappa.value) return

    const centro = ospedaliCalcolati.value[0]

    mappa.value = L.map(mapEl.value, {
        zoomControl: false,
        attributionControl: true,
        center: centro ? [centro.lat, centro.lng] : [41.9, 12.5],
        zoom: 12,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(mappa.value)

    tileLayer.value = L.tileLayer(urlTile.value, {
        attribution: attribuzione.value,
        maxZoom: 19,
    }).addTo(mappa.value)

    gruppoMarker.value = L.markerClusterGroup({
        maxClusterRadius: 48,
        disableClusteringAtZoom: 12,
        showCoverageOnHover: false,
        spiderfyDistanceMultiplier: 1.4,
        iconCreateFunction: creaIconaCluster,
    })

    mappa.value.addLayer(gruppoMarker.value)
    gruppoRaggi.value = L.layerGroup().addTo(mappa.value)

    mappa.value.on('popupclose', () => {
        selezionato.value = null
        disegnaPercorso()
    })

    // appena l'utente muove la mappa smettiamo di riposizionarla al posto suo
    mappa.value.on('dragstart', () => (inquadraturaLibera = false))
    mappa.value.on('popupopen', () => (inquadraturaLibera = false))

    // gli anelli si riscalano insieme allo zoom
    mappa.value.on('zoomend', () => {
        if (raggiVisibili.value) disegnaRaggi()
    })

    sincronizzaMarker()
    aggiornaUtente()
    inquadraTutto()

    // dentro un dialog il contenitore nasce con dimensioni sbagliate e le raggiunge
    // solo a transizione finita: fino ad allora l'inquadratura va rifatta
    if (typeof ResizeObserver !== 'undefined') {
        osservatore = new ResizeObserver(() => {
            mappa.value?.invalidateSize()
            if (inquadraturaLibera) inquadraTutto()
        })
        osservatore.observe(mapEl.value)
    }

    setTimeout(() => {
        mappa.value?.invalidateSize()
        if (inquadraturaLibera) inquadraTutto()
        inquadraturaLibera = false
    }, 900)
}

/** Il cluster prende il colore della situazione peggiore che contiene. */
function creaIconaCluster(cluster: any) {
    const figli = cluster.getAllChildMarkers()
    const peso: Record<string, number> = { sconosciuto: 0, scarico: 1, moderato: 2, affollato: 3, critico: 4 }

    let peggiore = 'sconosciuto'
    for (const figlio of figli) {
        const livello = figlio.options.livelloCarico ?? 'sconosciuto'
        if (peso[livello] > peso[peggiore]) peggiore = livello
    }

    return L.divIcon({
        className: 'psm-cluster-wrap',
        html: `<div class="psm-cluster" style="--psm-c:${COLORI_CARICO[peggiore as keyof typeof COLORI_CARICO]}">
                 <span>${cluster.getChildCount()}</span>
               </div>`,
        iconSize: [44, 44],
    })
}

function creaIcona(ospedale: OspedaleCalcolato): L.DivIcon {
    const attivo = ospedale.key === selezionato.value
    const top = ospedale.key === consigliato.value?.key
    const valore = ospedale.carico.inAttesa
    const contenuto =
        valore !== null
            ? `<span class="psm-pin-num">${valore}</span>`
            : `<i class="mdi mdi-hospital-building"></i>`

    return L.divIcon({
        className: 'psm-pin-wrap',
        html: `
          <div class="psm-pin ${attivo ? 'psm-pin--attivo' : ''} ${top ? 'psm-pin--top' : ''}"
               style="--psm-c:${ospedale.carico.colore}">
            ${top ? '<span class="psm-pin-alone"></span>' : ''}
            <div class="psm-pin-corpo">${contenuto}</div>
            ${!ospedale.adulti ? '<span class="psm-pin-baby"><i class="mdi mdi-baby-face-outline"></i></span>' : ''}
          </div>`,
        iconSize: [42, 50],
        iconAnchor: [21, 48],
        popupAnchor: [0, -46],
    })
}

/** Crea o aggiorna i marker senza ricostruire il layer a ogni refresh dei dati. */
function sincronizzaMarker() {
    if (!gruppoMarker.value) return

    const presenti = new Set<string>()

    for (const ospedale of ospedaliCalcolati.value) {
        presenti.add(ospedale.key)
        const esistente = marker.get(ospedale.key)

        if (esistente) {
            esistente.setLatLng([ospedale.lat, ospedale.lng])
            esistente.setIcon(creaIcona(ospedale))
            ;(esistente.options as any).livelloCarico = ospedale.carico.livello

            // il popup aperto deve seguire i dati live
            if (esistente.isPopupOpen()) esistente.setPopupContent(creaPopup(ospedale))
            continue
        }

        const nuovo = L.marker([ospedale.lat, ospedale.lng], {
            icon: creaIcona(ospedale),
            title: ospedale.nome,
            livelloCarico: ospedale.carico.livello,
        } as L.MarkerOptions)

        nuovo.bindPopup(() => creaPopup(trovaOspedale(ospedale.key) ?? ospedale), {
            className: 'psm-popup',
            maxWidth: 320,
            minWidth: 268,
            closeButton: true,
            ...spaziaturaPopup(),
        })

        nuovo.on('popupopen', () => {
            selezionato.value = ospedale.key
            aggiornaIcone()
            disegnaPercorso()
        })

        marker.set(ospedale.key, nuovo)
        gruppoMarker.value.addLayer(nuovo)
    }

    // presidi spariti dai dati
    for (const [key, istanza] of marker) {
        if (presenti.has(key)) continue
        gruppoMarker.value.removeLayer(istanza)
        marker.delete(key)
    }
}

function aggiornaIcone() {
    for (const ospedale of ospedaliCalcolati.value) {
        marker.get(ospedale.key)?.setIcon(creaIcona(ospedale))
    }
}

/**
 * Spazio da lasciare libero quando la mappa si sposta per mostrare un popup:
 * in alto ci sono banner e strumenti, a destra l'elenco quando è aperto.
 */
function spaziaturaPopup() {
    return {
        autoPanPaddingTopLeft: L.point(24, mostraStrumenti.value ? 118 : 60),
        autoPanPaddingBottomRight: L.point(pannelloAperto.value ? 356 : 24, 48),
    }
}

function aggiornaSpaziaturaPopup() {
    const spaziatura = spaziaturaPopup()

    for (const istanza of marker.values()) {
        const popup = istanza.getPopup()
        if (!popup) continue
        Object.assign(popup.options, spaziatura)
    }
}

const trovaOspedale = (key: string) => ospedaliCalcolati.value.find((o) => o.key === key)

/* ------------------------------------------------------------------ *
 * Popup
 * ------------------------------------------------------------------ */

function creaPopup(ospedale: OspedaleCalcolato): HTMLElement {
    const dati = ospedale.origine
    const codici = codiciColore(dati.data)
    const carico = ospedale.carico

    const contenitore = L.DomUtil.create('div', 'psm-card')

    const distanza =
        ospedale.distanza !== null
            ? `<div class="psm-card-distanza" title="Calcolata in linea d'aria fra la tua posizione e il presidio: il tragitto stradale è più lungo.">
                 <i class="mdi mdi-navigation-variant"></i>
                 <strong>${formattaDistanza(ospedale.distanza)}</strong>
                 <span>in linea d'aria · ~${ospedale.minuti} min stimati</span>
               </div>`
            : ''

    const griglia = codici.length
        ? `<div class="psm-card-codici">
             ${codici
                 .map(
                     (codice) => `
               <span class="psm-codice" style="--psm-k:${codice.colore}" title="Codice ${codice.codice}">
                 <b>${codice.valore ?? '–'}</b>
                 <small>${codice.codice}</small>
               </span>`,
                 )
                 .join('')}
           </div>`
        : `<p class="psm-card-vuoto">Dati di affluenza non disponibili per questo presidio.</p>`

    const attesa =
        carico.inAttesa !== null
            ? `<div class="psm-card-riga">
                 <span>Pazienti in attesa</span><b>${carico.inAttesa}</b>
               </div>`
            : ''

    const indice =
        carico.indice !== null
            ? `<div class="psm-card-indice">
                 <div class="psm-card-riga">
                   <span>Indice di sovraffollamento</span><b>${carico.indice}%</b>
                 </div>
                 <div class="psm-barra">
                   <i style="width:${Math.min(carico.indice, 200) / 2}%; background:${carico.colore}"></i>
                 </div>
               </div>`
            : ''

    contenitore.innerHTML = `
      <div class="psm-card-head" style="--psm-c:${carico.colore}">
        <span class="psm-card-stato">${carico.etichetta}</span>
        <h3>${escapeHtml(ospedale.nome)}</h3>
        <span class="psm-card-tipo">
          <i class="mdi ${ospedale.adulti ? 'mdi-account' : 'mdi-human-baby-changing-table'}"></i>
          ${ospedale.adulti ? 'Adulti' : 'Pediatrico'}
        </span>
      </div>
      ${distanza}
      <div class="psm-card-corpo">
        ${griglia}
        ${attesa}
        ${indice}
        ${dati.indirizzo ? `<div class="psm-card-info"><i class="mdi mdi-map-marker"></i>${escapeHtml(dati.indirizzo)}</div>` : ''}
      </div>
      <div class="psm-card-azioni"></div>
    `

    const azioni = contenitore.querySelector('.psm-card-azioni') as HTMLElement

    azioni.appendChild(
        creaBottone('mdi-information-outline', 'Dettagli', 'psm-btn--primario', () => apriDettagli(ospedale)),
    )

    if (dati.google_maps || (ospedale.lat && ospedale.lng)) {
        const destinazione =
            dati.google_maps ||
            `https://www.google.com/maps/dir/?api=1&destination=${ospedale.lat},${ospedale.lng}`
        azioni.appendChild(
            creaBottone('mdi-directions', 'Indicazioni', '', () => window.open(destinazione, '_blank')),
        )
    }

    if (dati.telefono) {
        azioni.appendChild(
            creaBottone('mdi-phone', 'Chiama', '', () => {
                window.location.href = `tel:${dati.telefono!.replace(/\s/g, '')}`
            }),
        )
    }

    return contenitore
}

function creaBottone(icona: string, testo: string, classe: string, azione: () => void): HTMLButtonElement {
    const bottone = L.DomUtil.create('button', `psm-btn ${classe}`) as HTMLButtonElement
    bottone.type = 'button'
    bottone.innerHTML = `<i class="mdi ${icona}"></i><span>${testo}</span>`
    L.DomEvent.on(bottone, 'click', (evento) => {
        L.DomEvent.stop(evento)
        azione()
    })
    return bottone
}

const escapeHtml = (valore: string): string =>
    valore.replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
    )

function apriDettagli(ospedale: OspedaleCalcolato) {
    const percorso = router.currentRoute.value.path
    const query = { ...router.currentRoute.value.query, ps: ospedale.key }

    if (props.embedded) {
        // dentro un iframe il dettaglio va aperto nella pagina che ci ospita
        window.open(`${percorso}?ps=${ospedale.key}&embedded=true`, '_parent')
        return
    }

    router.push({ path: percorso, query })
}

/* ------------------------------------------------------------------ *
 * Prossimità
 * ------------------------------------------------------------------ */

const iconaUtente = L.divIcon({
    className: 'psm-utente-wrap',
    html: '<div class="psm-utente"><span class="psm-utente-onda"></span><span class="psm-utente-punto"></span></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
})

function aggiornaUtente() {
    const posizione = posizioneUtente.value
    if (!mappa.value) return

    if (!posizione) {
        if (markerUtente.value) {
            mappa.value.removeLayer(markerUtente.value)
            markerUtente.value = null
        }
        disegnaRaggi()
        disegnaPercorso()
        return
    }

    const punto: L.LatLngExpression = [posizione.latitude, posizione.longitude]

    if (markerUtente.value) {
        markerUtente.value.setLatLng(punto)
    } else {
        markerUtente.value = L.marker(punto, { icon: iconaUtente, zIndexOffset: 1000 })
            .bindTooltip('La tua posizione', { direction: 'top', offset: [0, -12] })
            .addTo(mappa.value)
    }

    disegnaRaggi()
    disegnaPercorso()
}

/** Terne di anelli fra cui scegliere: valori "tondi", dal quartiere alla regione. */
const SCALE_RAGGI = [
    [0.25, 0.5, 1],
    [0.5, 1, 2],
    [1, 2, 3],
    [1, 3, 5],
    [2, 5, 10],
    [5, 10, 20],
    [10, 25, 50],
    [25, 50, 100],
]

/**
 * La scala segue lo zoom: avvicinandosi gli anelli si stringono fino a
 * 250 metri, così restano un riferimento utile anche dentro una città.
 */
function scalaRaggi(): number[] {
    const mappa_ = mappa.value
    if (!mappa_) return SCALE_RAGGI[5]

    const centro = mappa_.getCenter()
    const bordo = L.latLng(centro.lat, mappa_.getBounds().getEast())
    const mezzaLarghezzaKm = centro.distanceTo(bordo) / 1000

    // l'anello più esterno deve stare comodamente dentro la vista
    const bersaglio = mezzaLarghezzaKm * 0.8

    return SCALE_RAGGI.reduce((migliore, scala) =>
        Math.abs(scala[2] - bersaglio) < Math.abs(migliore[2] - bersaglio) ? scala : migliore,
    )
}

/** Anelli di riferimento attorno alla posizione dell'utente. */
function disegnaRaggi() {
    if (!gruppoRaggi.value) return

    gruppoRaggi.value.clearLayers()
    const posizione = posizioneUtente.value
    if (!posizione || !raggiVisibili.value) return

    const centro: L.LatLngExpression = [posizione.latitude, posizione.longitude]

    for (const km of scalaRaggi()) {
        L.circle(centro, {
            radius: km * 1000,
            color: 'rgba(229,50,47,0.55)',
            weight: 1,
            dashArray: '5 6',
            fill: false,
            interactive: false,
        }).addTo(gruppoRaggi.value)

        L.marker(L.latLng(posizione.latitude + km / 111, posizione.longitude), {
            interactive: false,
            icon: L.divIcon({
                className: 'psm-raggio-etichetta',
                // i valori della scala sono già tondi: niente decimali di troppo
                html: km < 1 ? `${km * 1000} m` : `${km} km`,
                iconSize: [46, 16],
            }),
        }).addTo(gruppoRaggi.value)
    }
}

/** Collega l'utente al presidio selezionato con la distanza in etichetta. */
function disegnaPercorso() {
    if (!mappa.value) return

    if (lineaPercorso.value) {
        mappa.value.removeLayer(lineaPercorso.value)
        lineaPercorso.value = null
    }

    const posizione = posizioneUtente.value
    const ospedale = selezionato.value ? trovaOspedale(selezionato.value) : null
    if (!posizione || !ospedale || ospedale.distanza === null) return

    lineaPercorso.value = L.polyline(
        [
            [posizione.latitude, posizione.longitude],
            [ospedale.lat, ospedale.lng],
        ],
        {
            color: ospedale.carico.colore,
            weight: 3,
            opacity: 0.85,
            dashArray: '7 8',
            interactive: false,
        },
    ).addTo(mappa.value)

    lineaPercorso.value
        .bindTooltip(`${formattaDistanza(ospedale.distanza)} · ~${ospedale.minuti} min`, {
            permanent: true,
            direction: 'center',
            className: 'psm-tooltip-percorso',
        })
        .openTooltip()
}

/* ------------------------------------------------------------------ *
 * Azioni
 * ------------------------------------------------------------------ */

function seleziona(key: string, apriPopup = false) {
    const ospedale = trovaOspedale(key)
    const istanza = marker.get(key)
    if (!ospedale || !istanza || !mappa.value) return

    selezionato.value = key
    mappa.value.setView([ospedale.lat, ospedale.lng], Math.max(mappa.value.getZoom(), 14), {
        animate: true,
    })

    if (apriPopup) {
        // se è dentro un cluster va prima "aperto" il gruppo
        gruppoMarker.value?.zoomToShowLayer(istanza, () => istanza.openPopup())
    }

    aggiornaIcone()
    disegnaPercorso()
}

function evidenzia(key: string, attivo: boolean) {
    const elemento = marker.get(key)?.getElement()
    elemento?.classList.toggle('psm-pin-wrap--hover', attivo)
}

function vaiAlPiuVicino() {
    if (piuVicino.value) seleziona(piuVicino.value.key, true)
}

function inquadraTutto() {
    if (!mappa.value) return

    const punti: L.LatLngExpression[] = ospedaliCalcolati.value.map((o) => [o.lat, o.lng])
    const posizione = posizioneUtente.value
    if (posizione) punti.push([posizione.latitude, posizione.longitude])

    if (!punti.length) return

    if (punti.length === 1) {
        mappa.value.setView(punti[0], 14)
        return
    }

    // i marker non devono finire sotto banner, strumenti ed elenco
    const stretto = mobile.value
    mappa.value.fitBounds(L.latLngBounds(punti), {
        paddingTopLeft: L.point(stretto ? 30 : 48, mostraStrumenti.value ? (stretto ? 96 : 116) : 48),
        paddingBottomRight: L.point(pannelloAperto.value ? 372 : stretto ? 58 : 78, stretto ? 40 : 62),
        maxZoom: 15,
    })
}

/* ------------------------------------------------------------------ *
 * Ciclo di vita
 * ------------------------------------------------------------------ */

onMounted(async () => {
    await nextTick()
    creaMappa()
})

onBeforeUnmount(() => {
    osservatore?.disconnect()
    osservatore = null
    marker.clear()
    mappa.value?.remove()
    mappa.value = null
})

watch(ospedaliCalcolati, () => {
    sincronizzaMarker()
    disegnaPercorso()
})

watch(posizioneUtente, () => {
    aggiornaUtente()
    aggiornaIcone()
})

watch(raggiVisibili, disegnaRaggi)

watch(pannelloAperto, aggiornaSpaziaturaPopup)

// con la posizione nota la domanda diventa "quale ho più vicino"
watch(posizioneUtente, (posizione) => {
    if (posizione && ordinamento.value === 'nome') ordinamento.value = 'vicinanza'
}, { immediate: true })

watch([urlTile, attribuzione], ([url, attr]) => {
    if (!mappa.value) return
    if (tileLayer.value) mappa.value.removeLayer(tileLayer.value)
    tileLayer.value = L.tileLayer(url, { attribution: attr, maxZoom: 19 }).addTo(mappa.value)
})

watch(consigliato, aggiornaIcone)
</script>

<style scoped lang="scss">
.psm {
  position: relative;
  width: 100%;
  /* la mappa è in position absolute: senza un minimo il contenitore può collassare */
  min-height: 260px;
  overflow: hidden;
  background: rgb(var(--v-theme-bg1));
}

.psm-map {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
}

/* ---------- suggerimento ---------- */

.psm-suggerito {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 68px;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 11px;
  max-width: 460px;
  padding: 10px 12px;
  border-radius: 15px;
  border: 1px solid rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-navbar1), 0.94);
  backdrop-filter: blur(9px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.psm-suggerito-icona {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.14);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.psm-suggerito-testo {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
  color: rgb(var(--v-theme-string));
}

.psm-suggerito-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}

.psm-suggerito-testo strong {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 0.88rem;
}

/* a stringere è il nome: l'avviso "solo pediatrico" non deve mai essere tagliato */
.psm-suggerito-nome {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.psm-suggerito-pediatrico {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 7px;
  border-radius: 999px;
  color: rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.16);
  border: 1px solid rgba(var(--v-theme-info), 0.45);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.psm-suggerito-dett {
  font-size: 0.74rem;
  color: rgba(var(--v-theme-string), 0.6);
}

.psm-suggerito-nota {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  color: rgba(var(--v-theme-string), 0.42);
  font-size: 0.65rem;
  line-height: 1.2;
}

.psm-suggerito-chiudi {
  flex: none;
  border: none;
  background: transparent;
  color: rgba(var(--v-theme-string), 0.5);
  cursor: pointer;
}

/* ---------- strumenti ---------- */

.psm-toolbar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.psm-tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.28);
  background: rgba(var(--v-theme-navbar1), 0.92);
  color: rgb(var(--v-theme-string));
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.psm-tool:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--v-theme-primary), 0.65);
}

.psm-tool--attivo {
  color: #fff;
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

/* ---------- legenda ---------- */

.psm-legenda {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 500;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  max-width: calc(100% - 100px);
  padding: 7px 12px;
  border-radius: 12px;
  background: rgba(var(--v-theme-navbar1), 0.9);
  border: 1px solid rgba(var(--v-theme-string), 0.12);
  backdrop-filter: blur(8px);
  font-size: 0.7rem;
  color: rgba(var(--v-theme-string), 0.75);
}

.psm-legenda-voce {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.psm-legenda-voce i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* ---------- pannello ---------- */

.psm-pannello {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 600;
  display: flex;
  flex-direction: column;
  width: min(340px, 88%);
  border-left: 1px solid rgba(var(--v-theme-primary), 0.25);
  background: rgba(var(--v-theme-navbar1), 0.97);
  backdrop-filter: blur(12px);
  box-shadow: -14px 0 40px rgba(0, 0, 0, 0.35);
}

.psm-pannello-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 10px;
  border-bottom: 1px solid rgba(var(--v-theme-string), 0.1);
}

.psm-pannello-titolo {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: rgba(var(--v-theme-string), 0.55);
}

.psm-pannello-chiudi {
  border: none;
  background: transparent;
  color: rgba(var(--v-theme-string), 0.6);
  cursor: pointer;
}

.psm-ordina {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
}

.psm-ordina-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-string), 0.16);
  background: transparent;
  color: rgba(var(--v-theme-string), 0.66);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

.psm-ordina-chip--attivo {
  color: rgb(var(--v-theme-primary));
  border-color: rgba(var(--v-theme-primary), 0.6);
  background: rgba(var(--v-theme-primary), 0.12);
}

.psm-gps {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 8px;
  padding: 8px 10px;
  border-radius: 11px;
  background: rgba(var(--v-theme-primary), 0.09);
  border: 1px dashed rgba(var(--v-theme-primary), 0.35);
  color: rgba(var(--v-theme-string), 0.75);
  font-size: 0.74rem;
}

.psm-lista {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0 8px 8px;
  list-style: none;
}

.psm-riga {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.psm-riga:hover {
  background: rgba(var(--v-theme-string), 0.06);
}

.psm-riga--attiva {
  background: rgba(var(--v-theme-primary), 0.13);
  border-color: rgba(var(--v-theme-primary), 0.4);
}

.psm-riga-stato {
  flex: none;
  width: 9px;
  height: 34px;
  border-radius: 6px;
}

.psm-riga-testo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.psm-riga-nome {
  color: rgb(var(--v-theme-string));
  font-size: 0.84rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.psm-riga-baby {
  color: rgb(var(--v-theme-info));
}

.psm-riga-meta {
  color: rgba(var(--v-theme-string), 0.55);
  font-size: 0.72rem;
}

.psm-riga-badge {
  flex: none;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.16);
  border: 1px solid rgba(var(--v-theme-primary), 0.4);
  color: rgb(var(--v-theme-primary));
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.psm-riga-attesa {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
}

.psm-riga-attesa small {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.7;
}

.psm-nota {
  margin: 0;
  padding: 9px 14px;
  border-top: 1px solid rgba(var(--v-theme-string), 0.1);
  color: rgba(var(--v-theme-string), 0.45);
  font-size: 0.66rem;
  line-height: 1.4;
}

/* ---------- transizioni ---------- */

.psm-fade-enter-active,
.psm-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.psm-fade-enter-from,
.psm-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.psm-slide-enter-active,
.psm-slide-leave-active {
  transition: transform 0.28s ease;
}

.psm-slide-enter-from,
.psm-slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .psm-suggerito {
    right: 62px;
    gap: 8px;
    padding: 7px 9px;
  }

  /* su schermo stretto lo spazio va al nome del presidio */
  .psm-suggerito-icona {
    display: none;
  }

  .psm-suggerito-label {
    font-size: 0.56rem;
    letter-spacing: 0.6px;
  }

  .psm-suggerito-testo strong {
    font-size: 0.82rem;
  }

  .psm-suggerito-dett {
    font-size: 0.68rem;
  }

  .psm-suggerito-nota {
    font-size: 0.58rem;
  }

  .psm-legenda {
    display: none;
  }
}
</style>

<style lang="scss">
/* Marker, cluster e popup vivono fuori dallo scope del componente. */

.psm-pin-wrap {
  background: transparent !important;
  border: none !important;
}

.psm-pin {
  position: relative;
  width: 42px;
  height: 50px;
  display: flex;
  justify-content: center;
  transition: transform 0.18s ease;
}

.psm-pin-corpo {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% 50% 50% 6px;
  transform: rotate(-45deg);
  color: #fff;
  background: var(--psm-c);
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
}

.psm-pin-corpo > * {
  transform: rotate(45deg);
}

.psm-pin-num {
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1;
}

.psm-pin-corpo .mdi {
  font-size: 18px;
}

.psm-pin-baby {
  position: absolute;
  top: -3px;
  right: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #29b6f6;
  color: #fff;
  border: 2px solid #fff;
  font-size: 10px;
}

.psm-pin-alone {
  position: absolute;
  top: 2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--psm-c);
  opacity: 0.55;
  animation: psm-onda 1.8s ease-out infinite;
}

.psm-pin--attivo .psm-pin-corpo,
.psm-pin-wrap--hover .psm-pin-corpo {
  transform: rotate(-45deg) scale(1.16);
  border-color: #fff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.5);
}

.psm-pin--top .psm-pin-corpo {
  border-color: #ffd54f;
}

@keyframes psm-onda {
  0% { transform: scale(0.7); opacity: 0.6; }
  100% { transform: scale(2.1); opacity: 0; }
}

/* cluster */

.psm-cluster-wrap {
  background: transparent !important;
  border: none !important;
}

.psm-cluster {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  background: var(--psm-c);
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

/* posizione utente */

.psm-utente-wrap {
  background: transparent !important;
  border: none !important;
}

.psm-utente {
  position: relative;
  width: 22px;
  height: 22px;
}

.psm-utente-punto {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: #2196f3;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.psm-utente-onda {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(33, 150, 243, 0.45);
  animation: psm-onda 1.9s ease-out infinite;
}

.psm-raggio-etichetta {
  color: rgba(229, 50, 47, 0.9);
  font-size: 0.66rem;
  font-weight: 800;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  background: transparent !important;
  border: none !important;
}

.psm-tooltip-percorso {
  padding: 2px 8px;
  border: none;
  border-radius: 999px;
  background: rgba(20, 24, 29, 0.9);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.psm-tooltip-percorso::before {
  display: none;
}

/* popup */

.psm-popup .leaflet-popup-content-wrapper {
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
  background: rgb(var(--v-theme-navbar1));
  color: rgb(var(--v-theme-string));
  border: 1px solid rgba(var(--v-theme-primary), 0.28);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45);
}

.psm-popup .leaflet-popup-content {
  margin: 0;
  width: auto !important;
}

.psm-popup .leaflet-popup-tip {
  background: rgb(var(--v-theme-navbar1));
}

.psm-popup .leaflet-popup-close-button {
  top: 6px;
  right: 6px;
  color: rgba(var(--v-theme-string), 0.6) !important;
}

.psm-card-head {
  position: relative;
  padding: 13px 34px 12px 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--psm-c) 26%, transparent), transparent 78%);
  border-bottom: 1px solid rgba(var(--v-theme-string), 0.1);
}

.psm-card-head h3 {
  margin: 3px 0 5px;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.25;
  color: rgb(var(--v-theme-string));
}

.psm-card-stato {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--psm-c);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.psm-card-tipo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgba(var(--v-theme-string), 0.6);
  font-size: 0.72rem;
}

.psm-card-distanza {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: rgba(var(--v-theme-primary), 0.08);
  border-bottom: 1px solid rgba(var(--v-theme-string), 0.08);
  color: rgb(var(--v-theme-string));
  font-size: 0.78rem;
}

.psm-card-distanza .mdi {
  color: rgb(var(--v-theme-primary));
}

.psm-card-distanza span {
  color: rgba(var(--v-theme-string), 0.6);
}

.psm-card-corpo {
  padding: 11px 14px 4px;
}

.psm-card-codici {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.psm-codice {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
  padding: 5px 6px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--psm-k) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--psm-k) 45%, transparent);
}

.psm-codice b {
  color: var(--psm-k);
  font-size: 1rem;
  line-height: 1.1;
}

.psm-codice small {
  color: rgba(var(--v-theme-string), 0.55);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.psm-card-riga {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
  color: rgba(var(--v-theme-string), 0.65);
  font-size: 0.77rem;
}

.psm-card-riga b {
  color: rgb(var(--v-theme-string));
  font-size: 0.85rem;
}

.psm-barra {
  height: 6px;
  margin: 4px 0 2px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(var(--v-theme-string), 0.12);
}

.psm-barra i {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.psm-card-info {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 7px 0 2px;
  color: rgba(var(--v-theme-string), 0.6);
  font-size: 0.74rem;
  line-height: 1.35;
}

.psm-card-vuoto {
  margin: 0 0 8px;
  color: rgba(var(--v-theme-string), 0.55);
  font-size: 0.76rem;
}

.psm-card-azioni {
  display: flex;
  gap: 6px;
  padding: 10px 12px 12px;
}

.psm-btn {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 7px 4px;
  border-radius: 11px;
  border: 1px solid rgba(var(--v-theme-string), 0.16);
  background: rgba(var(--v-theme-string), 0.05);
  color: rgb(var(--v-theme-string));
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.psm-btn .mdi {
  font-size: 16px;
}

.psm-btn:hover {
  background: rgba(var(--v-theme-primary), 0.14);
  border-color: rgba(var(--v-theme-primary), 0.45);
}

.psm-btn--primario {
  color: #fff;
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.psm-btn--primario:hover {
  background: rgb(var(--v-theme-primary));
  filter: brightness(1.1);
}

/* i controlli nativi di leaflet devono seguire il tema */

.leaflet-container {
  /* tono neutro delle tile OSM, così il caricamento non lampeggia di scuro */
  background: #e9e5df;
  font-family: inherit;
}

.leaflet-control-zoom a {
  background: rgba(var(--v-theme-navbar1), 0.94) !important;
  color: rgb(var(--v-theme-string)) !important;
  border-color: rgba(var(--v-theme-string), 0.14) !important;
}

.leaflet-control-attribution {
  background: rgba(var(--v-theme-navbar1), 0.8) !important;
  color: rgba(var(--v-theme-string), 0.6) !important;
  font-size: 0.62rem;
}

.leaflet-control-attribution a {
  color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>
