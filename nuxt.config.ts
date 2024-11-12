// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxt/icon",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
  ],
  supabase: {
    redirect: false,
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
