// composables/useAPIFetch.ts

import { useFetch } from "#app"

type useFetchType = typeof useFetch

export const useAPIFetch: useFetchType = (path, options = {}) => {
    const config = useRuntimeConfig()

    options.baseURL = config.public.apiBaseUrl
    return useFetch(path, options)
}

export async function fetch(path) {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    return await $fetch(`${baseURL}/${path}`);
}