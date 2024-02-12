// plugins/pusher.js
import Pusher from 'pusher-js';

export default defineNuxtPlugin((nuxtApp) => {
    window.pusher = new Pusher('c1f2549429dae80f0d0c', {
        cluster: 'eu',
        // altre opzioni se necessario
    });
});
