// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  plugins: [
    { src: '~/plugins/pusher', mode: 'client' },
  ],

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },


  runtimeConfig: {
    // The private keys which are only available server-side
    secret: process.env.SECRET,
    // Keys within public are also exposed client-side
    public: {
      apiBaseUrl: process.env.API_BASEURL,
      pusher: {
        appId: process.env.PUSHER_APP_ID,
        appKey: process.env.PUSHER_APP_KEY,
        port: process.env.PUSHER_PORT,
        schema: process.env.PUSHER_SCHEME,
        appCluster: process.env.PUSHER_APP_CLUSTER
      }
    }
  }
})
