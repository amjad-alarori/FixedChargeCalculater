// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    ],
    colorMode: {
      classSuffix: '',
      preference: 'system', // default value of $colorMode.preference
      fallback: 'light',    // fallback value if not system preference found
      hid: 'nuxt-color-mode-script',
      globalName: '__NUXT_COLOR_MODE__',
      componentName: 'ColorScheme',
      classPrefix: '',
      storageKey: 'nuxt-color-mode'
    },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
});
