import type { StoryblokConfig } from '#server/lib/content/storyblok/client'
import type { Condition, ContentList } from '#server/lib/content/types'
import type { ISbStoryData } from 'storyblok-js-client';
import StoryblokClient from 'storyblok-js-client'
import { mapCondition } from '#server/lib/content/storyblok/mappers/condition.mapper'
import { ContentNotFound, ContentUnAvailable } from '#server/lib/content/errors'

function createClient(config: StoryblokConfig): StoryblokClient {
  return new StoryblokClient({ accessToken: config.token })
}

export async function fetchConditions(
  config: StoryblokConfig,
  locale: string,
): Promise<ContentList<Condition>> {
  try {
    const storyblokApi = createClient(config)

    const { data } = await storyblokApi.get('cdn/stories', {
      version: config.version,
      content_type: 'condition',
      language: locale,
    })

    const items = (data.stories as ISbStoryData[]).map(mapCondition)

    return {
      items,
      total: data.total as number,
    }
  } catch (err) {
    throw new ContentUnAvailable(err)
  }
}

export async function fetchConditionBySlug(
  config: StoryblokConfig,
  locale: string,
  slug: string,
): Promise<Condition> {
  try {
    const storyblokApi = createClient(config)

    const { data } = await storyblokApi.get(`cdn/stories/conditions/${slug}`, {
      version: config.version,
      language: locale,
    })

    return mapCondition(data.story as ISbStoryData)
  } catch (err: unknown) {
    if (isStoryblok404(err)) {
      throw new ContentNotFound(slug)
    }
    throw new ContentUnAvailable(err)
  }
}

function isStoryblok404(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    (err as { status: number }).status === 404
  )
}
