# Testing Strategy — DnD Reference Hub (Player-First)

**Document:** `/docs/quality/testing-strategy.md`  
**Purpose:** ensure predictable, fast, and reliable product behavior during live DnD sessions, minimizing regressions and performance degradation.

---

## 1) Testing Goals & Principles

### Why we test this product

The product is used in a **high cost-of-failure** context: during a live game session, users expect instant access to information without freezes, broken pages, or unexpected content changes. Testing must ensure that:

- critical user flows (search / navigation / reading) are always functional;
- pages render correctly under different data states (empty / error / partial);
- RU/EN localization does not break UI structure or semantics;
- integration with Storyblok and caching does not produce inconsistent or stale data;
- releases do not degrade UX in terms of speed or stability.

### Core principles

- **Risk-based:** prioritize what breaks most often and hurts the most—routing, page rendering and states, CMS data transformations, i18n, live integrations, caching.
- **User-centric:** quality is defined by successful completion of key player scenarios, not by coverage metrics alone.
- **Fast feedback:** quick checks (lint / type / unit / component) must catch issues before e2e and before deployment.
- **Deterministic by default:** test data and environments must be reproducible.
- **Shift-left:** validate as much logic as possible at unit and integration levels; reserve e2e for end-to-end confidence and regression protection.
- **Accessibility baseline:** basic a11y checks are built into component tests to avoid accumulating accessibility debt.

### What testing must prevent

- 500/404 errors or render crashes on critical pages and routes.
- Incorrect CMS data transformations (broken links, missing fields, invalid types).
- i18n regressions (wrong language, missing keys, layout breakage due to text length).
- Incorrect states (loading / empty / error) and “infinite spinners”.
- Accidental breaking changes to public component APIs (props contracts, semantics, aria).
- Flaky e2e tests that block delivery without providing real signal.

**Assumptions:** the MVP includes core reference pages, entity lists (e.g. Conditions / Actions / Spells), detail pages, basic navigation, language switching, and possibly search/filtering. Data is delivered via Storyblok; some pages may be statically generated and/or cached.

---

## 2) Test Pyramid & Scope

### Project-specific test pyramid

- **Unit tests** — pure logic validation: data transformations, utilities, CMS-to-domain mapping.
- **Integration / Component tests** — validation of “data + render” coupling, UI contracts, states, i18n, and baseline accessibility.
- **End-to-End tests (E2E)** — validation of critical user scenarios across the full application (routing + data + rendering).

### Recommended ratio

- **Unit:** ~55–70%
- **Integration / Component:** ~20–35%
- **E2E:** ~5–10%

### What is intentionally not tested at each level

- **Unit:** Next.js routing, browser behavior, real Storyblok integration.
- **Integration / Component:** full system behavior, timing/animation-dependent assertions.
- **E2E:** exhaustive content combinations, pixel-perfect UI.

---

## 3) Unit Testing Strategy

### What counts as unit tests

- Domain logic and rules independent of UI.
- Utilities and helpers.
- CMS (Storyblok) data transformations and normalization.

### What is not unit testing

- React rendering and DOM behavior.
- Next.js fetch and caching mechanics.
- Literal translation correctness.

### Mocking approach

- **CMS:** local JSON fixtures and data factories.
- **i18n:** explicit locale parameters and minimal dictionaries.

### Coverage criteria

- All critical branches and edge cases covered.
- Minimum of happy-path, partial-content, and invalid-shape cases per entity.
- Target 80%+ coverage on critical modules.

---

## 4) Integration / Component Testing Strategy

### Scope

- UI components and shared building blocks.
- Pages and components rendering normalized data.

### Server vs Client Components

- **Server:** test render contracts and resilience.
- **Client:** test interactivity and state transitions.

### States and i18n

- Loading, empty, and error states are explicitly validated.
- Language switching and fallback behavior verified.

### Accessibility

- Role-based queries, keyboard navigation, aria attributes.
- Obvious violations block merges.

---

## 5) End-to-End (E2E) Testing Strategy

### Key scenarios

- App load and navigation.
- Entity detail rendering.
- Language switching.
- Error and partial-content resilience.
- Search/filter flows (if present).

### Minimal MVP suite

1. Smoke navigation flow.
2. RU/EN language switch.
3. Partial content rendering.
4. Error handling.
5. Search/filter (optional).

### Stability guidelines

- State-based waits, not time-based.
- Stable selectors.
- Fixture-driven data.

---

## 6) Test Data & Environment Strategy

### Fixtures

- Minimal, complete, partial, and invalid datasets.
- Versioned alongside schema changes.

### Environments

- **Local:** fixtures by default.
- **CI:** reproducible fixtures, optional CMS contract checks.
- **Production:** no testing; monitoring only.

### Reproducibility

- Locked dependency versions.
- Deterministic data generation.

---

## 7) Tooling

- **Unit:** Vitest, TypeScript (strict).
- **Component:** React Testing Library, jest-dom, axe-core.
- **E2E:** Playwright.
- **Coverage:** unit + component focused.

---

## 8) Testing in CI/CD

### Pipeline

1. Lint + typecheck.
2. Unit tests.
3. Component tests.
4. E2E smoke tests.

### Merge gates

- No static, unit, component, or e2e smoke failures.

---

## 9) Non-Goals & Trade-offs

### Not covered at MVP

- Full e2e coverage.
- Visual regression testing.
- Full browser/device matrix.
- Load testing.

### Accepted risks

- Minor visual regressions.
- Rare CMS edge cases.
- Late detection of performance regressions.

---

## 10) Future Testing Considerations

### With auth

- Session and access control e2e.
- Security-focused integration tests.

### With user data

- State migration and persistence testing.
- Conflict and partial-save scenarios.

### With GM Board

- Drag-and-drop and complex UI testing.
- Visual and advanced accessibility checks.
- Collaboration/concurrency scenarios.

---

**Positioning:** the MVP testing strategy prioritizes render stability, data correctness, i18n, and live-session user flows, relying on strong unit and component coverage with a minimal but reliable e2e smoke suite.
