# Grimoire — Developer Practices

This document is the authoritative reference for day-to-day development decisions. When in doubt, check here first. Everything here is enforced by lint, typecheck, or CI unless stated otherwise.

---

## Project Commands

| Command               | When to run                                         |
| --------------------- | --------------------------------------------------- |
| `npm run dev`         | Local development server with hot reload            |
| `npm run typecheck`   | Before every commit that changes TypeScript         |
| `npm run lint`        | Before every commit; auto-runs via Husky            |
| `npm run lint:fix`    | Fix auto-fixable lint errors                        |
| `npm run format`      | Apply Prettier to all files                         |
| `npm run format:check`| Verify formatting (runs in CI)                      |
| `npm run build`       | Confirm the project builds before opening a PR      |
| `npm run test:unit`   | Run Vitest unit tests (mappers and utilities)       |

The pre-commit hook (Husky + lint-staged) runs ESLint and Prettier automatically on staged files. `typecheck` and `build` are **not** in the pre-commit hook — they are CI-only to keep commits fast.

---

## Directory Layout

```
app/                    All Vue/client source (Nuxt 4 convention)
  pages/                File-based routes
  layouts/              Layout shells
  components/           Shared UI components
  composables/          useFetch wrappers and client-side composables
  assets/css/           Global styles
  error.vue             Global error page
  app.vue               Application entry point

server/                 Nitro server (at project root, not under app/)
  api/                  Nitro API route handlers
  lib/
    content/            Content Access Layer
      types.ts          Domain entity interfaces (no CMS fields)
      errors.ts         ContentNotFound, ContentUnavailable
      storyblok/        Everything Storyblok-specific lives here
        client.ts       buildStoryblokConfig(runtimeConfig)
        fetchers.ts     Pure async functions per content operation
        mappers/        Pure mapping functions (raw story → domain entity)

docs/                   Project documentation
  adr/                  Architecture Decision Records
  iterations/           Per-iteration implementation plans
```

---

## Content Access Layer Rules

These rules are enforced by code review; some are also enforced by ESLint import rules once configured.

1. **No Storyblok imports in `app/`** — `app/` must never import from `@storyblok/nuxt`, `@storyblok/richtext`, or `server/lib/content/storyblok/`.

2. **No `process.env` in server code** — always use `useRuntimeConfig()`. This ensures correct resolution across environments and keeps the config system as the single source of truth.

3. **`buildStoryblokConfig` is called per request** — never at module load time. Do not store the config object in a module-level variable.

4. **Fetchers throw typed domain errors** — `ContentNotFound` or `ContentUnavailable`. Never let raw Storyblok error shapes propagate to API routes or pages.

5. **Mappers are pure functions** — no side effects, no imports from outside `server/lib/content/`. Input is the raw Storyblok story; output is the domain entity.

6. **No direct `useFetch` in pages** — pages import from `app/composables/`. The composable owns the URL and return type.

7. **Rich text is rendered to HTML in the mapper** — components receive a `string`, never a Storyblok rich text block object.

---

## TypeScript Rules

- **Strict mode is on** (`typescript: { strict: true }` in `nuxt.config.ts`).
- **No `any`** — enforced by ESLint (`@typescript-eslint/no-explicit-any: error`).
- **Domain types have zero CMS-specific fields** — no `_uid`, no `component`, no `story` wrappers in `types.ts`.
- Use `readonly` on domain entity interfaces where mutation is not intended.
- Prefer `MaybeRef<string>` for composable parameters that accept both static and reactive values.

---

## Vue / Nuxt Component Rules

- **`<script setup lang="ts">`** is required on all components — enforced by ESLint (`vue/component-api-style`).
- **Multi-word component names** — enforced by ESLint (`vue/multi-word-component-names`). Single-word names are permitted only for Nuxt reserved filenames (`index.vue`, `error.vue`, `default.vue`).
- **Server-rendered by default** — components render on the server unless browser APIs are required. Wrap client-only behavior with `<ClientOnly>` or the `.client.vue` suffix.
- **No CMS logic in pages or components** — pages call composables; composables call API routes; API routes call fetchers. The boundary is strict.

---

## API Route Rules

- API routes use **`defineCachedEventHandler`** (not `defineEventHandler`) to enable Nitro-level caching.
- Cache keys must include locale and any dynamic identifiers (slug, page number).
- List endpoints: 5-minute cache. Detail endpoints: 15-minute cache per slug+locale.
- API routes must handle `ContentNotFound` (→ `createError({ statusCode: 404 })`) and `ContentUnavailable` (→ `createError({ statusCode: 503 })`).

---

## Error Handling

| Error class           | HTTP equivalent | Where thrown     | Where caught          |
| --------------------- | --------------- | ---------------- | --------------------- |
| `ContentNotFound`     | 404             | Fetchers         | API routes            |
| `ContentUnavailable`  | 503             | Fetchers         | API routes            |

- API routes translate domain errors to `createError()` calls.
- Pages translate 404 responses to `createError({ statusCode: 404 })` to trigger `app/error.vue`.
- 5xx/503 responses in pages show an inline retry message — not the global error page.
- Empty list results (zero items from CMS) are **not** errors — render an explicit empty state.

---

## Testing

### Unit tests (Vitest)

Target: **mapper functions and utility helpers**.

- Mappers are pure functions — no Nuxt context, no network.
- Every mapper must have tests for: complete valid input, missing optional fields (verify defaults), invalid shape (verify typed error thrown).
- Tests live in `server/lib/content/storyblok/mappers/__tests__/` alongside the mapper they cover.

### Component tests (Vue Testing Library)

Target: **components and pages with mocked composables**.

- Test loading, error, and empty states explicitly — not just the happy path.
- Use role-based queries. Failing a11y assertions block merge.

### E2E tests (Playwright)

Target: **critical user flows end to end**.

- Smoke suite only at MVP: navigation, entity detail render, error state, language switch.
- State-based waits; no `setTimeout`.

---

## Git Workflow

- `main` is the only long-lived branch. Feature work goes on short-lived branches.
- Pre-commit hook runs ESLint + Prettier on staged files automatically.
- CI runs on every push and PR: typecheck → lint → format:check → build → unit tests.
- **Do not force-push to `main`.**

---

## Environment Files

| File            | Committed | Purpose                                  |
| --------------- | --------- | ---------------------------------------- |
| `.env.example`  | Yes       | Documents all required variables (empty values) |
| `.env.demo`     | No        | Local development with a demo Storyblok space |
| `.env`          | No        | Production secrets                       |

Copy `.env.example` to `.env.demo` and fill in a Storyblok Preview API token to run the dev server against real content.
