// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {

    const customDarkTheme = {
        dark: true,
        colors: {
            background: "#3c4244",
            surface: "#1E2323",
            primary: "#2196F3",
            secondary: "#d044bd",
            error: "#f44336",
            info: "#1E2323",
            success: "#4caf50",
            warning: "#fb8c00",
            navbar1: "#0a1412",
            navbar2: "#1e2323",
            bg1: "#393c3c",
            bg2: "#636b76",
            string: "#ffffff",
            1: "#ffd740",
            table: "#1E2323",
        },
    };

    const customLightTheme = {
        dark: false,
        colors: {
            background: "#FFFFFF",
            surface: "#ffffff",
            primary: "#1976D2",
            secondary: "#e91e63",
            error: "#f44336",
            info: "#535353",
            success: "#4caf50",
            warning: "#fb8c00",
            navbar1: "#eeffff",
            navbar2: "#dcdfdf",
            bg1: "#ffffff",
            bg2: "#edeaea",
            string: "#0c0c0c",
            1: "#111619",
            table: "#1E2323",
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
