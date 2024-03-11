// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify' ],
  },

  plugins: [
    { src: '~/plugins/pusher', mode: 'client' },
    // { src: '~/assets/js/background/noise.min.js', mode: 'client' },
    // { src: '~/assets/js/background/util.js', mode: 'client' },
    // { src: '~/assets/js/background/shift.js', mode: 'client' },
  ],

  app: {
    head: {
      script: [
        // {type: 'text/javascript', src: '/js/background/noise.min.js', body: true },
        // {type: 'text/javascript', src: '/js/background/util.js', body: true},
        // {type: 'text/javascript', src: '/js/background/shift.js', body: true},
      ]
    },
  },

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
