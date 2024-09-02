import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    return;

    // const router = useRouter();
    //
    // // Inizializza Google Analytics
    // const GA_MEASUREMENT_ID = config.public.ga_measurement_id
    //
    // const loadGoogleAnalytics = () => {
    //     const script = document.createElement('script');
    //     script.async = true;
    //     script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    //     document.head.appendChild(script);
    //
    //     window.dataLayer = window.dataLayer || [];
    //
    //     window.gtag = function () {
    //         window.dataLayer.push(arguments);
    //     };
    //
    //     window.gtag('js', new Date());
    //     window.gtag('config', GA_MEASUREMENT_ID);
    //
    //     return window.gtag;
    // };
    //
    // const gtag = loadGoogleAnalytics();
    //
    // const platform = Capacitor.getPlatform();
    // console.log(`App running on platform: ${platform}`);
    //
    // window.gtag('event', 'platform_info', {
    //     event_category: 'platform',
    //     event_label: platform,
    // });
    //
    // router.afterEach((to) => {
    //     window.gtag('config', GA_MEASUREMENT_ID, {
    //         page_path: to.fullPath,
    //         platform: platform, // Aggiungi la piattaforma come parametro
    //     });
    // });
    //
    // nuxtApp.provide('gtag', gtag);
});