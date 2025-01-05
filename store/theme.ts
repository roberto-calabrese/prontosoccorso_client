import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
    const theme = useTheme()

    const currentTheme = ref(localStorage.getItem('theme') || 'customDarkTheme')

    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'customLightTheme' ? 'customDarkTheme' : 'customLightTheme'
        theme.global.name.value = currentTheme.value
        localStorage.setItem('theme', currentTheme.value)
    }

    theme.global.name.value = currentTheme.value

    const themeIcon = computed(() => {
        return currentTheme.value === 'customLightTheme' ? 'mdi-weather-night' : 'mdi-weather-sunny'
    })

    return {
        currentTheme,
        toggleTheme,
        themeIcon,
    }
})