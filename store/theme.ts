// stores/themeStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
    const theme = useTheme()

    // Stato iniziale basato su localStorage o un valore di default
    const currentTheme = ref(localStorage.getItem('theme') || 'customLightTheme')

    // Metodo per cambiare tema
    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'customLightTheme' ? 'customDarkTheme' : 'customLightTheme'
        theme.global.name.value = currentTheme.value

        // Memorizza in localStorage
        localStorage.setItem('theme', currentTheme.value)
    }

    // Imposta il tema all'avvio
    theme.global.name.value = currentTheme.value

    // Icona dinamica basata sul tema
    const themeIcon = computed(() => {
        return currentTheme.value === 'customLightTheme' ? 'mdi-weather-night' : 'mdi-weather-sunny'
    })

    return {
        currentTheme,
        toggleTheme,
        themeIcon,
    }
})