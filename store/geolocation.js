import { defineStore } from 'pinia';

export const useGeolocationStore = defineStore('geolocation', {
    state: () => ({
        position: null,
        error: null,
        watcherId: null,
    }),
    actions: {
        getCurrentPosition() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    this.error = "La geolocalizzazione non è supportata dal tuo browser.";
                    reject(this.error);
                } else {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.position = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            resolve(this.position);
                        },
                        (error) => {
                            this.error = error.message;
                            reject(this.error);
                        }
                    );
                }
            });
        },
        startWatchingPosition() {
            if (!navigator.geolocation) {
                this.error = "La geolocalizzazione non è supportata dal tuo browser.";
                return;
            }
            this.watcherId = navigator.geolocation.watchPosition(
                (position) => {
                    this.position = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                },
                (error) => {
                    this.error = error.message;
                }
            );
        },
        stopWatchingPosition() {
            if (this.watcherId !== null) {
                navigator.geolocation.clearWatch(this.watcherId);
                this.watcherId = null;
            }
        },
    }
});
