import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      title: "Pronto Soccorso Live",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/gif', href: '/favicon.gif' },
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
      ]

    },
    pageTransition: {name: 'page', mode: 'out-in'}

  },

  build: {
    transpile: ['vuetify'],
  },

  devtools: {enabled: true},

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({autoImport: true}))
      })
    },

  ],


  plugins: [
    {src: '~/plugins/pusher', mode: 'client'},
    {src: '~/plugins/google-analytics.client', mode: 'client'},
  ],

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
      },
      ga_measurement_id: process.env.GA_MEASUREMENT_ID
    }
  },

  ssr: false,

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2024-08-14'
})