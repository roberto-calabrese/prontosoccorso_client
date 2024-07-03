// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      title: "Pronto Soccorso Live",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }

  },
  build: {
    transpile: ['vuetify'],
  },

  devtools: {enabled: true},

  modules: [
    '@vite-pwa/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({autoImport: true}))
      })
    },
  ],

  plugins: [
    {src: '~/plugins/pusher', mode: 'client'},
  ],

  // pwa: {
  //   manifest: {
  //     name: 'Pronto Soccorso Live',
  //     short_name: "PS_LIVE",
  //     lang: 'it',
  //   }
  // },

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
  },

  ssr: false,

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})
