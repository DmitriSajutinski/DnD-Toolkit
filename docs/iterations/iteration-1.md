# Iteration 1 — Content Delivery MVP

**Goal:** Connect the application to Storyblok, define the domain model, and deliver the first real reference content pages. At the end of this iteration, a user can open a browser and read actual DnD reference content served from the CMS.

**Exit criteria:**

- A real Conditions list page loads from Storyblok at `/conditions`
- A Condition detail page renders at `/conditions/[slug]`
- Content Access Layer is in place (fetchers + composables) — no direct CMS calls in pages or components
- `npm run build` succeeds with prerendered content pages
- At least one unit test covers the Condition mapper (CMS DTO → domain entity)
- CI remains green

---

## Before You Start

### Storyblok space setup (manual prerequisite)

Before writing any code, the Storyblok space must exist and have at least one content type defined. This is a one-time manual step done in the Storyblok UI.

**What to create in Storyblok:**

1. Create a new Space (free tier is sufficient for MVP).
2. Define a **Condition** content type (component) with the following fields:
   - `title` — Text (required)
   - `slug` — Text (required, unique, URL-safe)
   - `summary` — Text (short description, shown in list views)
   - `description` — Rich Text (full content body)
   - `mechanics` — Text (optional, concise mechanical rule wording)
   - `tags` — Multi-option or relationship to Tag component
3. Create 2–3 draft Condition entries (e.g. "Blinded", "Frightened") so there is real data to render during development.
4. Copy the **Preview API token** and paste it into `.env.demo` and your local `.env`.

> Start with Conditions only. Actions and RulePages follow the same pattern and will be added in later steps once the pipeline is proven.

---

## 1. Storyblok Module Integration

**Why:** `@storyblok/nuxt` is the official Nuxt module maintained by Storyblok. It handles API client initialization, bridge injection (for live preview in the Storyblok editor), and auto-imports of the composables. Installing it correctly now avoids integration gaps later.

> **Package name:** `@storyblok/nuxt` — not `@nuxtjs/storyblok` (community, older, unmaintained). Update the comment in `nuxt.config.ts` accordingly.

**Status: already done during Iteration 0 work.** The module was installed and `nuxt.config.ts` was updated with the EU region config and `runtimeConfig` token. No action needed here — verify the existing config matches the requirements below before proceeding.

**Requirements to verify:**

- `@storyblok/nuxt` is in `dependencies` in `package.json`.
- `nuxt.config.ts` passes `accessToken` from `runtimeConfig`, not hardcoded.
- `apiOptions.region: 'eu'` is set if your Storyblok space is in the EU region.
- The bridge is not explicitly forced on in production — default behavior is acceptable for MVP.

**Decision point — where to call the Storyblok API:**

Direct calls via `useStoryblok` composable in page components are quick but break the Content Access Layer isolation (ADR-0004). From day one, all CMS access goes through fetcher functions in `server/lib/content/storyblok/fetchers.ts`. Storyblok composables are used only inside fetchers, never in API routes or pages.

---

## 2. Domain Types

**Why:** Defining TypeScript types for domain entities before implementation forces clarity on the data contract. It also means the compiler catches mismatches between what the CMS returns and what the UI expects, rather than runtime errors.

**What to define (in `server/lib/content/types.ts`):**

- `Condition` — the core domain entity for this iteration. Fields: `slug`, `title`, `summary`, `description` (normalized HTML or a safe internal rich text representation), `mechanics`, `tags`.
- `Tag` — minimal for now: `slug`, `title`. Tags will be expanded in Iteration 3 when filtering is added.
- `ContentList<T>` — generic wrapper for paginated list results: `items`, `total`, `page`.

**Rules:**

- Domain types must have zero Storyblok-specific fields. No `_uid`, no `component`, no `story` wrappers. The domain model is independent of the CMS.
- Use `readonly` where possible — domain entities are value objects, not mutable state.
- Rich text: for MVP, normalize Storyblok rich text to a plain HTML string on the server. Do not pass raw Storyblok rich text objects to the client.

---

## 3. Domain Errors

> **Why:** Typed error classes let callers handle specific failure cases without inspecting raw HTTP status codes or Storyblok-specific error shapes. Every layer above the fetchers — API routes, pages — speaks the same error vocabulary regardless of which CMS is behind it.

**What to define (in `server/lib/content/errors.ts`):**

- `ContentNotFound` — the requested slug exists in the route but the CMS returned 404.
- `ContentUnavailable` — the CMS returned a 5xx response or the request timed out; content may exist but is temporarily inaccessible.

Each class extends `Error` and carries a `_tag` string literal property (`'ContentNotFound'`, `'ContentUnavailable'`). The `_tag` discriminant makes exhaustive pattern-matching reliable across module boundaries and after serialization — avoiding the pitfalls of `instanceof` checks in TypeScript.

> **ADR reference:** ADR-0004 (pure functions + composables) supersedes ADR-0003 (class-based repository). The isolation principle from ADR-0003 is preserved — no direct CMS calls in pages or API routes — only the implementation mechanism changes.

