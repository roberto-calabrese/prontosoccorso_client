import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        isLoading: false,
    }),
    actions: {
        setLoading(isLoading: boolean) {
            this.isLoading = isLoading
        },
    },
})