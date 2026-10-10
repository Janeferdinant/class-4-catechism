# Dedicated App-Like Mobile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated, ultra-premium app-like mobile experience with a clean 54px top bar, fixed thumb-friendly bottom navigation bar, touch-safe cards, and mobile settings sheet, while removing the obsolete Gemini key button and preserving 100% of desktop functionality.

**Architecture:** Implement a modern native-app architecture on mobile screens (≤ 768px and `.mobile-view-active`): a compact single-row top bar with branding and quick audio/settings icons; a fixed bottom navigation bar for view switching; touch-friendly thumb cards across all 5 views with scroll-safe 3D container; a slide-up settings sheet for theme and view toggles; with desktop layout remaining completely untouched.

**Tech Stack:** Vanilla JavaScript (ES modules), CSS3 (Flexbox/Grid, mobile safe-area insets, glassmorphism), HTML5 semantic markup, Node test runner.

**Spec:** User request to build a dedicated, app-like mobile layout with clean top bar, bottom navigation, thumb-friendly cards, removing the Gemini key button, and keeping all desktop features.

## Global Constraints
- Remove `#btn-gemini-key` from both desktop and mobile views.
- Mobile top bar must be compact (height ≤ 54px) and never consume large vertical screen space.
- Mobile bottom navigation bar must be thumb-friendly (min touch target ≥ 48px) and fixed at bottom on mobile screens.
- Desktop layout (> 768px when not in `.mobile-view-active`) must remain 100% intact and feature-complete.
- All 32 existing test suites must pass; new tests must verify mobile app layout components.

## Review Focus
1. Double-scroll / bottom clipping on mobile: Ensure `.main-content` has `padding-bottom: 84px` on mobile so fixed bottom nav never obscures content.
2. 3D WebGL gesture hijacking: Ensure 3D canvas does not prevent vertical page scrolling on touchscreens (`touch-action: pan-y`).
3. Audio synchronization: Ensure global audio stop button in top bar controls voiceover cleanly across all views.
4. Active view synchronization: Switching views via bottom nav must synchronize active state on both top tabs (if visible) and bottom nav buttons.
5. Desktop view toggle persistence: Preserving user view mode preference in `localStorage`.

---

### Task 1: Remove Obsolete Gemini API Key Button & Clean Up Header

**Files:**
- Modify: `index.html:70-85`
- Modify: `src/app.js:200-240`
- Modify: `src/styles/main.css`
- Test: `tests/mobileResponsive.test.js`

**Interfaces:**
- Consumes: Existing header structure in `index.html`.
- Produces: Cleaner header with Gemini button removed from DOM and logic.

- [ ] **Step 1: Write test verifying Gemini key button is removed and top bar has app layout**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Remove `#btn-gemini-key` from `index.html` and clean up `src/app.js`**
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit changes**

---

### Task 2: Build Compact App Top Bar & Fixed Bottom Navigation Bar

**Files:**
- Modify: `index.html:30-95`
- Modify: `src/styles/main.css`
- Modify: `src/app.js:150-195`
- Test: `tests/mobileAppNavigation.test.js`

**Interfaces:**
- Consumes: Navigation view switching (`switchView(viewName)`).
- Produces: `.mobile-top-bar` (54px), `.mobile-bottom-nav` (64px, 5 items), and `#mobile-menu-sheet` (slide-up settings).

- [ ] **Step 1: Write failing test in `tests/mobileAppNavigation.test.js` for bottom nav bar and mobile top bar**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Add `.mobile-bottom-nav` markup and mobile header in `index.html`**
- [ ] **Step 4: Add CSS styles in `src/styles/main.css` for fixed bottom nav and compact mobile top bar**
- [ ] **Step 5: Bind bottom nav buttons in `src/app.js` to `switchView(viewName)` with active indicator sync**
- [ ] **Step 6: Run test to verify it passes (GREEN)**
- [ ] **Step 7: Commit changes**

---

### Task 3: Implement Thumb-Friendly Mobile Cards & Scroll-Safe 3D Experience

**Files:**
- Modify: `src/styles/main.css`
- Modify: `src/components/ThreeUniverse.js`
- Test: `tests/mobileThumbCards.test.js`

**Interfaces:**
- Consumes: Chapter data, slide viewer, quiz engine, solver cards.
- Produces: Touch-safe, thumb-friendly cards with proper padding, readable typography, and non-blocking 3D touch interaction.

- [ ] **Step 1: Write failing test in `tests/mobileThumbCards.test.js` for touch targets and scroll-safety**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Add `touch-action: pan-y` and mobile touch gestures to Three.js canvas in `src/components/ThreeUniverse.js`**
- [ ] **Step 4: Add thumb-friendly card styles for Slides, Stories, Exam Q&A, and Quizzes in `src/styles/main.css`**
- [ ] **Step 5: Run test to verify it passes (GREEN)**
- [ ] **Step 6: Commit changes**

---

### Task 4: Add Mobile Settings Bottom Sheet (Theme, Desktop Mode & Attribution)

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles/main.css`
- Test: `tests/mobileSettingsSheet.test.js`

**Interfaces:**
- Consumes: Theme toggle, View mode toggle, Faculty attribution.
- Produces: Smooth slide-up bottom sheet opened via top bar `⚙️` button.

- [ ] **Step 1: Write failing test for mobile settings bottom sheet**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Implement bottom sheet modal in `index.html` and `src/app.js`**
- [ ] **Step 4: Style bottom sheet with glassmorphism slide-up animation in `src/styles/main.css`**
- [ ] **Step 5: Run test to verify it passes (GREEN)**
- [ ] **Step 6: Commit changes**

---

### Task 5: Full Regression Testing, Git Push & Production Vercel Deployment

**Files:**
- Run full test suite: `node --test tests/*.test.js`
- Deploy: Vercel production

- [ ] **Step 1: Run complete automated test suite (all tests must pass)**
- [ ] **Step 2: Push changes to GitHub `origin/main`**
- [ ] **Step 3: Deploy to Vercel production and verify HTTP 200**
