import {defineStore} from 'pinia'

export const useApiStore = defineStore('api', {
    state: () => ({
        listRegion: null,
    }),
    actions: {
        fetchInit: async function () {
            this.listRegion = await fetch('init');
        },
    },
})