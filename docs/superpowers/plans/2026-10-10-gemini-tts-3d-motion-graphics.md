# Google AI Studio Gemini TTS, 4K Pixar Art & 3D Motion Graphics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the classroom application with natural human-sounding Malayalam voice via Google AI Studio Gemini TTS, a client-configurable Gemini API Key management modal, and a 3D Pixar/DreamWorks motion graphics engine featuring interactive 3D card tilt, Ken Burns cinematic camera motion, and glowing particle shaders.

**Architecture:**
1. A modular `GeminiAIService` handles Google AI Studio Gemini API calls (multimodal audio synthesis, Imagen 3 4K generation, and secure local storage of the user's API key).
2. An interactive `MotionGraphicsEngine` injects real-time 3D tilt perspective, WebGL floating golden particle shaders, and Ken Burns camera pan/zoom into chapter slide picture cards.
3. The `VoiceoverManager` connects to `GeminiAIService` to stream natural neural Malayalam audio when a key is present, with enhanced rate/pitch modulation fallback when offline.
4. An in-app "🔑 Gemini AI Studio" modal in the header allows the user to paste their API key at any time, which activates natural voice and on-demand 4K AI art generation across all 15 chapters.

**Tech Stack:** JavaScript (ES6 Modules), Google AI Studio Gemini REST API (`gemini-2.0-flash`, `imagen-3.0-generate-002`, Google Cloud TTS endpoint), WebGL / HTML5 Canvas particle systems, CSS 3D transforms (`perspective`, `rotate3d`).

---

## Tasks

### Task 1: Gemini AI Service & API Key Architecture
**Files:**
- Create: `src/services/GeminiAIService.js`
- Test: `tests/geminiAIService.test.js`

- [ ] **Step 1: Write failing test in `tests/geminiAIService.test.js`**
- [ ] **Step 2: Run test to verify RED state**
- [ ] **Step 3: Implement `GeminiAIService.js`**
- [ ] **Step 4: Run test to verify GREEN state**

### Task 2: 3D Pixar Motion Graphics Engine
**Files:**
- Create: `src/components/MotionGraphicsEngine.js`
- Modify: `src/styles/main.css`
- Test: `tests/motionGraphics.test.js`

- [ ] **Step 1: Write failing test in `tests/motionGraphics.test.js`**
- [ ] **Step 2: Run test to verify RED state**
- [ ] **Step 3: Implement `MotionGraphicsEngine.js` & CSS**
- [ ] **Step 4: Run test to verify GREEN state**

### Task 3: In-App Gemini API Key Header Modal & VoiceoverManager Upgrade
**Files:**
- Modify: `index.html`
- Modify: `src/components/VoiceoverManager.js`
- Modify: `src/components/SlideDeck.js`
- Modify: `src/app.js`

- [ ] **Step 1: Add Gemini API Key Modal to `index.html`**
- [ ] **Step 2: Update `VoiceoverManager.js`**
- [ ] **Step 3: Update `SlideDeck.js`**
- [ ] **Step 4: Run complete test suite (`node --test tests/*.test.js`)**

### Task 4: Full System Verification
- [ ] Verify HTTP server responses.
- [ ] Run complete 23+ unit tests.
