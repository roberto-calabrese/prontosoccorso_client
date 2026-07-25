/**
 * Motore di ricerca client-side per l'indice servito da /api/search-index.
 *
 * L'indice è piccolo (poche centinaia di voci) quindi si scarica una volta sola
 * e tutto il matching avviene in memoria: nessuna chiamata di rete per digitazione.
 *
 * Il punteggio combina:
 *  - match per token (esatto, prefisso, sottostringa, fuzzy con typo)
 *  - peso del campo in cui il token compare (il nome pesa più dell'indirizzo)
 *  - IDF: un termine comune come "ospedale" conta meno di "dulbecco"
 *  - intento della query ("regione toscana" preferisce la regione alla provincia)
 *  - vicinanza geografica, se l'utente ha attivato la geolocalizzazione
 */

export type SearchTipo = 'ospedale' | 'provincia' | 'regione'

export interface SearchDoc {
    tipo: SearchTipo
    nome: string
    slug: string
    url: string
    descrizione?: string | null
    comune?: string | null
    indirizzo?: string | null
    telefono?: string | null
    adulti?: boolean
    regione?: string
    regione_nome?: string
    provincia?: string
    provincia_nome?: string
    sigla?: string | null
    coords?: { lat: number; lng: number } | null
    n_ospedali?: number
    n_province?: number
}

export interface SearchResult {
    doc: SearchDoc
    score: number
    distanza?: number
}

export interface SearchIndex {
    docs: SearchDoc[]
    entries: IndexEntry[]
    idf: Map<string, number>
}

interface IndexEntry {
    doc: SearchDoc
    /** token -> peso massimo del campo in cui compare */
    terms: Map<string, number>
    nome: string
}

export interface SearchOptions {
    limit?: number
    userPosition?: { latitude: number; longitude: number } | null
}

/* ------------------------------------------------------------------ *
 * Normalizzazione
 * ------------------------------------------------------------------ */

/** Minuscolo e senza accenti, mantenendo la corrispondenza 1:1 con i caratteri originali. */
export const fold = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

const tokenize = (value: string): string[] =>
    fold(value)
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean)

/** Parole troppo generiche per contribuire al match, quando non compaiono nell'indice. */
const STOPWORDS = new Set([
    'di', 'de', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'da', 'a', 'ad',
    'in', 'il', 'lo', 'la', 'le', 'i', 'gli', 'un', 'uno', 'una', 'e', 'ed', 'su',
    'per', 'con', 'the', 'dov', 'dove', 'quale', 'qual', 'mi', 'me', 'piu',
])

/** Abbreviazioni comuni espanse prima del matching. */
const ALIAS: Record<string, string[]> = {
    ps: ['pronto', 'soccorso'],
    osp: ['ospedale'],
    ped: ['pediatrico'],
    bimbi: ['pediatrico'],
    bambini: ['pediatrico'],
    poli: ['policlinico'],
    ss: ['santi'],
    s: ['san'],
    st: ['santa'],
    sant: ['santa'],
}

/** Token che rivelano che tipo di risultato interessa all'utente. */
const INTENT: Record<SearchTipo, string[]> = {
    regione: ['regione', 'regioni'],
    provincia: ['provincia', 'province', 'citta', 'zona'],
    ospedale: [
        'ospedale', 'ospedali', 'pronto', 'soccorso', 'presidio', 'clinica',
        'policlinico', 'nosocomio', 'pediatrico', 'pediatrica',
    ],
}

/* ------------------------------------------------------------------ *
 * Costruzione dell'indice
 * ------------------------------------------------------------------ */

/** Campi indicizzati e relativo peso. */
const campiPesati = (doc: SearchDoc): Array<[string | null | undefined, number]> => {
    if (doc.tipo === 'ospedale') {
        return [
            [doc.nome, 1],
            [doc.comune, 0.85],
            [doc.sigla, 0.7],
            [doc.provincia_nome, 0.6],
            [doc.descrizione, 0.5],
            [doc.regione_nome, 0.45],
            [doc.indirizzo, 0.3],
            [doc.adulti === false ? 'pediatrico bambini' : 'adulti', 0.45],
        ]
    }

    if (doc.tipo === 'provincia') {
        return [
            [doc.nome, 1],
            [doc.sigla, 0.8],
            [doc.regione_nome, 0.5],
        ]
    }

    return [[doc.nome, 1]]
}

