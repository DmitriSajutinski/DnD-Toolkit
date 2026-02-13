# Architecture Overview — DnD Reference Hub (Next.js + Storyblok)

This document describes the target architecture of the pet project “DnD reference hub” for players (and, in the future, GMs). Its purpose is to capture how the system is structured, why specific decisions were made, and where responsibility boundaries lie, so that the document can serve as a reference for implementation, scaling, and future ADRs.

> **Assumptions (explicit):**
> - The system is predominantly read-only; content changes are performed via the CMS, not through the application.
> - The MVP is optimized for fast access to reference information during live game sessions; priorities are latency, predictable UI, and perceived responsiveness similar to offline usage.
> - Deployment follows a standard Next.js setup (Vercel or equivalent) with support for ISR and platform-level caching.
> - Internationalization: RU/ET/EN for both UI and content; locale affects routing and content resolution.
> - MVP has no accounts and no server-side user state; user preferences (e.g. favorites) are stored locally in the browser.

---

## 1) Architecture Overview

The system is a content-driven web application built with Next.js (App Router), relying primarily on server-side rendering via React Server Components and using a headless CMS (Storyblok) as its data source. The application provides fast access to structured reference content (rules, conditions, actions, etc.) with navigation, search, and bilingual support. Content is delivered through a dedicated Content Access Layer that isolates the domain model from CMS-specific details.

The core principle is **content-first + performance-first**. Content is modeled as explicit domain entities (Condition, Action, etc.), while delivery and rendering are optimized for fast read access during sessions. The MVP intentionally keeps complexity to a minimum: server-side rendering with caching and revalidation, without server-side user state. At the same time, the architecture anticipates future extensions such as authentication, notes, GM tools, and media support.

**Key architectural principles:**
- **Separation of Concerns:** UI and routing are decoupled from domain logic and CMS integration.
- **Domain-first modeling:** the domain model is independent of Storyblok data structures.
- **Performance-first:** server components by default, aggressive caching on the read path, minimal client-side JavaScript.
- **I18n by design:** locale is a first-class concern in routing and content resolution.
- **Resilience:** graceful degradation in case of CMS failures and predictable fallback behavior.

**Client / server at a glance:**
- The server side (Next.js runtime) handles routing, content fetching and validation, caching, and HTML/RSC generation.
- The client side (browser) handles interactivity where required (search UI, filters, favorites, local preferences) and UX patterns (loading states, navigation).

---

## 2) High-Level Architecture Diagram (textual)

Textual representation with responsibility boundaries:

- **User**
  → **Browser (UI runtime)**
  → **Next.js App Router (Server Runtime)**
  → **Content Access Layer (ContentRepository + mappers/validators)**
  → **CMS API (Storyblok Delivery API + Webhooks)**
  → **Storyblok Content Storage**

Extended view (including caching and i18n):

- User
  → Browser
    - local state (favorites, settings)
    - client-side navigation
      → Next.js (App Router)
    - route resolution (including locale prefix)
    - RSC rendering / SSR
    - error boundaries / loading UI
    - cache layer (Next.js fetch cache / ISR / CDN cache)
      → Content Access Layer
    - ContentRepository interface
    - CMS adapter (Storyblok)
    - DTO → Domain mapping
    - validation and sanitization
      → Storyblok
    - structured content
    - versioning/drafts (out of scope for runtime in MVP)
    - webhook triggers for revalidation

**Responsibility boundaries:**
- **Next.js layer:** web concerns (routing, rendering, caching orchestration).
- **Content Access Layer:** stable domain contract and CMS adaptation.
- **CMS:** source of truth for content; the application does not directly depend on CMS schemas.

---

## 3) Frontend Architecture (Next.js App Router)

### App Router usage
The App Router is used as the primary composition mechanism:
- **Route segments** for reference sections (rules, conditions, actions, tags).
- **Nested layouts** for a stable application shell: header, navigation, search, language switcher, content container.
- **Server-first data fetching:** pages and most components load data on the server via the ContentRepository.

### Server Components vs Client Components
**Server Components (default):**
- Content pages (RulePage / Condition / Action) to minimize client JS and improve TTFB/LCP.
- Navigation trees and breadcrumbs when derived from content and safely cacheable.
- Metadata generation (title, description) based on domain entities.

**Client Components (selectively):**
- Interactive search UI (input, instant suggestions/results).
- Filters and sorting where immediate feedback is expected.
- Favorites/bookmarks (local storage, UI synchronization).
- Locale switcher if client-side UX without full reload is desired.

**Decision rule:**
- If a component can be fully derived from domain data and does not require browser APIs, it should be a Server Component.
- If browser state, events, storage, or advanced interactivity is required, it becomes a Client Component.

