import { buildStoryblokConfig } from '#server/lib/content/storyblok/client'
import { fetchConditionBySlug } from '#server/lib/content/storyblok/fetchers'
import { ContentNotFound, ContentUnAvailable } from '#server/lib/content/errors'

export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
      throw createError({ statusCode: 400, message: 'Slug is required' })
    }

    const runtimeConfig = useRuntimeConfig(event)
    const config = buildStoryblokConfig(runtimeConfig)

    try {
      // TODO: derive locale from request (iteration 2)
      return await fetchConditionBySlug(config, 'en', slug)
    } catch (err) {
      if (err instanceof ContentNotFound) {
        throw createError({ statusCode: 404, message: `Condition not found: ${slug}` })
      } else if (err instanceof ContentUnAvailable) {
        throw createError({ statusCode: 503, message: 'Content temporarily unavailable' })
      } else {
        throw createError({ statusCode: 500, message: 'Unexpected error' })
      }
    }
  },
  {
    maxAge: 60 * 15,
    getKey: (event) => `conditions:en:${getRouterParam(event, 'slug')}`,
  },
)
