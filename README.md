# Grimo — DnD Grimoire / Reference Hub

A fast, reliable reference tool for Dungeons & Dragons players during live game sessions. Built as a production-oriented pet project demonstrating senior-level engineering practices.

> **Status:** MVP under active development · Iteration 0 (Foundation)

---

## What it is

**Grimoire** solves a specific problem: players frequently need to look up exact rule wording, actions, and conditions mid-session without breaking the flow of the game. The application prioritizes **speed, clarity, and predictable navigation** over feature breadth.

The MVP is **player-first**. GM-specific functionality is planned for later phases.

---

## Tech Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Framework | Nuxt 4 (Vue 3, SSR)                       |
| Language  | TypeScript (strict)                       |
| Server    | Nitro                                     |
| CMS       | Storyblok (headless)                      |
| i18n      | RU / ET / EN                              |
| Testing   | Vitest · Vue Testing Library · Playwright |
| CI        | GitHub Actions                            |

---

## Getting Started

### Requirements

- Node.js >= 24
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.demo .env
```

Fill in your credentials — see `.env.example` for all available variables.

### 3. Start development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start development server         |
| `npm run build`        | Build for production             |
| `npm run preview`      | Preview production build locally |
| `npm run typecheck`    | Run TypeScript type checking     |
| `npm run lint`         | Run ESLint                       |
| `npm run lint:fix`     | Run ESLint with auto-fix         |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |

---

## Project Structure

```
app/                    # All UI source (Nuxt 4 default)
  pages/                # File-based routes
  layouts/              # Application shell layouts
  components/           # Reusable UI components
  composables/          # Shared Vue composables (auto-imported)
  assets/               # CSS, fonts, images
  app.vue               # App entry point
  error.vue             # Global error page

server/                 # Nitro server
  api/                  # API route handlers

public/                 # Static files (served as-is)

docs/                   # Project documentation
  adr/                  # Architecture Decision Records
  iterations/           # Iteration plans and progress
```

---

## Documentation

| Document                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `docs/architecture-overview.md` | System architecture and key principles |
| `docs/adr/`                     | Architecture Decision Records          |
| `docs/mvp-scope.md`             | MVP scope and product goals            |
| `docs/roadmap.md`               | High-level product roadmap             |
| `docs/testing-strategy.md`      | Testing approach and tooling           |
| `docs/iterations/`              | Per-iteration implementation plans     |

---

## Roadmap

| Iteration                   | Goal                                   |
| --------------------------- | -------------------------------------- |
| **0 — Foundation**          | Tooling, CI, base structure (current)  |
| **1 — Content Core**        | Storyblok integration, reference pages |
| **2 — Navigation & Search** | Navigation system, full-text search    |
| **3 — i18n & Performance**  | RU/EN, caching, optimization           |
| **4 — Quality & Release**   | Tests, docs, public deployment         |

See `docs/roadmap.md` for details.

---

## Legal

This project uses Dungeons & Dragons–related reference information for non-commercial and educational purposes only. Content is presented with respect for applicable legal usage guidelines without claiming ownership of original materials.

---

## License

To be defined.
