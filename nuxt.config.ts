// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.NUXT_STORYBLOK_TOKEN,
        apiOptions: {
          region: 'eu',
        },
      },
    ],

    // '@nuxtjs/i18n',      -- Iteration 3
    // '@pinia/nuxt',       -- when needed
  ],

  runtimeConfig: {
    storyblokToken: process.env.NUXT_STORYBLOK_TOKEN,
    public: {
      storyblokVersion: process.env.NUXT_PUBLIC_STORYBLOK_VERSION, // override via .env: NUXT_PUBLIC_STORYBLOK_VERSION
    },
  },

  typescript: {
    strict: true,
  },
})
