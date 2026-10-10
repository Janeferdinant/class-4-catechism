# Mobile Responsiveness & Multi-Device Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Class 4 Catechism into a fully responsive, mobile-first web interface that looks stunning and functions flawlessly on 320px, 375px, 390px, 430px smartphones, tablets, and desktop displays, while providing a dedicated Mobile/Desktop view toggle.

**Architecture:** Implement mobile-optimized media queries across breakpoints (1024px, 768px, 480px, 360px) in `src/styles/main.css`. Add a view mode toggle in `index.html` and `src/app.js` with `localStorage` persistence. Adjust typography, touch targets, container paddings, and card layouts without altering any desktop behaviors.

**Tech Stack:** Vanilla CSS3 (CSS Grid, Flexbox, Clamp, CSS Custom Properties), HTML5, ES6 Vanilla JS.

**Spec:** User prompt with 7 requirements: Responsive design across 320px–430px, eliminate overflow/clipping, improve readability, mobile-friendly touch navigation, Mobile View Toggle button, preserve all desktop functionality, and verification testing.

## Global Constraints
- Preserve 100% of desktop layout and functionality when on large screens.
- Touch targets must be >= 44x44px per WCAG / Mobile UI guidelines.
- Zero horizontal scrolling or element clipping on screens down to 320px width.
- All 28 existing test suites must continue to pass.

## Review Focus
1. Header navigation and utility actions do not overflow or cause horizontal scrollbars on 320px screens.
2. Malayalam headings scale smoothly without clipping or line overflow.
3. 3D Universe canvas maintains a defined aspect/height on mobile instead of collapsing.
4. Mobile view toggle seamlessly switches between auto/mobile and desktop layouts.
5. All buttons and interactive touch targets meet accessibility standards (>= 44px).

---

### Task 1: Add Mobile View Toggle in HTML and App Bootstrap
**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Test: `tests/mobileResponsive.test.js`

- [ ] **Step 1: Write failing test in `tests/mobileResponsive.test.js`**
- [ ] **Step 2: Add `#btn-mobile-toggle` button in `index.html`**
- [ ] **Step 3: Implement `toggleViewMode()` in `src/app.js` with persistence**
- [ ] **Step 4: Run tests to verify logic passes**

### Task 2: Implement Core Mobile Design System & Breakpoints in CSS
**Files:**
- Modify: `src/styles/main.css`

- [ ] **Step 1: Implement global responsive resets (`overflow-x: hidden`, scalable containers)**
- [ ] **Step 2: Optimize Header & Tab Navigation for mobile (<768px, <480px, <360px)**
- [ ] **Step 3: Optimize 3D Universe viewport, HUD, and slide-out drawer on mobile**
- [ ] **Step 4: Optimize Picture Slides, audio quickbars, and typography**
- [ ] **Step 5: Optimize Story Lessons, chapter pill strip, and action buttons**
- [ ] **Step 6: Optimize Exam Solver search bar, paper tabs, and answer cards**
- [ ] **Step 7: Optimize Gamified Star Quiz, bubbly buttons, and modals**
- [ ] **Step 8: Implement `.mobile-view-active` override rules for manual toggle**

### Task 3: Automated & Verification Testing
- [ ] **Step 1: Run `npm test` to verify all 29+ test suites pass**
- [ ] **Step 2: Deploy to Vercel and verify live production endpoints**
- [ ] **Step 3: Push commits to GitHub**
