// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxtjs/supabase", "@nuxt/icon"],
  supabase: {
    redirect: false,
  },
  css: [
    "./assets/style/main.scss",
    "./assets/style/design-system.scss",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "./assets/style/variables.scss" as *;',
        },
      },
    },
  },
});
