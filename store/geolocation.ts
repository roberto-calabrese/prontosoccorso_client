import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface GeolocationState {
    init: boolean;
    loading: boolean;
    watch: number | null;
}

interface UserPosition {
    latitude: number;
    longitude: number;
}

export const useGeolocationStore = defineStore('geolocation', () => {
    const geolocation = ref<GeolocationState>({
        init: false,
        loading: false,
        watch: null,
    });

    const userPosition = ref<UserPosition | null>(null);

    const trackPosition = () => {
        geolocation.value.loading = true;
        if (navigator.geolocation) {
            geolocation.value.watch = navigator.geolocation.watchPosition(
                (position) => successPosition(position),
                (error) => failurePosition(error),
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                }
            );
        } else {
            dangerNotify('Il tuo Device non supporta la geolocalizzazione');
        }
    };

    const successPosition = (position: GeolocationPosition) => {
        if (!geolocation.value.init) {
            geolocation.value.init = true;
            successNotify('Geolocalizzazione attivata con successo!');
        }
        geolocation.value.loading = false;
        userPosition.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        // Chiamata per ordinare per distanza, definisci la tua logica qui
        // dispatch('sortByDistance');
    };

    const failurePosition = (error: GeolocationPositionError) => {
        geolocation.value.loading = false;
        console.error('Error Code:', error.code, 'Error Message:', error.message);
        dangerNotify('Non è stato possibile determinare la tua posizione');
    };

    const clearWatch = () => {
        if (geolocation.value.watch !== null) {
            navigator.geolocation.clearWatch(geolocation.value.watch);
        }
        geolocation.value.init = false;
        dangerNotify('Geolocalizzazione disattivata');
    };

    const successNotify = (msg: string) => {
        console.log(msg);
    };

    const dangerNotify = (msg: string) => {
        console.log(msg);
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number =>  {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat)/2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;
        return R * 2 * Math.asin(Math.sqrt(a));
    }

    return {
        geolocation: computed(() => geolocation.value),
        userPosition: computed(() => userPosition.value),
        trackPosition,
        clearWatch,
        calculateDistance,
    };
});