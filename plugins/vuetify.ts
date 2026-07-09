// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {

    const customDarkTheme = {
        dark: true,
        colors: {
            background: "#14181d",
            surface: "#1b2129",
            primary: "#ff4d4f",
            secondary: "#ff7a59",
            error: "#ff5252",
            info: "#4a90d9",
            success: "#3ddc84",
            warning: "#ffb020",
            navbar1: "#0f1216",
            navbar2: "#1b222b",
            bg1: "#14181d",
            bg2: "#262d36",
            string: "#eceef1",
            1: "#ff6b6b",
            table: "#1b2129",
            neutro: "#ffffff",
        },
    };

    const customLightTheme = {
        dark: false,
        colors: {
            background: "#e7ecf1",
            surface: "#ffffff",
            primary: "#e5322f",
            secondary: "#ff7a59",
            error: "#d32f2f",
            info: "#5b7683",
            success: "#2e9e5b",
            warning: "#f08c00",
            navbar1: "#ffffff",
            navbar2: "#eef2f6",
            bg1: "#eef2f6",
            bg2: "#d5dde6",
            string: "#141a21",
            1: "#d62d2a",
            table: "#1b2129",
            neutro: "#8f8f8f",
        },
    };

    const vuetify = createVuetify({
        theme: {
            defaultTheme: "customDarkTheme",
            themes: {
                customDarkTheme,
                customLightTheme
            },
        },
    })
    app.vueApp.use(vuetify)
})
