# Class 4 Catechism — Mobile Responsiveness and Full Feature Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore complete mobile responsiveness, bilingual audio narration (Malayalam and English), textbook scan toggling, touch-friendly 3D WebGL universe, and all interactive features across phones, tablets, laptops, and desktop viewports while preserving the existing desktop interface.

**Architecture:** 
- Dual presentation layer architecture (`#desktop-layout-root` and `#mobile-layout-root`) with shared data models, audio manager (`VoiceoverManager`), sound effects (`SoundEffects`), and quiz engine (`QuizEngine`).
- Viewport-aware layout manager (`LayoutSelector.js`) with CSS-first zero-flash media queries (`<= 768px` vs `> 768px`), live window resize & orientation change listeners, and desktop mobile preview simulator.
- Full bilingual audio integration: `window.app.playVoice(lang, chNum)` and `window.app.stopVoice()` mapping directly to pre-generated `assets/audio/ch{N}_mal.mp3` and `ch{N}_eng.mp3` with Web Speech fallback.
- Touch-optimized Three.js universe with pointer events, container resizing, and accessible mobile node details drawer.

**Tech Stack:** HTML5, CSS3 (CSS Variables, Glassmorphism, Media Queries), Vanilla JavaScript (ES Modules), Three.js WebGL, Web Audio API, Node test runner.

**Spec:** User prompt: "PROJECT: Class 4 Catechism — Mobile Responsiveness and Full Feature Restoration".

## Global Constraints
- Preserve existing tech stack (Vanilla JS, HTML5, CSS3, Three.js, Node.js).
- Desktop layout must remain 100% intact on screens > 768px.
- Mobile layout must adapt automatically to 320px, 360px, 375px, 390px, 430px, 768px, 1024px, 1440px.
- Bilingual voice narration (Malayalam & English) must work for all 15 chapters using actual files in `assets/audio/`.
- No broken image paths (use `ch.imageUrl` and `ch.textbookUrl` from `CHAPTERS_DATA`).
- All 56+ tests must pass with zero regressions.

## Review Focus
1. Bilingual Audio: Chapter audio buttons must play `assets/audio/ch{N}_mal.mp3` for Malayalam and `assets/audio/ch{N}_eng.mp3` for English without overlapping.
2. Image & Textbook Scans: Switching between 3D illustration and textbook scans works seamlessly on both mobile and desktop.
3. Three.js Touch Interaction: Rotating scene and tapping nodes on mobile works via pointer events, opening the mobile drawer with narration.
4. Auto Layout Selection: Directly loading page on mobile displays mobile layout without button click or toggle required.
5. All 15 chapters, 5 solved exam papers, and star quizzes work on mobile without errors.

---

### Task 1: Bilingual Audio Narration Architecture in `AppController` and `VoiceoverManager`

**Files:**
- Modify: `src/app.js`
- Modify: `src/components/VoiceoverManager.js`
- Test: `tests/bilingualAudio.test.js`

- [ ] **Step 1: Write failing test in `tests/bilingualAudio.test.js` verifying `playVoice('mal', chNum)`, `playVoice('eng', chNum)`, and `stopVoice()`**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Implement `playVoice(lang, chNumber)` and `stopVoice()` in `src/app.js` and ensure `VoiceoverManager` supports both audio tracks and error reporting**
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit changes**

---

### Task 2: Fix Mobile Presentation Cards, Image Paths, Textbook Scan Toggles, and Audio Controls

**Files:**
- Modify: `src/presentation/MobilePresentation.js`
- Modify: `src/styles/mobile.css`
- Test: `tests/mobileFeatureRestoration.test.js`

- [ ] **Step 1: Write failing test verifying mobile image paths, textbook scan toggle, dual audio buttons, and click handlers**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update `src/presentation/MobilePresentation.js`:**
  - Fix image sources to `ch.imageUrl`
  - Add illustration vs textbook scan toggle (`toggleSlideArtMode(chNum)`)
  - Fix `prevSlide()` logic (`activeChapter > 1`)
  - Fix chapter click handlers with quotes or number IDs
  - Fix scripture quote properties (`ch.scripture`, `ch.scriptureEng`)
  - Add bilingual audio buttons (`🔊 Malayalam` and `🔊 English`) to Chapter Deck, Slides, and Story Lessons
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit changes**

---

### Task 3: Mobile 3D Universe Optimization (Touch Pointer Events, Resizing, and Mobile Drawer)

**Files:**
- Modify: `src/components/ThreeUniverse.js`
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles/mobile.css`
- Test: `tests/threeUniverseMobile.test.js`

- [ ] **Step 1: Write failing test for ThreeUniverse pointer event support, resize method, and mobile drawer rendering**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update `ThreeUniverse.js` with pointer events (`pointerdown`, `pointermove`, `pointerup`), `resize(w, h)`, and `attachToContainer(container)`**
- [ ] **Step 4: Add `#mob-three-node-drawer` to `index.html` and update `openNodeDrawer` in `src/app.js` to populate the mobile drawer when mobile is active**
- [ ] **Step 5: Run test to verify it passes (GREEN)**
- [ ] **Step 6: Commit changes**

---

### Task 4: Zero-Flash Automatic Layout Selection & Mobile Theme Toggle

**Files:**
- Modify: `src/styles/mobile.css`
- Modify: `index.html`
- Modify: `src/presentation/LayoutSelector.js`
- Modify: `src/app.js`
- Test: `tests/autoLayoutSelection.test.js`

- [ ] **Step 1: Write failing test verifying zero-flash CSS media queries and header theme toggle on mobile**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Add CSS media queries in `mobile.css` for instant viewport adaptation and add `mob-btn-theme` to mobile header**
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit changes**

---

### Task 5: Complete Test Suite & Viewport Verification

**Files:**
- Run: `node --test tests/*.test.js`
- Verify viewports: 320x640, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1440x900
- Deploy to Vercel production and verify live HTTP response

- [ ] **Step 1: Run all tests and verify 100% pass rate**
- [ ] **Step 2: Commit and push changes to GitHub `origin/main`**
- [ ] **Step 3: Deploy to Vercel production**
- [ ] **Step 4: Verify production URL live**