export function buildSearchIndex(docs: SearchDoc[]): SearchIndex {
    const entries: IndexEntry[] = docs.map((doc) => {
        const terms = new Map<string, number>()

        for (const [valore, peso] of campiPesati(doc)) {
            if (!valore) continue

            const tokens = tokenize(valore).filter((t) => t.length >= 2)

            for (const token of tokens) {
                terms.set(token, Math.max(terms.get(token) ?? 0, peso))
            }

            // coppie adiacenti unite, così "villasofia" o "santanna" trovano
            // "Villa Sofia" e "Sant'Anna" anche scritti tutti attaccati
            if (peso >= 0.8) {
                for (let i = 0; i < tokens.length - 1; i++) {
                    const coppia = tokens[i] + tokens[i + 1]
                    if (coppia.length > 20) continue
                    terms.set(coppia, Math.max(terms.get(coppia) ?? 0, peso * 0.8))
                }
            }
        }

        return { doc, terms, nome: fold(doc.nome) }
    })

    const df = new Map<string, number>()
    for (const entry of entries) {
        for (const token of entry.terms.keys()) {
            df.set(token, (df.get(token) ?? 0) + 1)
        }
    }

    const totale = Math.max(entries.length, 1)
    const idf = new Map<string, number>()
    for (const [token, frequenza] of df) {
        idf.set(token, Math.log(1 + totale / frequenza))
    }

    return { docs, entries, idf }
}

/* ------------------------------------------------------------------ *
 * Matching
 * ------------------------------------------------------------------ */

/**
 * Distanza di Damerau-Levenshtein limitata: si ferma appena supera `max`.
 * Le trasposizioni contano 1 perché "pisotia" per "pistoia" è il refuso più frequente.
 */
function levenshtein(a: string, b: string, max: number): number {
    if (a === b) return 0
    if (Math.abs(a.length - b.length) > max) return max + 1

    let prima = new Array<number>(b.length + 1)
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
    let curr = new Array<number>(b.length + 1)

    for (let i = 1; i <= a.length; i++) {
        curr[0] = i
        let migliore = curr[0]

        for (let j = 1; j <= b.length; j++) {
            const costo = a[i - 1] === b[j - 1] ? 0 : 1
            let valore = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + costo)

            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                valore = Math.min(valore, prima[j - 2] + 1)
            }

            curr[j] = valore
            if (valore < migliore) migliore = valore
        }

        if (migliore > max) return max + 1

        const scarto = prima
        prima = prev
        prev = curr
        curr = scarto
    }

    return prev[b.length]
}

const maxTypo = (lunghezza: number): number => (lunghezza <= 3 ? 0 : lunghezza <= 5 ? 1 : 2)

/** Quanto bene un token della query somiglia a un token del documento (0 = niente). */
function similarita(query: string, termine: string): number {
    if (query === termine) return 1

    // termini cortissimi (sigle come "to", "me") devono valere solo se scritti per intero,
    // altrimenti "toscana" finirebbe per pescare Torino e "meyer" Messina
    if (termine.length < 4) return 0

    if (termine.startsWith(query)) {
        // più la query copre il termine, più il match è convincente
        return 0.94 * (0.65 + 0.35 * (query.length / termine.length))
    }

    if (query.length >= 4 && query.startsWith(termine)) return 0.72
    if (query.length >= 4 && termine.includes(query)) return 0.6

    if (query.length < 4) return 0

    const max = maxTypo(Math.min(query.length, termine.length))
    if (max > 0) {
        const distanza = levenshtein(query, termine, max)
        if (distanza <= max) return 0.82 - 0.22 * distanza
    }

    return 0
}

interface QueryToken {
    valore: string
    /** token "di contorno" (pronto, soccorso, ospedale, regione…): orientano ma non selezionano */
    debole: boolean
}

interface QueryPreparata {
    tokens: QueryToken[]
    forti: string[]
    intenti: Set<SearchTipo>
    testo: string
    testoForte: string
}

const isIntent = (token: string): boolean =>
    Object.values(INTENT).some((parole) => parole.includes(token))

function preparaQuery(query: string, idf: Map<string, number>): QueryPreparata {
    const grezzi = tokenize(query)
    const intenti = new Set<SearchTipo>()
    const tokens: QueryToken[] = []

    for (const token of grezzi) {
        for (const [tipo, parole] of Object.entries(INTENT) as Array<[SearchTipo, string[]]>) {
            if (parole.includes(token)) intenti.add(tipo)
        }

        for (const espanso of ALIAS[token] ?? [token]) {
            if (espanso.length < 2) continue

            // le parole di contorno restano nella query ma non decidono i risultati:
            // "pronto soccorso pistoia" deve pesare su "pistoia"
            const debole = isIntent(espanso) || STOPWORDS.has(espanso)

            if (debole && !idf.has(espanso)) continue

            tokens.push({ valore: espanso, debole })
        }
    }

    const forti = tokens.filter((t) => !t.debole).map((t) => t.valore)

    return {
        tokens,
        forti,
        intenti,
        testo: fold(query).trim(),
        testoForte: forti.join(' '),
    }
}

const distanzaKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2
    return R * 2 * Math.asin(Math.sqrt(a))
}

