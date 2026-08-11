/**
 * Letture derivate dai dati live di un pronto soccorso: quanto è carico,
 * quanto dista, quale conviene a parità di urgenza.
 *
 * Sono tutte STIME basate sui numeri pubblicati dai presidi: servono a orientarsi,
 * non a decidere un percorso di cura. In emergenza si chiama il 112.
 */

export type LivelloCarico = 'scarico' | 'moderato' | 'affollato' | 'critico' | 'sconosciuto'

export interface Carico {
    livello: LivelloCarico
    etichetta: string
    colore: string
    /** pazienti in attesa, quando il presidio lo pubblica */
    inAttesa: number | null
    /** indice di sovraffollamento in percentuale, quando disponibile */
    indice: number | null
}

export interface CodiceColore {
    codice: string
    valore: number | null
    colore: string
}

/** Colori fissi: devono restare leggibili su mappa chiara e scura. */
export const COLORI_CARICO: Record<LivelloCarico, string> = {
    scarico: '#2e9e5b',
    moderato: '#f0a020',
    affollato: '#ef6c1a',
    critico: '#e5322f',
    sconosciuto: '#78838f',
}

const ETICHETTE_CARICO: Record<LivelloCarico, string> = {
    scarico: 'Poco affollato',
    moderato: 'Affluenza media',
    affollato: 'Affollato',
    critico: 'Molto affollato',
    sconosciuto: 'Dati non disponibili',
}

/** Ordine con cui i codici vengono mostrati ovunque. */
export const ORDINE_CODICI = ['rosso', 'arancione', 'giallo', 'verde', 'azzurro', 'bianco'] as const

export const COLORI_CODICE: Record<string, string> = {
    rosso: '#e53935',
    arancione: '#fb8c00',
    giallo: '#fdd835',
    verde: '#43a047',
    azzurro: '#29b6f6',
    bianco: '#e0e0e0',
}

/** I valori arrivano come numeri, come stringhe o come "-" quando mancano. */
export function numeroDa(valore: unknown): number | null {
    if (typeof valore === 'number') return Number.isFinite(valore) ? valore : null
    if (typeof valore !== 'string') return null

    const pulito = valore.replace(/[^0-9.]/g, '')
    if (!pulito) return null

    const numero = Number.parseFloat(pulito)
    return Number.isFinite(numero) ? numero : null
}

/** Indice di sovraffollamento pubblicato dal presidio (in %). */
export function indiceSovraffollamento(dati: any): number | null {
    return numeroDa(dati?.extra?.indice_sovraffollamento?.value)
}

export function pazientiInAttesa(dati: any): number | null {
    return numeroDa(dati?.totali?.value)
}

export function codiciColore(dati: any): CodiceColore[] {
    if (!dati) return []

    return ORDINE_CODICI.filter((codice) => dati[codice] !== undefined).map((codice) => ({
        codice,
        valore: numeroDa(dati[codice]?.value),
        colore: COLORI_CODICE[codice],
    }))
}

/**
 * Il carico si legge dall'indice di sovraffollamento quando c'è (è il dato più
 * onesto perché rapportato alla capienza), altrimenti dai pazienti in attesa.
 */
export function calcolaCarico(dati: any): Carico {
    const indice = indiceSovraffollamento(dati)
    const inAttesa = pazientiInAttesa(dati)

    let livello: LivelloCarico = 'sconosciuto'

    if (indice !== null) {
        if (indice < 60) livello = 'scarico'
        else if (indice < 100) livello = 'moderato'
        else if (indice < 150) livello = 'affollato'
        else livello = 'critico'
    } else if (inAttesa !== null) {
        if (inAttesa < 10) livello = 'scarico'
        else if (inAttesa < 25) livello = 'moderato'
        else if (inAttesa < 45) livello = 'affollato'
        else livello = 'critico'
    }

    return {
        livello,
        etichetta: ETICHETTE_CARICO[livello],
        colore: COLORI_CARICO[livello],
        inAttesa,
        indice,
    }
}

/**
 * Minuti in auto stimati dalla distanza in linea d'aria: le strade allungano
 * il percorso di circa un terzo e in ambito urbano si viaggia sui 42 km/h.
 */
export function minutiStimati(distanzaKm: number): number {
    return Math.max(1, Math.round(((distanzaKm * 1.35) / 42) * 60))
}

/** Penalità in minuti "equivalenti" associata all'affollamento del presidio. */
const PENALITA_MINUTI: Record<LivelloCarico, number> = {
    scarico: 0,
    moderato: 12,
    affollato: 30,
    critico: 55,
    sconosciuto: 18,
}

/**
 * Costo complessivo indicativo: tempo per arrivarci più l'attesa presumibile.
 * Serve solo a suggerire un'alternativa quando il più vicino è molto affollato.
 */
export function costoStimato(distanzaKm: number | null, carico: Carico): number | null {
    if (distanzaKm === null || !Number.isFinite(distanzaKm)) return null
    return minutiStimati(distanzaKm) + PENALITA_MINUTI[carico.livello]
}

export function formattaDistanza(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}
