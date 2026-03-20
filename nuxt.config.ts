// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    // '@nuxtjs/i18n',      -- Iteration 3
    // '@storyblok/nuxt',   -- Iteration 1
    // '@pinia/nuxt',       -- when needed
  ],

  runtimeConfig: {
    storyblokToken: '', // set via .env: NUXT_STORYBLOK_TOKEN
    public: {
      storyblokVersion: 'published', // override via .env: NUXT_PUBLIC_STORYBLOK_VERSION
    },
  },

  typescript: {
    strict: true,
    // typeCheck is intentionally omitted — it runs the full TS compiler on
    // every dev/build cycle and significantly slows the dev server.
    // Type checking runs exclusively via `npm run typecheck` (nuxt typecheck)
    // as a separate CI step.
  },
})
