# Two Presentation Layers Implementation Plan: Desktop & Mobile

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement two dedicated presentation layers within the Class 4 Catechism application: an untampered, widescreen DesktopLayout and an independently designed, native-app MobileLayout with shared business logic/data, automatic viewport selection, and an interactive desktop Mobile Preview simulator.

**Architecture:** 
- Separate presentation layers: `#desktop-layout-root` (existing full desktop design) and `#mobile-layout-root` (dedicated mobile app design).
- Shared core: Data modules (`chaptersData.js`, `examPapersData.js`, `knowledgeGraph.js`), state (`starsCount`, `activeChapter`, `activePaperId`), audio services (`VoiceoverManager`, `SoundEffects`), and quiz/exam solvers.
- Presentation Selector (`LayoutSelector.js`): Viewport listener (`matchMedia('(max-width: 768px)')`) that activates the appropriate layout automatically while supporting desktop window resizing and device orientation changes.
- Mobile Preview Controller: Desktop control to preview the real mobile interface inside a smartphone viewport frame with standard device widths (320px, 375px, 390px, 430px) without breaking the actual layout.

**Tech Stack:** Vanilla JavaScript (ES modules), HTML5 semantic templates, Vanilla CSS (CSS variables, glassmorphism, mobile safe areas), Node test runner.

**Spec:** User request: "implement two dedicated presentation layers within the same application: one for desktop and one for mobile... preserve existing desktop layout... design specifically for small screens... test across 320px, 360px, 375px, 390px, 430px, 768px, 1024px, 1440px".

## Global Constraints
- Desktop layout must remain 100% intact visually and functionally on screens > 768px.
- Mobile layout must be independently structured for touchscreens: compact 54px header, fixed 5-item bottom nav, full-width touch-friendly cards (min height ≥ 48px), scroll-safe interactions.
- No backend/data duplication: all 15 chapters, 5 exam papers, star counts, audio players, and quiz logic are shared directly.
- Testing across all 8 specified viewports (320x640, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1440x900).

## Review Focus
1. Viewport Selection without DOM duplication conflicts: Ensure shared event listeners (audio, stars, chapter switching) bind cleanly without duplicate handler execution.
2. State synchronization: Switching views or answering quizzes in mobile view immediately reflects in shared state (e.g. stars collected).
3. 3D WebGL non-blocking on mobile: Mobile layout provides an accessible Chapter Card Deck and safe 3D preview that never captures vertical page scroll gestures.
4. Mobile Preview Modal isolation: On desktop, "Preview Mobile Layout" renders inside a sandboxed viewport frame without affecting the real browser window.
5. All 56 automated tests pass with zero regressions.

---

### Task 1: Presentation Layer Architecture Setup & Test Harness

**Files:**
- Create: `src/presentation/LayoutSelector.js`
- Create: `tests/presentationLayer.test.js`
- Modify: `index.html`

- [x] **Step 1: Write failing test in `tests/presentationLayer.test.js` for presentation layer isolation and auto-selection**
- [x] **Step 2: Run test to verify it fails (RED)**
- [x] **Step 3: Implement `src/presentation/LayoutSelector.js` with viewport detection (`<= 768px`), resize listener, and state sync**
- [x] **Step 4: Update `index.html` to establish `#desktop-layout-root` and `#mobile-layout-root` boundaries**
- [x] **Step 5: Run test to verify it passes (GREEN)**
- [x] **Step 6: Commit changes**

---

### Task 2: Build the Dedicated Mobile Presentation Layer (`MobileLayout`)

**Files:**
- Create: `src/presentation/MobilePresentation.js`
- Create: `src/styles/mobile.css`
- Modify: `index.html`
- Test: `tests/mobilePresentation.test.js`

- [x] **Step 1: Write failing test in `tests/mobilePresentation.test.js` validating dedicated mobile views**
- [x] **Step 2: Run test to verify it fails (RED)**
- [x] **Step 3: Implement `MobilePresentation.js` providing dedicated mobile views: Mobile Map & Chapter Deck, Mobile Slides Viewer, Mobile Story Classroom, Mobile Exam Accordion, and Mobile Quiz**
- [x] **Step 4: Create `src/styles/mobile.css` with mobile-first typography, touch targets (≥ 48px), and bottom navigation**
- [x] **Step 5: Run test to verify it passes (GREEN)**
- [x] **Step 6: Commit changes**

---

### Task 3: Preserve & Restore Full Desktop Presentation Layer (`DesktopLayout`)

**Files:**
- Create: `src/presentation/DesktopPresentation.js`
- Modify: `src/styles/main.css`
- Test: `tests/desktopPresentation.test.js`

- [x] **Step 1: Write test verifying desktop widescreen elements (3D universe grid, top tabs, widescreen slide deck) are preserved**
- [x] **Step 2: Run test to verify it fails or validates baseline (RED)**
- [x] **Step 3: Implement `DesktopPresentation.js` cleanly isolating desktop rendering from mobile overrides**
- [x] **Step 4: Run test to verify desktop presentation passes (GREEN)**
- [x] **Step 5: Commit changes**

---

### Task 4: Implement Desktop "Preview Mobile Layout" Simulator Frame

**Files:**
- Modify: `src/presentation/LayoutSelector.js`
- Modify: `index.html`
- Modify: `src/styles/main.css`
- Test: `tests/mobilePreviewToggle.test.js`

- [x] **Step 1: Write failing test for mobile preview modal with width presets (320px, 375px, 390px, 430px)**
- [x] **Step 2: Run test to verify it fails (RED)**
- [x] **Step 3: Implement Mobile Preview Modal with device frame silhouette, width selector buttons, and "Exit Preview" button**
- [x] **Step 4: Run test to verify it passes (GREEN)**
- [x] **Step 5: Commit changes**

---

### Task 5: Multi-Viewport Automated Validation Across All 8 Viewports

**Files:**
- Create: `tests/multiViewportVerification.test.js`
- Run: `node --test tests/*.test.js`

- [x] **Step 1: Write multi-viewport verification test covering 320x640, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1440x900**
- [x] **Step 2: Run tests and verify all pass (GREEN)**
- [ ] **Step 3: Push to GitHub and deploy to Vercel production**
- [ ] **Step 4: Verify production deployment live**
