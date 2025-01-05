export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.log(error)
    }

    nuxtApp.hook('vue:error', (error, instance, info) => {
        console.log(error)
    })
})
