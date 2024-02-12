import { ref } from 'vue';

export default function apiRegioni() {
    const apiData = ref([]);

    const fetchRegioni = async () => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.apiBaseUrl}/regioni`);
            apiData.value = await response.json();
        } catch (error) {
            console.error('Errore durante la chiamata API:', error);
        }
    };

    return {
        apiData,
        fetchRegioni
    };
}