### Routing strategy (static, dynamic, localized)
- **Localized routes:** locale prefix in the URL (e.g. `/ru/...`, `/en/...`) as the single source of truth for locale.
- **Dynamic routes** for content entities by slug/id:
    - `/[locale]/conditions/[slug]`
    - `/[locale]/actions/[slug]`
    - `/[locale]/rules/[...path]` (for hierarchical rules)
- **Static generation / ISR:** preferred for entity pages where content volume and update frequency allow.

### Layouts, templates, loading/error boundaries
- **Root layout:** typography/theme providers, base grid, global navigation.
- **Section layouts:** shared UI for a section (e.g. list + filters).
- **Loading boundaries:** localized loading states at section/page level.
- **Error boundaries:** at route segment level to isolate CMS or mapping errors.

---

## 4) Content Architecture (Headless CMS)

### Role of Storyblok
Storyblok is used as:
- the **source of truth** for reference content;
- an **editorial tool** for managing entities, translations, relations, and media;
- a **revalidation trigger** via webhooks on content publish/update.

The application must not rely on Storyblok-specific structures in UI code. All CMS integration is encapsulated in an adapter.

### Conceptual content models (CMS-agnostic)
- **Condition**
    - slug, title, summary, description (rich text), mechanics, relatedConditions, tags
- **Action**
    - slug, title, type (action/bonus/reaction), description, prerequisites, tags, relatedRules
- **RulePage**
    - slug/path, title, body, hierarchy (parent/children), references
- **Tag**
    - slug, title, category (e.g. combat, exploration), synonyms
- **Media**
    - assetUrl, altText, caption, attribution/license (future GM content)

The domain model supports relations between entities (Condition ↔ RulePage ↔ Action) and multilingual variants.

### Content delivery
- Read path uses the Storyblok Delivery API (public, read-only).
- MVP assumes published content only.
- Page and cache revalidation is time-based or webhook-driven (see section 7).

### Domain independence from CMS
- External CMS formats (Storyblok JSON/blocks) are converted into DTOs and then mapped to domain entities.
- Rich text is normalized into an internal representation (or safely pre-rendered HTML, depending on XSS policy).
- CMS-specific details (component names, blok fields, link resolution) remain inside the adapter.

---

## 5) Content Access Layer (Abstraction)

### ContentRepository
A dedicated `ContentRepository` interface exposes domain-oriented operations:
- `getConditionBySlug(locale, slug)`
- `listConditions(locale, filters)`
- `getActionBySlug(locale, slug)`
- `getRulePageByPath(locale, path)`
- `search(locale, query, scope)`
- `getTags(locale)`

### Why an abstraction layer is required
- **Dependency inversion:** UI and routing depend on a stable domain contract, not on the Storyblok API.
- **Testability:** repositories can be replaced with mock/local implementations without network calls.
- **Future-proofing:** replacing the CMS or adding additional sources does not affect UI code.

### Possible implementations
- **StoryblokContentRepository**
    - Handles Delivery API calls, link resolution, rich text normalization, mapping, and validation.
- **Mock / LocalContentRepository**
    - Used for tests, Storybook/preview environments, and local development.
    - Enables deterministic reproduction of edge cases and failure scenarios.

### Benefits for testing and CMS replacement
- Tests are written against domain entities, not CMS payloads.
- Integration tests focus on the adapter and mapping correctness.
- Cache decorators (e.g. `CachedContentRepository`) can be added transparently.

---

## 6) Data Flow (Read Path)

Example flow for loading an entity page (e.g. Condition):

1) **HTTP request → Route resolution**
    - Next.js resolves the route segment and locale from the URL prefix.

2) **I18n resolving**
    - UI strings: relevant translation namespaces are loaded.
    - Content: locale is passed to the ContentRepository.

3) **Content load**
    - Server Component calls `ContentRepository.getConditionBySlug(locale, slug)`.
    - Repository fetches DTOs from the CMS.

4) **Validation & mapping**
    - DTOs are validated for structure and required fields.
    - Data is mapped to the `Condition` domain entity.
    - Relations are resolved with controlled depth to avoid graph explosion.

5) **Caching**
    - Next.js fetch caching and/or ISR route caching applies according to policy.
    - List/search endpoints may use cache keys derived from `(locale, query, filters)`.

6) **Render**
    - Server Component renders the page using the domain entity.
    - Client Components receive only minimal necessary data.

7) **Error handling**
    - Domain-level errors (e.g. `ContentUnavailable`, `ContentNotFound`, `ContentInvalid`) are thrown.
    - Route-level error boundaries present predictable UX.

---

## 7) Caching & Revalidation Strategy

