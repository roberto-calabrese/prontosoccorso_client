import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin((nuxtApp) => {
    // if (process.env.NODE_ENV !== 'production') {
    //     // Non caricare Google Analytics se non siamo in produzione
    //     return;
    // }

    const router = useRouter();

    // Inizializza Google Analytics
    const GA_MEASUREMENT_ID = 'G-03L07CBEQ0'; // Sostituisci con il tuo Measurement ID

    // Carica lo script di Google Analytics
    const loadGoogleAnalytics = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Aggiungi dataLayer a window e dichiara gtag
        window.dataLayer = window.dataLayer || [];

        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        // Inizializzazione Google Analytics
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID);

        return window.gtag;
    };

    // Esegui il caricamento di Google Analytics e ottieni la funzione gtag
    const gtag = loadGoogleAnalytics();

    // Identifica la piattaforma corrente con Capacitor
    const platform = Capacitor.getPlatform();
    console.log(`App running on platform: ${platform}`);

    // Traccia l'informazione della piattaforma in Google Analytics
    window.gtag('event', 'platform_info', {
        event_category: 'platform',
        event_label: platform,
    });

    // Traccia le visualizzazioni di pagina
    router.afterEach((to) => {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: to.fullPath,
            platform: platform, // Aggiungi la piattaforma come parametro
        });
    });

    // Rendi la funzione gtag disponibile nell'app
    nuxtApp.provide('gtag', gtag);
});