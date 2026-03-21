export interface Condition {
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly mechanics: string
  readonly icon: string
  readonly tags: readonly string[]
}

export interface ContentList<T> {
  readonly items: T[]
  readonly total: number
}
