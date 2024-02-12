// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {

    const customDarkTheme = {
        dark: true,
        colors: {
            background: "#3c4244",
            surface: "#15202b",
            primary: "#3f51b5",
            secondary: "#03dac6",
            error: "#f44336",
            info: "#2196F3",
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