---

## 4. Storyblok Config and Fetchers

> **Why:** Storyblok-specific API calls are isolated in pure async functions. No class, no singleton, no `this`. Each fetcher receives everything it needs as explicit parameters and either returns a domain entity or throws a typed domain error. This makes individual functions easy to read, easy to test in isolation, and easy to replace when the CMS changes.

**Storyblok config helper (in `server/lib/content/storyblok/client.ts`):**

`buildStoryblokConfig(runtimeConfig)` reads the API token and content version from the Nuxt server-side runtime config and returns a plain config object consumed by all fetchers. It must be called per request, not at module load time — this keeps secrets out of the module scope and ensures the `published`/`draft` version is resolved from the environment at call time, not baked in at startup.

> **Rule:** never read `process.env` directly in server code. Always use `useRuntimeConfig()`. This ensures values are correctly resolved across environments and the config system remains the single source of truth.

**Fetchers (in `server/lib/content/storyblok/fetchers.ts`):**

Two fetcher functions cover the Condition content type in Iteration 1:

- `fetchConditions(config, locale)` — queries the Storyblok Delivery API for all stories of the Condition content type. Maps each raw story through `mapCondition`. Returns `ContentList<Condition>`.
- `fetchConditionBySlug(config, locale, slug)` — fetches a single Condition story by its full slug. Returns `Condition`. Throws `ContentNotFound` if Storyblok returns 404; throws `ContentUnavailable` on 5xx or network failure.

Both functions accept `locale` even though i18n is not active in Iteration 1. Baking locale into the signature now avoids touching call sites when locale resolution is added in Iteration 3.

**Mappers (in `server/lib/content/storyblok/mappers/`):**

Each content type has its own mapper function: `mapCondition(story): Condition`. Mappers are pure functions — raw Storyblok story object in, domain entity out. No side effects, no dependencies. They are the primary target for unit tests in this iteration.

**Rich text:** use `@storyblok/richtext` to convert Storyblok rich text blocks to an HTML string on the server. The HTML string — not the raw block structure — is what gets stored in the `Condition` domain entity and passed to the component. This keeps CMS rendering details out of Vue templates entirely.

---

## 5. Server API Route (optional but recommended)

**Why:** Pages could call fetcher functions directly via server utilities, but wrapping them behind Nitro API routes (`server/api/conditions/index.get.ts`, `server/api/conditions/[slug].get.ts`) has clear benefits:

- Routes can be independently cached with `defineCachedEventHandler`.
- The CMS call is decoupled from the render cycle — useful when multiple pages share the same data.
- Makes it easy to add request validation or auth headers later without touching pages.

For MVP, use Nitro API routes + Nitro-level caching. The composable calls `useFetch('/api/conditions')` instead of invoking fetchers directly.

**Caching strategy for these routes:**

- List endpoint: cache for 5 minutes. List changes are less critical than detail accuracy.
- Detail endpoint: cache for 15 minutes per slug. Content updates are infrequent.
- Use `defineCachedEventHandler` with a cache key derived from `(slug, locale)`.

---

## 6. First Content Pages

**Why:** Pages are thin in this architecture. They receive domain data from the API route, render it, and handle loading/error states. No CMS logic in pages — ever.

**Pages to create:**

- `app/pages/conditions/index.vue` — list of all conditions. Fetches from `/api/conditions`. Renders a `ConditionCard` for each item.
- `app/pages/conditions/[slug].vue` — detail page for a single condition. Fetches from `/api/conditions/[slug]`. Renders title, summary, mechanics, full description.

**Component to create:**

- `app/components/content/ConditionCard.vue` — accepts a `Condition` domain entity as a prop. Renders the card used in list view. Encapsulates the card's markup and any future interactive behavior (e.g. link, hover state).

**Client-side composables (in `app/composables/`):**

Rather than calling `useFetch` directly in each page, extract the fetch logic into thin composable wrappers:

- `useConditions()` — wraps `useFetch('/api/conditions')`. Returns `{ data, pending, error }` typed to `ContentList<Condition>`.
- `useCondition(slug: MaybeRef<string>)` — wraps a reactive `useFetch` call. The `MaybeRef<string>` slug parameter ensures the fetch re-triggers automatically on slug change without manual watchers.

Pages import the composable, not `useFetch` directly. This keeps pages one level thinner and makes the data-fetching contract reusable if the same endpoint is needed from multiple components.

**Data fetching pattern in pages:**

Pages call the composable and handle three states: `pending` (loading indicator), `error` (inline error message — not the global `error.vue`, which is for full page failures), and the resolved `data` (rendered content). A 404 error from the API route should call `createError({ statusCode: 404 })` to hand off to `app/error.vue`.

**Nuxt 4 reminder:** `useFetch` returns shallow reactive data by default. `Condition` has nested objects (`tags`, etc.) but since pages only read data and never mutate it, shallow reactivity is sufficient and no `{ deep: true }` option is needed.

