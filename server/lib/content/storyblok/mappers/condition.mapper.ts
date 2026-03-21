import type { Condition } from '#server/lib/content/types'
import type { ISbStoryData } from 'storyblok-js-client'
import { richTextResolver } from '@storyblok/richtext'

const resolver = richTextResolver()

export function mapCondition(story: ISbStoryData): Condition {
  const { content } = story

  return {
    title: content.title as string,
    summary: (content.summary as string | undefined) ?? '',
    description: (resolver.render(content.description) as string) ?? '',
    mechanics: (content.mechanics as string | undefined) ?? '',
    icon: story.slug,
    tags: Array.isArray(content.tags) ? (content.tags as string[]) : [],
  }
}