### Caching in Next.js
For a read-heavy reference application:
- **Route-level caching / ISR** for entity and rule pages.
- **Fetch caching** for CMS requests inside server components and repositories.

### Revalidation approaches
**Time-based revalidation (MVP baseline):**
- Pages are revalidated at fixed intervals.
- Pros: simple, low operational overhead.
- Cons: updates are not instantaneous.

**Webhook-based revalidation (MVP+ / V1):**
- Storyblok webhooks trigger route/tag revalidation.
- Pros: near-instant freshness.
- Cons: requires reliable webhook delivery and secure endpoints.

### Freshness vs performance
- Stable performance and availability during sessions are prioritized over immediate freshness.
- Content updates are infrequent enough to tolerate short staleness windows.

### Why this approach for MVP
- Time-based revalidation offers predictability and simplicity.
- Webhook support is architecturally anticipated but deferred until needed.

---

## 8) Internationalization Architecture

### UI strings vs content translations
- **UI strings:** stored in the codebase, versioned in git, strongly keyed.
- **Content translations:** managed in the CMS; each entity has RU/EN variants linked by a stable identifier.

### Active locale resolution
- The **URL locale prefix** is the single source of truth.
- Optional initial redirect from `/` based on browser preference, after which the locale is fixed by the route.

### Route and content synchronization
- Locale from the route is passed to the ContentRepository.
- The repository returns content only for the requested locale.
- Relations between entities are resolved within the same locale or follow a clearly defined fallback policy.

### Potential edge cases
- Content exists in RU but not in EN:
    - Policy options: explicit “not available in this language” or clearly marked fallback (preferably post-MVP).
- Slug mismatch between locales:
    - Prefer canonical IDs with localized slugs; routing uses localized slugs, relations use canonical IDs.
- SEO/metadata:
    - Metadata is generated per locale without silent language mixing.

---

## 9) Error Handling & Resilience

### Error boundaries
- Route-segment-level error boundaries isolate:
    - content loading failures,
    - mapping/validation errors,
    - rendering issues.
- The global application shell remains usable.

### CMS unavailability behavior
- Typical scenarios:
    - **Timeouts / 5xx:** show “content temporarily unavailable” with retry option.
    - **Partial degradation:** related blocks may be omitted while the main content remains visible.
- Cached “last known good” pages via ISR may still be served.

### Fallback strategies
- Lists/navigation may use cached data.
- Critical pages without cache show a clear error state (no infinite spinners).
- I18n fallbacks must be explicit or disabled.

### User-facing UX
- Messages are concise and actionable.
- Core navigation and language switching should remain accessible when possible.

---

## 10) Scalability & Future Evolution

### Forward-looking decisions
- **ContentRepository abstraction:** enables adding user-generated data sources later.
- **Separation of CMS content vs UGC:**
    - CMS content: global, cacheable, read-heavy.
    - UGC (notes, favorites later): per-user, requires auth and persistence.
- **Layout/segment composition:** supports adding GM tools without restructuring navigation.

### Intentionally deferred
- Server-side user state and account system.
- Full server-side search backend.
- Media pipeline (optimization, licensing) until GM features require it.

### Planned evolution
- **V1:** webhook-based revalidation, improved search (possibly hybrid), richer content relations.
- **V2:** authentication, notes, GM board, database-backed persistence, RBAC.

---

## 11) Architecture Trade-offs

1) **Server Components / SSR + caching vs SPA-first**
    - Alternative: client-only SPA fetching CMS data directly.
    - Not chosen: worse performance control, larger JS bundles, higher latency risk.
    - Consequence: more complex server/client boundaries, better LCP and stability.

2) **ISR / time-based revalidation vs webhook-only**
    - Alternative: webhook-only freshness.
    - Not chosen for MVP: higher operational complexity.
    - Consequence: small staleness windows, simpler operations.

3) **CMS-agnostic domain model vs direct CMS rendering**
    - Alternative: render Storyblok structures directly.
    - Not chosen: tight coupling, poor testability, fragile refactors.
    - Consequence: mapping/validation overhead, strong domain stability.

4) **URL locale prefix vs cookies/headers**
    - Alternative: locale via headers or cookies.
    - Not chosen: harder debugging and link sharing.
    - Consequence: longer URLs, higher predictability.

5) **Local favorites in MVP vs server sync**
    - Alternative: immediate accounts and server persistence.
    - Not chosen: larger scope and security requirements.
    - Consequence: no cross-device sync, faster MVP.

6) **Relational content graph vs flat pages**
    - Alternative: isolated pages without relations.
    - Not chosen: weaker navigation during sessions.
    - Consequence: need to control resolution depth and caching, richer UX.

---
