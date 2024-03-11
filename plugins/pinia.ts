import { createPinia } from 'pinia'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((app) => {
    const pinia = createPinia()
    app.vueApp.use(pinia)
})