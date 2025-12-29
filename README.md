# Pronto Soccorso Live - Client

Questa è l'applicazione client per **Pronto Soccorso Live**, un progetto che fornisce una panoramica in tempo reale dello stato dei pronto soccorso in Italia, suddiviso per regione e provincia.

L'applicazione permette agli utenti di visualizzare i tempi di attesa, il numero di pazienti in cura e in attesa, e altre informazioni utili per scegliere il pronto soccorso più adatto alle proprie esigenze.

## Tech Stack

Il progetto è sviluppato utilizzando tecnologie moderne per garantire prestazioni elevate e compatibilità multipiattaforma (Web, Android, iOS).

*   **Framework**: [Nuxt 3](https://nuxt.com/) (basato su Vue 3)
*   **UI Library**: [Vuetify 3](https://vuetifyjs.com/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Mobile Engine**: [Capacitor 6](https://capacitorjs.com/) (per il deploy su Android e iOS)
*   **Mappe**: [Leaflet](https://leafletjs.com/) (con marker clustering)
*   **Real-time Updates**: [Pusher](https://pusher.com/)

## Dipendenze Esterne

Questa applicazione **dipende da un backend esterno** (API) che fornisce i dati sui pronto soccorso. Le API sono ospitate in un repository separato e devono essere accessibili affinché il client funzioni correttamente.

Il codice sorgente delle API è disponibile qui: [https://github.com/roberto-calabrese/prontosoccorso_api](https://github.com/roberto-calabrese/prontosoccorso_api)

L'URL delle API deve essere configurato tramite le variabili d'ambiente.

## Installazione e Configurazione

### Prerequisiti

*   Node.js (versione raccomandata per Nuxt 3)
*   NPM o Yarn

### Setup del progetto

1.  Clona il repository:
    ```bash
    git clone <url-del-tuo-repo>
    cd prontosoccorso_client
    ```

2.  Installa le dipendenze:
    ```bash
    npm install
    ```

3.  Configura le variabili d'ambiente. Crea un file `.env` nella root del progetto e inserisci le seguenti chiavi (sostituendo i valori con quelli corretti):

    ```env
    # URL del Backend API
    API_BASEURL=https://api.tuo-dominio.com

    # Configurazione Pusher (per aggiornamenti real-time)
    PUSHER_APP_ID=tuo_app_id
    PUSHER_APP_KEY=tuo_app_key
    PUSHER_APP_CLUSTER=tuo_cluster
    PUSHER_PORT=443
    PUSHER_SCHEME=https

    # Google Analytics (Opzionale)
    GA_MEASUREMENT_ID=G-XXXXXXXXXX
    ```

### Sviluppo

Per avviare il server di sviluppo:

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`.

### Build per Produzione

Per compilare l'applicazione per la produzione web:

```bash
npm run build
# oppure per generare file statici/hybrid
npm run generate
```

### Build Mobile (Capacitor)

Se vuoi compilare l'app per Android o iOS:

1.  Assicurati di aver buildato il progetto web:
    ```bash
    npm run generate
    ```

2.  Sincronizza i file con Capacitor:
    ```bash
    npx cap sync
    ```

3.  Apri l'IDE nativo:
    ```bash
    npx cap open android
    # oppure
    npx cap open ios
    ```

