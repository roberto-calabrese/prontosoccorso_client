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
            info: "#87c9ff",
            success: "#4caf50",
            warning: "#fb8c00",
        },
    };

    const vuetify = createVuetify({
        theme: {
            defaultTheme: "customDarkTheme",
            themes: {
                customDarkTheme,
            },
        },
    })
    app.vueApp.use(vuetify)
})
