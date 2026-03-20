// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // Nuxt reserved filenames are dictated by the framework and cannot be multi-word.
    // Disable the rule for pages, layouts, and the global error page.
    files: ['app/pages/**/*.vue', 'app/layouts/**/*.vue', 'app/error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