export function search(index: SearchIndex, query: string, options: SearchOptions = {}): SearchResult[] {
    const { limit = 12, userPosition = null } = options
    const preparata = preparaQuery(query, index.idf)

    if (!preparata.tokens.length) return []

    const risultati: SearchResult[] = []

    // se la query contiene almeno un termine "vero", sono quelli a selezionare i risultati;
    // altrimenti (es. "pronto soccorso") si ripiega su tutti i token
    const selettivi = preparata.forti.length > 0
    const fallbackIdf = Math.log(1 + index.entries.length)

    for (const entry of index.entries) {
        let punteggio = 0
        let bonusDeboli = 0
        let coperti = 0
        let richiesti = 0
        let pesoTotale = 0

        for (const { valore: tokenQuery, debole } of preparata.tokens) {
            const idfToken = index.idf.get(tokenQuery) ?? fallbackIdf
            const conta = !debole || !selettivi

            if (conta) {
                pesoTotale += idfToken
                richiesti++
            }

            let migliore = 0
            for (const [termine, pesoCampo] of entry.terms) {
                // scarto in fretta i termini di lunghezza incompatibile
                if (Math.abs(termine.length - tokenQuery.length) > 3 && !termine.startsWith(tokenQuery[0])) {
                    continue
                }

                const somiglianza = similarita(tokenQuery, termine)
                if (!somiglianza) continue

                // conta quanto è informativo ciò che l'utente ha scritto: prendendo il minimo
                // un termine raro dell'indice (es. un bigramma) non può gonfiare il punteggio
                const idfTermine = index.idf.get(termine) ?? idfToken
                const valore = somiglianza * pesoCampo * Math.min(idfToken, idfTermine)
                if (valore > migliore) migliore = valore
            }

            if (conta) {
                if (migliore > 0) coperti++
                punteggio += migliore
            } else if (migliore > 0) {
                bonusDeboli += 0.08
            }
        }

        if (!coperti) continue

        // soft AND: chi copre tutti i token della query vale molto di più
        const copertura = coperti / Math.max(richiesti, 1)
        punteggio = (punteggio / Math.max(pesoTotale, 0.001)) * Math.pow(copertura, 2.5) + bonusDeboli

        // bonus sul nome completo, sia sulla query intera sia sui soli termini significativi
        for (const testo of new Set([preparata.testo, preparata.testoForte])) {
            if (!testo) continue
            if (entry.nome === testo) punteggio += 2
            else if (entry.nome.startsWith(testo)) punteggio += 0.8
            else if (testo.length >= 3 && entry.nome.includes(testo)) punteggio += 0.35
        }

        // l'utente ha detto che tipo di risultato cerca
        if (preparata.intenti.size) {
            punteggio *= preparata.intenti.has(entry.doc.tipo) ? 1.7 : 0.75
        } else if (entry.doc.tipo !== 'ospedale') {
            // a parità di match, una query breve punta di solito al luogo
            punteggio *= entry.doc.tipo === 'regione' ? 1.08 : 1.05
        }

        let distanza: number | undefined
        if (userPosition && entry.doc.coords) {
            distanza = distanzaKm(
                userPosition.latitude,
                userPosition.longitude,
                entry.doc.coords.lat,
                entry.doc.coords.lng,
            )
            // piccola spinta a ciò che è davvero vicino, senza stravolgere la rilevanza
            if (distanza < 60) punteggio += 0.25 * (1 - distanza / 60)
        }

        if (punteggio < 0.12) continue

        risultati.push({ doc: entry.doc, score: punteggio, distanza })
    }

    return risultati
        .sort((a, b) => b.score - a.score || a.doc.nome.length - b.doc.nome.length)
        .slice(0, limit)
}

/* ------------------------------------------------------------------ *
 * Evidenziazione
 * ------------------------------------------------------------------ */

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
    )

/**
 * Restituisce il testo con i tratti corrispondenti alla query avvolti in <mark>.
 * Lavora sulla versione senza accenti ma taglia sempre la stringa originale.
 */
export function highlight(testo: string, query: string): string {
    if (!testo) return ''

    const tokens = tokenize(query).filter((t) => t.length >= 2)
    if (!tokens.length) return escapeHtml(testo)

    const piatto = fold(testo)
    const evidenziato = new Array<boolean>(testo.length).fill(false)

    for (const token of tokens) {
        let da = 0
        while (da <= piatto.length - token.length) {
            const trovato = piatto.indexOf(token, da)
            if (trovato === -1) break
            for (let i = trovato; i < trovato + token.length; i++) evidenziato[i] = true
            da = trovato + token.length
        }
    }

    let html = ''
    let dentro = false

    for (let i = 0; i < testo.length; i++) {
        if (evidenziato[i] && !dentro) {
            html += '<mark>'
            dentro = true
        } else if (!evidenziato[i] && dentro) {
            html += '</mark>'
            dentro = false
        }
        html += escapeHtml(testo[i])
    }

    return dentro ? html + '</mark>' : html
}
