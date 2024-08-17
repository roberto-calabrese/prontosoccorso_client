import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {Geolocation} from '@capacitor/geolocation';

interface GeolocationState {
    init: boolean;
    loading: boolean;
    watch: string | number | null; // Il tipo string è per supportare l'ID del watch di Capacitor
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

    const isCapacitorNative = () => {
        return !!(window as any).Capacitor?.isNativePlatform?.();
    }

    const trackPosition = async () => {
        geolocation.value.loading = true;
        if (isCapacitorNative()) {
            try {
                geolocation.value.watch = await Geolocation.watchPosition(
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0,
                    },
                    (position, err) => {
                        if (position) {
                            successPosition(position);
                        } else if (err) {
                            failurePosition(err);
                        }
                    }
                );
            } catch (error) {
                failurePosition(error);
            }
        } else if (navigator.geolocation) {
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

    const successPosition = (position: any) => {
        if (!geolocation.value.init) {
            geolocation.value.init = true;
            successNotify('Geolocalizzazione attivata con successo!');
        }
        geolocation.value.loading = false;
        userPosition.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    };

    const failurePosition = (error: any) => {
        geolocation.value.loading = false;
        console.error('Error Code:', error.code, 'Error Message:', error.message);
        const message = 'Non è stato possibile determinare la tua posizione'
        alert(message)
        dangerNotify(message);
    };

    const clearWatch = async () => {
        if (geolocation.value.watch !== null) {
            if (isCapacitorNative()) {
                await Geolocation.clearWatch({ id: geolocation.value.watch as string });
            } else {
                navigator.geolocation.clearWatch(geolocation.value.watch as number);
            }
        }
        geolocation.value.init = false;
        userPosition.value = null;
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