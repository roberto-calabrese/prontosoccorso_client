import {defineStore} from 'pinia'

export const useApiStore = defineStore('api', {
    state: () => ({
        settings: null as any,
    }),
    actions: {
        fetchSettings: async function () {
            this.settings = await fetch('settings');
        },
    },
})