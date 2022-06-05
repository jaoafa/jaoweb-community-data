import { resolve } from 'path'
import { NuxtConfig } from '@nuxt/types'
import loadConfig from '~/api/lib/loadConfig'

const baseName = process.env.BASE_NAME || 'jao Minecraft Server Data'
const baseUrl = process.env.BASE_URL || 'https://jaoafa.com'
const baseDir = process.env.BASE_DIR || '/data/'
const baseDescription =
  process.env.BASE_DESCRIPTION ||
  'jao Minecraft Server に関する様々なデータを提供しています。'

const jsonConfig = loadConfig()

const config: NuxtConfig = {
  srcDir: 'src/',

  head: {
    titleTemplate: '%s - ' + baseName,
    title: baseName,
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'apple-mobile-web-app-title', content: baseName },
      { name: 'application-name', content: baseName },
      { name: 'msapplication-TileColor', content: '#ffb41d' },
      {
        name: 'msapplication-config',
        content: baseDir + '/favicons/browserconfig.xml',
      },
      { name: 'theme-color', content: '#ffb41d' },
      { hid: 'description', name: 'description', content: baseDescription },
      { hid: 'og:site_name', property: 'og:site_name', content: baseName },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: baseUrl },
      { hid: 'og:title', property: 'og:title', content: baseName },
      {
        hid: 'og:description',
        property: 'og:description',
        content: baseDescription,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary',
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@jaoafa' },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: baseDir + '/favicons/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: baseDir + '/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: baseDir + '/favicons/favicon-16x16.png',
      },
      { rel: 'manifest', href: baseDir + '/favicons/site.webmanifest' },
      {
        rel: 'mask-icon',
        href: baseDir + '/favicons/safari-pinned-tab.svg',
        color: '#ffb41d',
      },
      {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: baseDir + '/favicons/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.7.55/css/materialdesignicons.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
      },
      { rel: 'stylesheet', href: 'https://use.typekit.net/ibc0rnp.css' },
    ],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],

  modules: ['@nuxtjs/axios', 'nuxt-clipboard2', '@nuxtjs/recaptcha'],

  axios: {
    baseURL: baseDir + 'api',
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
    },
  },

  router: {
    base: baseDir,
  },

  server: {
    host: '0.0.0.0',
  },

  serverMiddleware: ['~/api'],

  build: {
    extend(config) {
      config.node = {
        child_process: 'empty',
        fs: 'empty',
        tls: 'empty',
      }
    },
  },

  alias: {
    '~/*': resolve(__dirname, 'src/*'),
  },

  recaptcha: {
    siteKey: jsonConfig.recaptcha.key,
    version: 3,
    hideBadge: true,
  },

  telemetry: false,
}

module.exports = config
