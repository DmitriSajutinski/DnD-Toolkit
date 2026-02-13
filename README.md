# DnD Reference Hub

A production-oriented pet project built as a fast, reliable reference tool for Dungeons & Dragons players during live game sessions.

---

## 1. Project Overview

**DnD Reference Hub** is a web-based reference application designed to provide fast and clear access to Dungeons & Dragons rules and supporting materials during live gameplay.

The core problem it addresses is friction during sessions: players frequently need to look up exact rule wording, actions, conditions, or clarifications without breaking the flow of the game. The application prioritizes speed, clarity, and predictable navigation over feature breadth.

The product is explicitly **player-first**. Game Master (GM)–specific functionality is planned for later phases and is intentionally excluded from the current MVP scope.

---

## 2. Key Features (MVP)

- Structured browsing of DnD reference content
- Clear category-based navigation
- Fast access to commonly used rules during sessions
- Multilingual support (RU / ET / EN)
- Content managed via a headless CMS
- Responsive UI for desktop and mobile devices

---

## 3. Tech Stack

- **Next.js (App Router)**  
  Application framework providing routing, rendering, and server-first architecture.

- **TypeScript (strict)**  
  Ensures type safety and reduces runtime errors.

- **Storyblok (Headless CMS)**  
  Centralized content management, decoupled from the application.

- **i18n (RU / ET / EN)**  
  Multilingual support for both UI and content.

- **Testing (unit + e2e)**  
  Validation of business logic and critical user flows.

- **CI/CD**  
  Automated checks, builds, and quality gates.

---

## 4. Architecture & Design Decisions

The project follows a production-grade architectural approach focused on scalability, maintainability, and explicit decision-making.

Key principles:

- Server-first rendering using Next.js App Router
- Full separation of content and application logic via a headless CMS
- Minimal user state in MVP, with no server-side persistence
- All non-trivial technical decisions are documented and traceable

Relevant documentation:

- **Architecture Overview**: `docs/architecture-overview.md`
- **Architecture Decision Records (ADR)**: `docs/adr/`

---

## 5. Project Structure

High-level repository layout:

- /app # Next.js App Router (routes, layouts, pages)
- /components # Reusable UI components
- /features # Feature-oriented modules (domain-driven grouping)
- /lib # Utilities, clients, shared logic
- /content # Content models and schemas
- /docs # Project documentation
- /tests # Unit and E2E tests
- /public # Static assets

The structure is designed for clarity, predictable ownership, and long-term scalability.

---

## 6. Getting Started (Local Development)

### Requirements

- Node.js >= 24
- npm

### Environment Variables

Create a `.env.local` file:

### Run the Project

npm install
npm run dev

## 7. Quality & Engineering Practices

- **Type Safety**  
  Strict TypeScript configuration, no implicit `any`.

- **Testing Strategy**
  - Unit tests for core business logic
  - End-to-end tests for critical user scenarios

- **Linting & Formatting**  
  Enforced, consistent code style across the codebase.

- **CI Pipeline**
  - Type checking
  - Linting
  - Automated tests
  - Pull request quality gates

---

## 8. Documentation

All documentation is stored in the `/docs` directory:

- `docs/product-brief` — product vision, scope, user stories
- `docs/architecture-overview` — architecture documentation and ADRs

---

## 9. Roadmap

Current status: **MVP under active development**.

Development principles:

- Iterative, incremental delivery
- MVP-first mindset
- Every significant change is documented and justified

Roadmap document: `docs/roadmap.md`

---

## 10. Content & Legal Notes

This project uses Dungeons & Dragons–related reference information for non-commercial and educational purposes only. Content is processed and presented with respect for applicable legal usage guidelines and without claiming ownership of original materials.

---

## 11. License

License information will be added later.
