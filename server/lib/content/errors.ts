export class ContentNotFound extends Error {
  readonly _tag = 'ContentNotFound' as const

  constructor(slug: string) {
    super(`Content not found: ${slug}`)
    this.name = 'ContentNotFound'
  }
}

export class ContentUnAvailable extends Error {
  readonly _tag = 'ContentUnAvailable' as const

  constructor(cause?: unknown) {
    super('Content temporarily unavailable')
    this.name = 'ContentUnAvailable'
    this.cause = cause
  }
}
