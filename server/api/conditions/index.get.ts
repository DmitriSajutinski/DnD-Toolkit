import { buildStoryblokConfig } from '#server/lib/content/storyblok/client'
import { fetchConditions } from '#server/lib/content/storyblok/fetchers'
import { ContentUnAvailable } from '#server/lib/content/errors'

export default defineCachedEventHandler(
  async (event) => {
    const runtimeConfig = useRuntimeConfig(event)
    const config = buildStoryblokConfig(runtimeConfig)

    try {
      // TODO: derive locale from request (iteration 2)
      return await fetchConditions(config, 'en')
    } catch (err) {
      if (err instanceof ContentUnAvailable) {
        throw createError({ statusCode: 503, message: 'Content temporarily unavailable' })
      }
      throw createError({ statusCode: 500, message: 'Unexpected error' })
    }
  },
  {
    maxAge: 60 * 5,
    getKey: () => 'conditions:en',
  },
)
