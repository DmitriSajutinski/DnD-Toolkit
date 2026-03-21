import type { RuntimeConfig } from 'nuxt/schema'

export interface StoryblokConfig {
  readonly token: string
  readonly version: 'draft' | 'published'
}

export function buildStoryblokConfig(runtimeConfig: RuntimeConfig): StoryblokConfig {
  const token = runtimeConfig.storyblokToken
  const version = runtimeConfig.public.storyblokVersion

  if (!token) {
    throw new Error('NUXT_STORYBLOK_TOKEN is not set')
  }

  return {
    token,
    version: version === 'published' ? 'published' : 'draft',
  }
}
