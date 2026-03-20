# Iteration 0 — Foundation & Setup

**Goal:** Establish a stable, consistent development foundation before any feature work begins. Every tool, config, and convention set here will apply to the entire project lifetime. Cutting corners in Iteration 0 creates friction in every subsequent iteration.

**Exit criteria:** `npm run dev` works, `npm run lint` and `npm run typecheck` pass with zero errors, CI runs on every push, and the directory structure is in place and ready to receive code.

---

## 1. TypeScript — Strict Mode

**Why:** The project commitment (ADR-0001, `mvp-scope.md`) is TypeScript strict. Setting this up now means all future code is written strictly from the start, avoiding a painful tightening pass later.

**Nuxt 4 note:** The root `tsconfig.json` contains only `references` to auto-generated configs in `.nuxt/`. Adding `compilerOptions` there directly has no effect under project references compilation. Strict mode must be set via `nuxt.config.ts` — Nuxt propagates it into `.nuxt/tsconfig.app.json` and siblings on the next `prepare` / `dev` run.

### What was done

- [x] Added `typescript: { strict: true }` to `nuxt.config.ts`:
  ```ts
  typescript: {
    strict: true,
  },
  ```
- [x] Added `typecheck` script to `package.json`:
  ```json
  "typecheck": "nuxt typecheck"
  ```

### Verify

```bash
npm run typecheck
```

Must pass with zero errors on the clean scaffold before proceeding.

---

## 2. ESLint

**Why:** Catches bugs and enforces Vue 3 / `<script setup>` conventions automatically. Much cheaper to enforce from commit 1 than to fix retroactively.

**Nuxt note:** `@nuxt/eslint` uses the modern flat config format. Running `nuxt prepare` (or `postinstall`) auto-generates `.nuxt/eslint.config.mjs` and creates the root `eslint.config.mjs` that extends it. No manual config bootstrap needed.

### What was done

- [x] Installed `@nuxt/eslint`:
  ```bash
  npm install -D @nuxt/eslint
  ```
- [x] Added to `nuxt.config.ts`:
  ```ts
  modules: ['@nuxt/eslint'],
  ```
- [x] Ran `nuxt prepare` — auto-generated `eslint.config.mjs` and `.nuxt/eslint.config.mjs`
- [x] Added baseline rules to `eslint.config.mjs`:
  ```js
  export default withNuxt({
    rules: {
      'vue/multi-word-component-names': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  })
  ```
- [x] Added scripts to `package.json`:
  ```json
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
  ```
- [x] `npm run lint` — passes with zero errors on the scaffold

---

## 3. Prettier

**Why:** Eliminates formatting debates and diff noise. Configured once, forgotten forever.

**Note on `prettier-plugin-vue`:** Prettier 3.x has built-in Vue SFC support via the native `vue` parser — no additional plugin is needed. `prettier-plugin-vue` caused a parse error (`Missing visitor keys for 'undefined'`) on Nuxt component tags in Prettier 3.8, so it was excluded.

### What was done

