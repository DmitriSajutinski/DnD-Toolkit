// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/component-api-style': ['error', ['script-setup']],
    '@typescript-eslint/no-explicit-any': 'error',
  },
})
