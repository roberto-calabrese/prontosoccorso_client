import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useGeolocationStore } from '~/store/geolocation'
import {
    buildSearchIndex,
    search as eseguiRicerca,
    type SearchDoc,
    type SearchIndex,
    type SearchResult,
} from '~/utils/search-engine'

const CHIAVE_RECENTI = 'ps-live:ricerche-recenti'
const MAX_RECENTI = 5

interface Recente {
    tipo: SearchDoc['tipo']
    nome: string
    url: string
    sottotitolo?: string
}

export const useSearchStore = defineStore('search', () => {
    const geolocationStore = useGeolocationStore()

    const index = shallowRef<SearchIndex | null>(null)
    const isOpen = ref(false)
    const isLoading = ref(false)
    const errore = ref(false)
    const recenti = ref<Recente[]>([])

    let caricamento: Promise<void> | null = null

    const isReady = computed(() => index.value !== null)
    const totali = computed(() => index.value?.docs.length ?? 0)

    /** Le regioni servono anche come suggerimento iniziale a input vuoto. */
    const regioni = computed(() => index.value?.docs.filter((d) => d.tipo === 'regione') ?? [])

    /** Scarica l'indice completo una sola volta per sessione. */
    function ensureIndex(): Promise<void> {
        if (index.value || caricamento) return caricamento ?? Promise.resolve()

        isLoading.value = true
        errore.value = false

        caricamento = (async () => {
            try {
                const data: any = await fetch('search-index')

                if (!data?.status) throw new Error('Indice di ricerca non disponibile')

                index.value = buildSearchIndex([
                    ...(data.ospedali ?? []),
                    ...(data.province ?? []),
                    ...(data.regioni ?? []),
                ])
            } catch (e) {
                errore.value = true
                caricamento = null
            } finally {
                isLoading.value = false
            }
        })()

        return caricamento
    }

    function cerca(query: string, limit = 10): SearchResult[] {
        if (!index.value || !query.trim()) return []

        return eseguiRicerca(index.value, query, {
            limit,
            userPosition: geolocationStore.geolocation.init ? geolocationStore.userPosition : null,
        })
    }

    function open() {
        isOpen.value = true
        ensureIndex()
    }

    function close() {
        isOpen.value = false
    }

    function caricaRecenti() {
        try {
            const salvato = localStorage.getItem(CHIAVE_RECENTI)
            recenti.value = salvato ? JSON.parse(salvato) : []
        } catch {
            recenti.value = []
        }
    }

    function aggiungiRecente(doc: SearchDoc) {
        const voce: Recente = {
            tipo: doc.tipo,
            nome: doc.nome,
            url: doc.url,
            sottotitolo: sottotitoloDi(doc),
        }

        recenti.value = [voce, ...recenti.value.filter((r) => r.url !== voce.url)].slice(0, MAX_RECENTI)

        try {
            localStorage.setItem(CHIAVE_RECENTI, JSON.stringify(recenti.value))
        } catch {
            /* spazio non disponibile: le recenti restano solo in memoria */
        }
    }

    function svuotaRecenti() {
        recenti.value = []
        try {
            localStorage.removeItem(CHIAVE_RECENTI)
        } catch {
            /* niente da fare */
        }
    }

    return {
        index,
        isOpen,
        isLoading,
        isReady,
        errore,
        recenti,
        regioni,
        totali,
        ensureIndex,
        cerca,
        open,
        close,
        caricaRecenti,
        aggiungiRecente,
        svuotaRecenti,
    }
})

/** Riga di contesto mostrata sotto al nome nei risultati. */
export function sottotitoloDi(doc: SearchDoc): string {
    if (doc.tipo === 'ospedale') {
        return [doc.comune, doc.provincia_nome, doc.regione_nome].filter(Boolean).join(' · ')
    }

    if (doc.tipo === 'provincia') {
        return `${doc.regione_nome} · ${doc.n_ospedali} ${doc.n_ospedali === 1 ? 'ospedale' : 'ospedali'}`
    }

    return `${doc.n_province} province · ${doc.n_ospedali} ospedali`
}