---

## 7. Prerendering

**Why:** Reference pages are static content. Prerendering them at build time means zero server compute per request, instant response from CDN, and the best possible LCP. This is the primary performance strategy for the MVP.

**What to configure (in `nuxt.config.ts`):**

- Add `routeRules` to prerender all condition routes: `'/conditions/**': { prerender: true }`.
- For the conditions list page, also prerender: `'/conditions': { prerender: true }`.
- Set `nitro.prerender.crawlLinks: true` so Nuxt follows internal links and discovers all slug-based routes automatically during build.

**When prerendering is not enough:**

If content changes in Storyblok, the prerendered HTML becomes stale until the next build. For MVP this is acceptable — content updates are infrequent and a manual redeploy is fine. Webhook-based revalidation is planned for V1.

---

## 8. Error Handling

**Why:** CMS failures must not crash the entire page or show a raw error screen. Reference content pages should degrade predictably — if the detail page for "Blinded" fails to load, the user sees a clear message, not a broken layout.

**What to handle:**

- `ContentNotFound` (404 from Storyblok) → call `createError({ statusCode: 404 })` in the page. This triggers `app/error.vue`.
- `ContentUnavailable` (5xx, network timeout) → show an inline retry message within the page, do not navigate to the error page. The user should be able to try again without losing their navigation context.
- Empty list (no conditions in the CMS yet) → render an explicit empty state in the list page, not a blank screen.

**Rule:** Never let a Storyblok error propagate to the component template as an unhandled exception. The error must be caught at the `useFetch` / `useAsyncData` level.

---

## 9. Unit Tests — Mapper Coverage

**Why:** Mappers are pure functions with no side effects and no dependencies. They are the most important things to test in this iteration because they are where data shape errors silently appear (a missing field, a renamed CMS property, a null where the UI expects a string).

**What to test:**

- `mapCondition` with a complete valid Storyblok story → verify all fields map correctly.
- `mapCondition` with missing optional fields → verify defaults are applied, no runtime exceptions.
- `mapCondition` with an invalid or unexpected shape → verify a typed error is thrown.

Tests live in a `__tests__` directory alongside the mappers, or in a `tests/unit/` directory at root — pick one convention and stick to it.

---

## Directory Structure After Iteration 1

```
server/
  lib/
    content/
      types.ts                          # Domain entities: Condition, Tag, ContentList
      errors.ts                         # ContentNotFound, ContentUnavailable
      storyblok/
        client.ts                       # buildStoryblokConfig(runtimeConfig)
        fetchers.ts                     # fetchConditions, fetchConditionBySlug
        mappers/
          condition.mapper.ts           # Raw Storyblok story → Condition
  api/
    conditions/
      index.get.ts                      # GET /api/conditions (defineCachedEventHandler)
      [slug].get.ts                     # GET /api/conditions/:slug (defineCachedEventHandler)

app/
  pages/
    conditions/
      index.vue                         # Conditions list
      [slug].vue                        # Condition detail
  composables/
    useConditions.ts                    # useFetch wrapper for /api/conditions
    useCondition.ts                     # useFetch wrapper for /api/conditions/:slug
  components/
    content/
      ConditionCard.vue                 # Card used in list view
```

---

## What Is Explicitly Out of Scope for Iteration 1

- Actions and RulePages — same pattern as Conditions, added once the pipeline is proven.
- i18n — locale parameter is plumbed through the fetcher signatures but only `'en'` (or no locale) is used.
- Search — Iteration 2.
- Navigation and breadcrumbs — Iteration 2.
- Visual design beyond minimal readable layout — Iteration 4.
- Webhook-based revalidation — V1.
- Pinia state management — not needed until user state exists.

---

## Completion Checklist

- [ ] Storyblok space created with Condition content type and 2–3 draft entries
- [ ] `@storyblok/nuxt` installed and configured via `runtimeConfig`
- [ ] `Condition` and `Tag` domain types defined in `server/lib/content/types.ts`
- [ ] `ContentNotFound` and `ContentUnavailable` error classes defined in `server/lib/content/errors.ts`
- [ ] `buildStoryblokConfig` reads token and version from `useRuntimeConfig()` (never `process.env`)
- [ ] `fetchConditions` and `fetchConditionBySlug` pure async functions implemented in `storyblok/fetchers.ts`
- [ ] Condition mapper converts raw Storyblok story to `Condition` domain entity
- [ ] `useConditions` and `useCondition` composables created in `app/composables/`
- [ ] Nitro API routes created for conditions list and detail
- [ ] `app/pages/conditions/index.vue` renders a list of conditions
- [ ] `app/pages/conditions/[slug].vue` renders a condition detail page
- [ ] `ConditionCard` component accepts and renders a `Condition` prop
- [ ] All three error states handled: 404, CMS failure, empty list
- [ ] `routeRules` configured for prerendering condition routes
- [ ] Mapper unit tests written and passing
- [ ] `npm run build` succeeds with prerendered routes
- [ ] CI is green
