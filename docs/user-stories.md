# Step 3: User Stories & Acceptance Criteria

## 1) Scope of User Stories

### User Roles

Within the MVP and the immediate post-MVP phase, the following roles are covered:

- **Player**  
  The primary target role. Uses the application during an active game session to quickly access rules, actions, conditions, and reference information.

- **GM / DM (Game Master / Dungeon Master)**  
  A secondary role. In MVP, support is partial and indirect (shared content), with an explicit foundation for expansion in V1 (notes, personalization, GM-oriented features).

### MVP Focus

- The core focus of the MVP is the **Player experience during live gameplay sessions**.
- All user stories are designed with the following constraints in mind:
    - fast access to information,
    - minimal interaction steps,
    - reliable mobile usability,
    - no server-side user state.

---

## 2) MVP User Stories

### A. Content Discovery

---

**US-01**  
**Title:** Browse content by category

**User Story:**  
As a *Player*, I want to browse content grouped by categories (Actions, Conditions, Rules, etc.), so that I can quickly find the type of information I need.

**Acceptance Criteria:**
- Given the user opens the home page  
  When they select a content category  
  Then a list of items belonging to that category is displayed.
- Given a category contains nested subcategories  
  When the user opens the category  
  Then the subcategories are clearly visible and navigable.
- Given a category contains no content  
  Then an empty state with explanatory text is displayed.
- Given the user refreshes the page  
  Then the selected category is correctly restored from the URL.

**Technical Notes:**
- Categories and hierarchy are sourced from the headless CMS.
- Navigation must be URL-driven (App Router).

---

**US-02**  
**Title:** Access content from the homepage

**User Story:**  
As a *Player*, I want to see the main sections and entry points on the homepage, so that I can immediately navigate to the relevant reference type.

**Acceptance Criteria:**
- Given the user opens the root URL  
  Then they see a list of main sections (categories).
- Given the user clicks a section  
  Then they are navigated to the corresponding category page.
- Given content is loading  
  Then a loading state is displayed until data is ready.

---

### B. Content Consumption

---

**US-03**  
**Title:** Read a content entry

**User Story:**  
As a *Player*, I want to open a specific entry (rule, condition, action), so that I can quickly read its description.

**Acceptance Criteria:**
- Given the user is on a content list page  
  When they select an item  
  Then a detailed content page is opened.
- Given the content is loading  
  Then a skeleton or loading indicator is displayed.
- Given the content is not found  
  Then a 404 page with a clear message is shown.
- Then the content is readable and usable on mobile devices.

**Technical Notes:**
- Content is rendered from CMS data using a typed schema.
- Pages should be statically optimized where applicable (SSG / ISR).

---

**US-04**  
**Title:** View structured rules content

**User Story:**  
As a *Player*, I want to see structured content (headings, lists, highlights), so that I can quickly scan rules during a session.

**Acceptance Criteria:**
- Given the content includes headings and lists  
  Then they are rendered correctly in the UI.
- Then visual hierarchy is preserved across screen sizes.
- Then long text does not break the layout.

---

### C. Search

---

**US-05**  
**Title:** Search content by keyword

**User Story:**  
As a *Player*, I want to search content by keywords, so that I can instantly find the rule or term I need.

**Acceptance Criteria:**
- Given the user enters a query into the search input  
  When they submit the search  
  Then a list of relevant results is displayed.
- Given the query returns no results  
  Then an empty state with a message is shown.
- Given the user switches language  
  Then search operates on content in the current locale.

**Technical Notes:**
- Client-side search over CMS data for MVP.
- Architecture should allow future server-side search.

---

**US-06**  
**Title:** Navigate to content from search results

**User Story:**  
As a *Player*, I want to open a content item directly from search results, so that I can minimize navigation steps.

**Acceptance Criteria:**
- Given search results are displayed  
  When the user selects an item  
  Then the corresponding content page is opened.
- Then the URL updates correctly.

---

### D. Internationalization

---

**US-07**  
**Title:** Switch application language

**User Story:**  
As a *Player*, I want to switch the application language (RU / EN), so that I can use the app in my preferred language.

