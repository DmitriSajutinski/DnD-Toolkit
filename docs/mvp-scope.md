# Scope & MVP Definition

## 1. Scope Overview

### Product Boundaries (MVP)

The MVP is a web-based reference hub for Dungeons & Dragons players, designed to provide fast access to rules, actions, conditions, and reference information during gameplay sessions.

### In Scope

* Structured, readable, and fast access to reference content.
* Multilingual support (RU/ET/EN) at both UI and content levels.
* Optimization for in-session usage (mobile-first, low-friction UX).
* High-quality engineering practices (architecture, testing, documentation, deployment).

### Out of Scope (MVP Stage)

* Social interactions between users.
* User-generated content and personalization.
* Session management tools (maps, dice, combat tracking).

---

## 2. MVP Goals

1. Users can find any required rule, action, or condition in ≤2 interactions.
2. Average reference page load time ≤1 second on cold start.
3. 100% of UI and content available in at least two languages (RU/EN).
4. All content is managed via a headless CMS without code changes.
5. The application works reliably on mobile devices during live sessions.
6. The repository demonstrates senior-level engineering practices (architecture, DX, documentation).

---

## 3. MVP Functional Scope (Must-Have)

### Content & Reference

* Reference pages for rules, actions, and conditions.
* Hierarchical structure (categories and subcategories).
* Cross-linking between related entities (e.g., action → conditions).
* Content fully delivered from Storyblok.

### Navigation & UX

* Primary navigation by sections.
* Breadcrumbs for content pages.
* Mobile-first layout.
* Minimal number of interactions to reach target content.

### Search

* Full-text search across reference content.
* Language-aware search (per selected locale).
* Fast response with client-side optimizations (e.g., debounce).

### i18n

* Support for at least RU and EN.
* Language switching without full page reload.
* Localized URLs or language-aware routing.

### Performance & Reliability

* ISR / SSG for reference pages.
* Caching at Next.js and CDN levels.
* Graceful fallback in case of CMS unavailability.

### Quality & Developer Experience

* TypeScript strict mode enabled.
* Basic unit tests for critical components.
* ESLint + Prettier + CI checks.
* Documented architectural decisions.

---

## 4. Explicit Non-Goals (Out of Scope for MVP)

* User accounts — add significant architectural complexity without MVP-level value.
* Notes and bookmarks — require persistence and authentication.
* GM tools — represent a separate product layer.
* Realtime features — not aligned with MVP goals.
* Offline-first support — significantly increases complexity.

---

## 5. Post-MVP Scope

### V1

* User accounts.
* Personal notes and bookmarks.
* Viewing history.

### V2

* GM Board (media, references, scenes).
* User roles (Player / GM).
* Shared collaborative spaces.
* Realtime updates.

---

## 6. Assumptions & Constraints

### Technical

* Next.js App Router + TypeScript.
* Storyblok as a headless CMS.
* Deployment on Vercel.

### Content

* Use of SRD content or rewritten descriptions.
* No direct copying of protected materials.

### Resources

* Single developer.
* Pet project without strict deadlines.

### UX

* Mobile-first approach.
* Designed for live session usage.

---

## 7. Risks & Trade-offs

* Storyblok limitations — accepted for faster initial delivery.
* SEO vs. app-like UX — UX prioritized.
* Content volume — intentionally limited to a core dataset.
* Mobile performance — mitigated via SSG and caching.

---

## 8. Definition of “MVP Done”

* All must-have features implemented.
* Full RU/EN coverage.
* Application deployed and publicly accessible.
* Documentation completed (README + docs).
* Clear demo usage scenario available.

---

## 9. Roadmap (High-Level)

### Iteration 0 — Setup

* Repository initialization.
* Next.js, TypeScript, and CI configuration.
* Base architecture setup.

### Iteration 1 — Content Core

* Storyblok integration.
* Core reference pages.

### Iteration 2 — Navigation & Search

* Navigation system.
* Search functionality.

### Iteration 3 — i18n & Performance

* Multilingual support.
* Caching and performance optimization.

### Iteration 4 — Quality & Polish

* Tests.
* Documentation.
* Final deployment.
