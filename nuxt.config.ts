// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-echarts",
    "nuxt-graphql-client",
    "@nuxt/test-utils",
  ],
  runtimeConfig: {
    public: {
      "graphql-client": {
        tokenStorage: {
          mode: "localStorage",
        },
        clients: {
          default: {
            host: process.env.GQL_HOST,
          },
        },
      },
      apiUrl: process.env.API_URL,
      frontendUrl: process.env.FRONTEND_URL,
    },
  },
  css: [
    "./assets/style/main.scss",
    "./assets/style/animations.scss",
    "./assets/style/design-system.scss",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: '@use "./assets/style/variables.scss" as *;',
        },
      },
    },
  },
});