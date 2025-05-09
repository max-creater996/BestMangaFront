// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: 'src/',
  dir: {
    public: '../public'
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    "@pinia/nuxt",
  ],
  css: ["@/app/styles/globals.scss"],
  nitro: {
    preset: 'vercel'
  },
  runtimeConfig: {
    public: {
      // публичные переменные окружения
    },
    // приватные переменные окружения
  }
})