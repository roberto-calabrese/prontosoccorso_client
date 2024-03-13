import Pusher from 'pusher-js';

declare global {
    interface Window {
        pusher: any;
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    window.pusher = new Pusher(config.public.pusher.appKey, {
        cluster: 'eu',
        // altre opzioni se necessario
    });
});