**Acceptance Criteria:**
- Given the application is open  
  When the user switches language  
  Then both UI and content are displayed in the selected language.
- Then the selected language is reflected in the URL.
- Given content translation is missing  
  Then a fallback message is displayed.

**Technical Notes:**
- i18n is implemented via routing and CMS locales.

---

### E. Favorites (Local State)

---

**US-08**  
**Title:** Add content to favorites

**User Story:**  
As a *Player*, I want to add content to favorites, so that I can quickly return to frequently used rules during a session.

**Acceptance Criteria:**
- Given the user is on a content page  
  When they click “Add to favorites”  
  Then the item is stored locally as a favorite.
- Then the state persists after page reload.

**Technical Notes:**
- Use localStorage or IndexedDB.
- No server-side persistence in MVP.

---

**US-09**  
**Title:** View favorites list

**User Story:**  
As a *Player*, I want to view my list of favorite items, so that I can quickly open saved references.

**Acceptance Criteria:**
- Given the user has favorite items  
  When they open the Favorites section  
  Then a list of saved items is displayed.
- Given the list is empty  
  Then an empty state is shown.

---

### F. UX, Accessibility & Performance

---

**US-10**  
**Title:** Mobile-first experience

**User Story:**  
As a *Player*, I want the application to be comfortable to use on a phone, so that I can use it directly at the game table.

**Acceptance Criteria:**
- Then the UI adapts to mobile screen sizes.
- Then core flows are usable without horizontal scrolling.
- Then interactive elements have adequate touch targets.

---

**US-11**  
**Title:** Fast content loading

**User Story:**  
As a *Player*, I want content to load quickly, so that it does not interrupt gameplay.

**Acceptance Criteria:**
- Then pages reach a reasonable Time To Interactive (TTI).
- Then loading states are always shown when data is pending.
- Then there are no significant layout shifts during load.

---

### G. Error Handling & Edge Cases

---

**US-12**  
**Title:** Handle CMS and network errors

**User Story:**  
As a *Player*, I want to see clear error messages, so that I understand what went wrong if something fails.

**Acceptance Criteria:**
- Given the CMS is unavailable  
  Then an error state with a user-friendly message is displayed.
- Given a content fetch fails  
  Then the application does not crash.
- Then the error is minimally logged.

---

**US-13**  
**Title:** Graceful handling of missing content

**User Story:**  
As a *Player*, I want to see a clear message when content is missing or removed, so that I am not confused by broken pages.

**Acceptance Criteria:**
- Given content is not found  
  Then a 404 page is displayed.
- Then the user can easily return to navigation.

---

## 3) Post-MVP User Stories (V1 Preview)

- **US-V1-01:** As a user, I want to have an account, so that I can sync favorites across devices.
- **US-V1-02:** As a Player, I want to add personal notes to rules.
- **US-V1-03:** As a GM, I want to create my own session notes and references.
- **US-V1-04:** As a user, I want to manage my profile and language preferences.
- **US-V1-05:** As a GM, I want a dedicated GM-oriented section with quick access links.

---

## 4) Mapping to MVP Scope

| User Story ID | MVP Scope / Goal |
|--------------|------------------|
| US-01, US-02 | Content Discovery |
| US-03, US-04 | Content Consumption |
| US-05, US-06 | Search |
| US-07 | Internationalization |
| US-08, US-09 | Favorites |
| US-10, US-11 | UX & Performance |
| US-12, US-13 | Reliability & Error Handling |

---

## 5) Quality Expectations (applies to all stories)

The following requirements apply to all user stories without exception:

- Full i18n coverage (RU / ET / EN) for UI and messages.
- Explicit loading, empty, and error states.
- Responsive behavior and mobile usability.
- Strong type safety (TypeScript, CMS types).
- Basic accessibility (semantic markup, contrast, focus).
- Performance considerations (minimal payloads, caching, SSG / ISR where applicable).

---

This document reflects the current project assumptions and serves as a single source of truth for planning, implementation, and review of the MVP and V1.
