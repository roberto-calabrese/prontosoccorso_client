import {useCoreStore} from "~/store/core";

export async function fetch(path: any) {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    const coreStore = useCoreStore()
    try {
        coreStore.setLoading(true)
        return await $fetch(`${baseURL}/${path}`);
    } catch (error) {
        console.log(error);
        coreStore.setSnackBar({
            active: true,
            text: `Errore durante il fetch dei dati: ${path}`,
            color: 'red'
        })
    } finally {
        setTimeout(() => {
            coreStore.setLoading(false)
        }, 1000)
    }
}