import { defineStore } from 'pinia'

interface Snackbar {
    active: boolean;
    text: string;
    color: string;
}

export const useCoreStore = defineStore('core', {
    state: (): { isLoading: boolean; snackbars: Snackbar[] } => ({
        isLoading: false,
        snackbars: []
    }),
    actions: {
        setLoading(isLoading: boolean) {
            this.isLoading = isLoading
        },
        openSnackbar(message: string, color: string = 'info') {
            this.snackbars.push({ text: message, color: color, active: true })
        },
        closeSnackbar(index: number) {
            this.snackbars.splice(index, 1)
        },
    },
})
