import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { version } from './package.json';

export default defineNuxtConfig({
  app: {
    head: {
      title: "Pronto Soccorso Live",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/gif', href: '/favicon.gif' },
        { rel: 'icon', type: 'manifest', href: 'manifest.json' },
      ],
      meta: [
        { name: 'description', content: 'Pronto Soccorso Live ti offre una panoramica in tempo reale dello stato dei pronto soccorso in Italia, suddiviso per regione/provincia.' },
        { name: '"content-language"', content: 'it-IT' },
        { property: 'og:title', content: 'Pronto Soccorso Live' },
        { property: 'og:description', content: 'Visualizza lo stato attuale dei pronto soccorso in Italia, organizzato per regione/provincia.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://prontosoccorso.live' },
        { property: 'og:image', content: 'https://prontosoccorso.live/images/ps-live-og.png' },
        { property: 'og:image:alt', content: 'Pronto Soccorso Live - Stato dei pronto soccorso in Italia' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'it_IT' }
      ]

    },
    pageTransition: {name: 'page', mode: 'out-in'}

  },

  css: [
    '@/assets/styles/global.scss',
  ],

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
    // {src: '~/plugins/google-analytics.client', mode: 'client'},
  ],

  runtimeConfig: {
    // The private keys which are only available server-side
    secret: process.env.SECRET,
    // Keys within public are also exposed client-side
    public: {
      appVersion: version,
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
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `
    //         @import "@/assets/styles/global.scss";
    //       `,
    //     },
    //   },
    // },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },
    build: {
      minify: 'terser', // Usa Terser invece di esbuild
      sourcemap: false,
      cssMinify: true,
      terserOptions: {
        compress: {
          drop_console: true, // Rimuovi i console.log in produzione
          drop_debugger: true, // Rimuovi i debugger in produzione
        },
        output: {
          comments: false, // Rimuovi i commenti
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2024-08-14'
})