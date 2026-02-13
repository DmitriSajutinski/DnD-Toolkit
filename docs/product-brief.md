# Executive Summary

This project is a reference web application for Dungeons & Dragons players, designed to provide fast access to rules, actions, conditions, and in-game references during a session. The product focuses on speed, usability, and multilingual support (RU/EN), reducing cognitive load for both players and game masters. The project also serves as a demonstration of engineering maturity, including architecture, delivery quality, internationalization (i18n), testing, and deployment.

---

# Problem Statement

During live and online D&D sessions, players and the game master frequently need to quickly look up rules and clarifications. Existing solutions (PDF books, bookmarks, fragmented websites) are slow, overloaded, and poorly suited for “in-the-moment” use. This leads to pauses in gameplay, loss of pacing, and participant frustration—especially during tense or combat-heavy scenes.

---

# Target Audience & Personas

## Persona 1: Player

### Usage Context

- During combat and social scenes in a session (online or offline)
- On a mobile phone or laptop

### Tasks

- Quickly check available actions, conditions, and effects
- Clarify mechanics without interrupting the game
- Understand rules in their native language

### Pain Points

- Slow searches through PDFs or websites
- Complex wording and lack of localization
- Loss of group time due to pauses

### Expectations

- Instant search and navigation
- Short, well-structured descriptions
- Full mobile support

---

## Persona 2: DM / GM (Dungeon Master / Game Master)

### Usage Context

- Session preparation and real-time game management
- Simultaneous use of multiple information sources

### Tasks

- Quickly verify rules and edge cases
- Maintain game pace
- Show references to players when needed

### Pain Points

- Overloaded information sources
- Lack of a single, fast, reliable tool
- Difficulty working with materials on the fly

### Expectations

- A dependable reference without unnecessary content
- Fast access to core rules
- Potential for expansion (notes, boards, tools)

---

# Value Proposition

## Product Value

- Fast access to D&D rules optimized for in-game usage
- Multilingual support (RU/ET/EN) with a single source of truth
- Structured, concise content without unnecessary verbosity
- Responsive design for mobile devices and tablets
- Clear information architecture aligned with gameplay scenarios

## Why It’s Better Than PDFs / Bookmarks / Websites

- Significantly faster navigation and search
- Content tailored for “in-game” reference rather than long-form reading
- No cluttered UI or advertising
- Consistent terminology and localization

---

# Success Metrics (MVP)

- **Time-to-Information:** average time to find a rule < 5 seconds
  - _Measurement:_ manual tests, user scenarios

- **Search Success Rate:** ≥ 90% successful searches on the first query
  - _Measurement:_ search analytics

- **Session Usage:** application used in at least one full game session
  - _Measurement:_ self-reporting, logging

- **Mobile Usability Score:** no critical UX issues on mobile
  - _Measurement:_ Lighthouse, manual testing

- **i18n Coverage:** 100% of UI and content available in RU and EN
  - _Measurement:_ automated checks

- **Stability:** no runtime errors in production
  - _Measurement:_ error logging

- **Documentation Completeness:** README and product documentation available
  - _Measurement:_ checklist review

# MVP Definition

The MVP is a reference web application with a core set of D&D rules, optimized for fast lookup and use during a game session. It includes a multilingual interface (RU/EN), full-text search, category-based navigation (actions, conditions, mechanics), responsive design, and basic caching.  
Must-haves for release: stability, performance, readability, correct i18n, and clear documentation.

---

# Short Elevator Pitch

A D&D reference web app that enables players and game masters to instantly find rules during a session—without PDFs or overloaded websites—focused on speed, internationalization, and engineering quality.
