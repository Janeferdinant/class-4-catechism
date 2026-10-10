# Settings Gear Icon & Dropdown/Pop-Up Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Overview
Transform the settings interface from a bottom sheet that collides with the mobile navigation bar into a sleek, top-anchored **dropdown/pop-up menu** originating directly from the gear icon (`⚙️`). Include tactile rotation on the gear icon, audio and speech controls (narration language, 0.85x speed, sound effects toggle), visual theme pills (Dark/Light), fullscreen mode, star reset, and mentorship attribution, while preserving all existing test bindings.

---

## File Structure & Responsibilities
- `index.html`: Update the `#mobile-settings-sheet` container into a top-anchored pop-up menu card with a top caret pointing to the gear icon, header with close icon, segmented controls for theme and audio, and mentorship credit.
- `src/styles/main.css`: Provide floating drop-down styles for `.mobile-settings-sheet`, `.sheet-card`, caret pointing up, active gear rotation animation, and responsive placement.
- `src/styles/mobile.css`: Ensure mobile presentation layer anchors the popup at `top: 58px; right: 10px; max-height: calc(100vh - 130px); overflow-y: auto; z-index: 100005;` completely avoiding the bottom navigation bar.
- `src/app.js`: Wire up dropdown toggle logic, gear rotation `.gear-active`, theme switching, speech speed adjustment, narration language preference, SFX mute/unmute, fullscreen toggle, star reset, and click-outside dismissal.
- `src/presentation/MobilePresentation.js`: Ensure mobile header gear icon `#mob-btn-menu` toggles the pop-up and rotates smoothly.
- `tests/mobileSettingsPopup.test.js`: Unit tests verifying dropdown positioning, gear rotation classes, and interactive setting handlers.

---

## Implementation Tasks

### Task 1: Create Unit Test for Settings Pop-Up Menu
- [ ] **Step 1:** Write `tests/mobileSettingsPopup.test.js` checking dropdown positioning, pop-up class structure, gear active state toggle, and audio preference persistence.
- [ ] **Step 2:** Run `node --test tests/mobileSettingsPopup.test.js` and verify initial failure/pass state.

### Task 2: Update HTML Structure for Settings Dropdown Pop-up
- [ ] **Step 1:** In `index.html`, restructure `#mobile-settings-sheet` into a floating dropdown pop-up menu with:
  - Top pointer caret (`.popup-caret`)
  - Compact header (`⚙️ Settings & Display` + circular close button)
  - Interactive Segmented Theme Toggle (`#sheet-theme-btn`)
  - Audio & Voice Preferences (Narration language, child-pace speed `0.85x`, SFX toggle)
  - Screen & Display (Fullscreen mode + View mode `#sheet-view-btn`)
  - Star Progress card (`⭐ Stars` + Reset option)
  - Mentorship credit (`Asst. Prof. Jane Rose`)
- [ ] **Step 2:** Ensure all required IDs (`#mobile-settings-sheet`, `#btn-mobile-menu`, `#sheet-theme-btn`, `#sheet-view-btn`) are preserved.

### Task 3: Style the Settings Dropdown Pop-Up in `main.css` & `mobile.css`
- [ ] **Step 1:** In `src/styles/main.css`, define floating dropdown styles:
  - `.mobile-settings-sheet`: overlay with transparent/soft backdrop.
  - `.sheet-card`: floating glass pop-up card anchored to the top-right under the gear icon with `@keyframes popIn` (scale & translate).
  - Top caret pointing to the gear button.
  - Touch-friendly segmented buttons and switches.
- [ ] **Step 2:** In `src/styles/mobile.css`, style `.gear-active` with `transform: rotate(90deg)` and golden glow. Ensure popup has `max-height: calc(100vh - 130px); overflow-y: auto;` leaving plenty of room above the bottom navigation bar.

### Task 4: Enhance Interactive Logic in `src/app.js` & `MobilePresentation.js`
- [ ] **Step 1:** In `src/app.js` (`setupMobileSettingsSheet`):
  - Toggle menu on clicking gear icon (open if closed, close if open).
  - Add/remove `.gear-active` on gear buttons (`#mob-btn-menu` and `#btn-mobile-menu`).
  - Wire theme segmented toggle with live active pill highlight.
  - Wire narration language toggle (Malayalam/English) and voice speed (0.85x / 1.0x).
  - Wire sound effects (SFX) toggle and fullscreen button.
  - Wire star reset with user confirmation.
- [ ] **Step 2:** In `src/presentation/MobilePresentation.js`, synchronize mobile header gear toggle.

### Task 5: Verification & Full Test Suite Execution
- [ ] **Step 1:** Run `node --test tests/mobileSettingsPopup.test.js`.
- [ ] **Step 2:** Run full test suite `npm test` (all 68+ tests must pass).
- [ ] **Step 3:** Commit changes, push to GitHub `origin main`, deploy to Vercel production, and verify.