- [x] `prettier` and `prettier-plugin-vue` installed (plugin not used — see note above)
- [x] Created `.prettierrc`:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 100
  }
  ```
- [x] Created `.prettierignore`:
  ```
  node_modules
  .nuxt
  .output
  dist
  ```
- [x] Added scripts to `package.json`:
  ```json
  "format": "prettier --write .",
  "format:check": "prettier --check ."
  ```
- [x] `npm run format` — baseline applied, all files pass
- [x] `npm run format:check` — passes with zero errors

---

## 4. Husky + lint-staged (Pre-commit Gate)

**Why:** Prevents broken or unformatted code from ever entering the repository. Lint errors in CI are frustrating; lint errors that never reach CI are invisible.

### Tasks

- [x] Install:
  ```bash
  npm install -D husky lint-staged
  npx husky init
  ```
- [x] Configure `.husky/pre-commit` to run lint-staged:
  ```bash
  npx lint-staged
  ```
- [x] Add `lint-staged` config to `package.json`:
  ```json
  "lint-staged": {
    "*.{vue,ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
  ```
- [x] Make a test commit to confirm the hook fires and passes.

---

## 5. `nuxt.config.ts` — Baseline Configuration

**Why:** Establishes the project's Nuxt configuration skeleton. Modules, runtime config, and route rules added here will be extended by every future iteration — better to have the structure correct from the start.

### Tasks

- [x] Update `nuxt.config.ts` to the baseline structure:

  ```ts
  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    devtools: { enabled: true },

    modules: [
      '@nuxt/eslint',
      // '@nuxtjs/i18n',     -- Iteration 3
      // '@nuxtjs/storyblok', -- Iteration 1
      // '@pinia/nuxt',       -- when needed
    ],

    runtimeConfig: {
      storyblokToken: '', // set via .env: NUXT_STORYBLOK_TOKEN
      public: {
        storyblokVersion: 'published',
      },
    },

    typescript: {
      strict: true,
      // typeCheck is intentionally omitted — it runs the full TS compiler on
      // every dev/build cycle and significantly slows the dev server.
      // Type checking runs exclusively via `npm run typecheck` (nuxt typecheck)
      // as a separate CI step.
    },
  })
  ```

- [x] Create three env files:

  **`.env.example`** — committed, empty values, documents every required variable:
  ```
  NUXT_STORYBLOK_TOKEN=
  NUXT_PUBLIC_STORYBLOK_VERSION=published
  ```

  **`.env.demo`** — gitignored, local development environment with demo Storyblok space credentials:
  ```
  NUXT_STORYBLOK_TOKEN=<demo_space_token>
  NUXT_PUBLIC_STORYBLOK_VERSION=published
  ```

  **`.env`** — gitignored, production secrets. Never committed:
  ```
  NUXT_STORYBLOK_TOKEN=<real_production_token>
  NUXT_PUBLIC_STORYBLOK_VERSION=published
  ```

  > Only `.env.example` is committed. `.env` and `.env.demo` are gitignored (match `.env.*` in `.gitignore`).

---

## 6. Directory Structure

**Why:** Nuxt auto-imports and module resolution depend on directory conventions. Establishing the structure now means auto-imports work from day one and there is no ambiguity about where things go.

### Tasks

- [x] Create the following directories and placeholder files:

  ```
  app/                          # All UI source lives here (Nuxt 4 default)
    pages/
      index.vue                 # Root route — temporary placeholder
    layouts/
      default.vue               # Root layout shell
    components/
      .gitkeep
    composables/
      .gitkeep
    assets/
      css/
        main.css                # Global styles entry point
  server/                       # Nitro server — stays at root
    api/
      .gitkeep
  public/                       # Static files — stays at root
    .gitkeep
  ```

  > **Nuxt 4 convention:** application code lives under `app/` to clearly separate it from server code and config files. `server/` and `public/` remain at the project root — Nuxt scans them there by default.

- [x] `app/layouts/default.vue` — minimal shell:

  ```vue
  <template>
    <div>
      <slot />
    </div>
  </template>
  ```

- [x] `app/pages/index.vue` — temporary placeholder:

  ```vue
  <template>
    <main>
      <h1>Grimoire</h1>
    </main>
  </template>
  ```

- [x] `app/app.vue` — updated to use the layout system:
  ```vue
  <template>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </template>
  ```

---

## 7. `error.vue` — Global Error Page

**Why:** Without `error.vue`, Nuxt shows a raw error page. Setting a minimal one now means CMS failures and 404s during development already look intentional rather than broken.

### Tasks

- [x] Create `app/error.vue`:

---

## 8. CI Pipeline

**Why:** Automated checks on every push are the safety net that makes everything else trustworthy. The pipeline is simple in Iteration 0 but must be in place before any real code is written.

### Pipeline stages (in order)

1. **Typecheck** — `npm run typecheck`
2. **Lint** — `npm run lint`
3. **Format check** — `npm run format:check`
4. **Build** — `npm run build` (confirms the scaffold builds cleanly)

### Tasks

- [x] Create `.github/workflows/ci.yml`:

  ```yaml
  name: CI

  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]

  jobs:
    check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 24
            cache: 'npm'
        - run: npm ci
        - run: npm run typecheck
        - run: npm run lint
        - run: npm run format:check
        - run: npm run build
  ```

- [ ] Push to GitHub and confirm the workflow runs green.

> If not using GitHub Actions, adapt the stages above to your CI provider. The stage order and commands remain the same.

---

## 9. README — Getting Started Section

**Why:** The README already has a project overview. The setup instructions section at the top is currently the generic Nuxt scaffold content. Update it to reflect the actual project setup.

### Tasks

- [x] Update the top of `README.md` setup section to:
  - List the correct Node.js version requirement (>=24)
  - Reference `.env.example` for environment variables
  - Document the four key scripts: `dev`, `typecheck`, `lint`, `build`

---

## Completion Checklist

Before closing Iteration 0, all of the following must be true:

- [ ] `npm run typecheck` — passes with zero errors
- [ ] `npm run lint` — passes with zero errors
- [ ] `npm run format:check` — passes
- [ ] `npm run build` — succeeds
- [ ] `npm run dev` — app loads at `http://localhost:3000`
- [ ] Pre-commit hook fires on `git commit`
- [ ] CI pipeline is green on `main`
- [ ] `.env.example` is committed, `.env` is gitignored
- [ ] Directory structure matches section 6
- [ ] `app/error.vue` exists
- [ ] `app.vue` uses `<NuxtLayout>` + `<NuxtPage>`

---

## What Is Explicitly Out of Scope for Iteration 0

- Storyblok integration — Iteration 1
- i18n setup — Iteration 3
- Any content, real pages, or UI components
- Pinia / state management
- Deployment configuration
- Visual design or styling beyond the CSS entry point file
