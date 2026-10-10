# Implementation Plan: Kid-Friendly Overhaul, 3D Interactive Drawer, Quiz Fix & Enhanced Audio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the application into a "Magical Learning Adventure" specifically crafted for 6-year-old learners: fix the broken quiz engine with positive encouragement and star rewards, implement an interactive 3D side-drawer modal with instant node navigation and audio playback, enhance Web Speech API and Web Audio SFX (chimes, sparkles, cheer), and revamp the UI/UX with large rounded buttons, vibrant balanced colors, and calm reading views.

**Architecture:**
1. **Audio & SFX Engine (`src/components/SoundEffects.js` & `VoiceoverManager.js`):** Web Audio API synthesizer for instant musical feedback (chime, sparkle, cheer, pop) + resilient Web Speech API manager with voice preloading, speech cancellation recovery, and character pitch mapping.
2. **Interactive 3D Side-Drawer (`src/components/ThreeUniverse.js` & `app.js`):** Responsive slide-out adventure card on the 3D canvas displaying node details, audio narration button, and "Jump to Full Lesson" CTA.
3. **Robust Kid-Friendly Quiz Engine (`src/components/QuizEngine.js` & `src/data/quizQuestionsData.js`):** Dedicated pool of 20+ kid-friendly multiple choice questions with large pictographic buttons, no negative penalties, confetti animations, and star rewards.
4. **Magical Learning Adventure UI/UX (`src/styles/themes.css` & `src/styles/main.css`):** Soft vibrant palette, bubbly 48px+ touch targets, animated mascot avatars (Leo, Bella, Sammy), calm reading cards with clean spacing, and star counters.

---

### Task 1: Web Audio SFX & Voiceover Resilience
**Files:**
- Create: `src/components/SoundEffects.js`
- Modify: `src/components/VoiceoverManager.js`
- Test: `tests/audioAndSfx.test.js`

- [ ] **Step 1: Write test for SoundEffects synthesis and VoiceoverManager queue**
- [ ] **Step 2: Implement `SoundEffects.js` using Web Audio API (chime, sparkle, pop, cheer)**
- [ ] **Step 3: Update `VoiceoverManager.js` with browser voice preloading, resume/cancel deadlock fixes, and character voice presets**
- [ ] **Step 4: Run test to verify pass**

---

### Task 2: Dedicated Kid-Friendly Quiz Data & Engine Fix
**Files:**
- Create: `src/data/quizQuestionsData.js`
- Modify: `src/components/QuizEngine.js`
- Test: `tests/quizEngineFixed.test.js`

- [ ] **Step 1: Write test for kid-friendly quiz dataset and QuizEngine event-driven answering**
- [ ] **Step 2: Create `src/data/quizQuestionsData.js` with verified questions, choices, emojis, and positive feedback**
- [ ] **Step 3: Refactor `src/components/QuizEngine.js` to render large bubbly buttons and positive reinforcement**
- [ ] **Step 4: Run test to verify pass**

---

### Task 3: 3D Knowledge Universe Interactive Side-Drawer & Node Click Navigation
**Files:**
- Modify: `src/components/ThreeUniverse.js`
- Modify: `src/app.js`
- Modify: `index.html`
- Test: `tests/threeUniverseDrawer.test.js`

- [ ] **Step 1: Write test for drawer data resolution for all node categories (chapters, sacraments, exams, agents)**
- [ ] **Step 2: Implement 3D side-drawer UI with node summary, audio read button, and "Jump to Lesson" navigation**
- [ ] **Step 3: Add smooth camera framing towards the selected node in `ThreeUniverse.js`**
- [ ] **Step 4: Run test to verify pass**

---

### Task 4: Magical Learning Adventure UI/UX Redesign
**Files:**
- Modify: `src/styles/themes.css`
- Modify: `src/styles/main.css`
- Modify: `index.html`
- Modify: `src/components/StoryClassroom.js`
- Modify: `src/components/SlideDeck.js`

- [ ] **Step 1: Update design tokens with kid-friendly adventure colors (sunshine gold, ocean azure, meadow green, coral rose) and soft rounded cards**
- [ ] **Step 2: Style large touch targets (min 48px height), calm reading cards with generous line height and clean typography**
- [ ] **Step 3: Add animated mascot dialog bubbles, star reward counters, and positive feedback banners**
- [ ] **Step 4: Update `index.html` with simplified kid-friendly tab labels and side-drawer markup**

---

### Task 5: Integration, End-to-End Verification & Server Refresh
- [ ] **Step 1: Run complete automated test suite**
- [ ] **Step 2: Verify HTTP server response on port 8080**
- [ ] **Step 3: Verify all user workflows (quiz, 3D drawer, audio voiceover & SFX, kid UI) in browser**
