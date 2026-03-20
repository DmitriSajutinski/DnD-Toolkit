<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({
  title: `${props.error.statusCode} — Grimoire`,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <main class="error-page">
    <div class="error-content">
      <p class="error-code">{{ error.statusCode }}</p>

      <h1 class="error-title">
        {{ is404 ? 'Page not found' : 'Something went wrong' }}
      </h1>

      <p class="error-message">
        {{
          is404
            ? 'The page you are looking for does not exist or has been moved.'
            : 'An unexpected error occurred. Please try again later.'
        }}
      </p>

      <button class="error-action" @click="handleError">Back to home</button>
    </div>
  </main>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 2rem;
  text-align: center;
}

.error-content {
  max-width: 480px;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 1rem;
  opacity: 0.2;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.error-message {
  margin: 0 0 2rem;
  opacity: 0.7;
  line-height: 1.6;
}

.error-action {
  cursor: pointer;
  padding: 0.625rem 1.5rem;
  border: 1px solid currentColor;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.15s;
}

.error-action:hover {
  opacity: 1;
}
</style>
