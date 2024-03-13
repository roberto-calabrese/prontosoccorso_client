import { defineStore } from 'pinia'

interface Snackbar {
    active: boolean;
    text: string;
    color: string;
}

export const useCoreStore = defineStore('core', {
    state: (): { isLoading: boolean; snackbar: Snackbar } => ({
        isLoading: false,
        snackbar: { active: false, text: '', color: '' }
    }),
    actions: {
        setLoading(isLoading: boolean) {
            this.isLoading = isLoading
        },
        setSnackBar(value: Snackbar) {
            console.log(value);
            this.snackbar = value
        },
    },
})