# Multi-Agent Interactive Classroom & Exam Solver Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an ultra-premium, interactive 3D/HD/4K web application and presentation suite that embodies the Multi-Agent architecture from `multi agent.pdf` (Galileo.ai) to teach Class 4 Catechism Chapters 1–15 with a 5-year-old storytelling approach, solve all questions across the last 5 exam papers (2023–2025) with citations, and provide real-time agent simulations, voiceover narration, 3D WebGL knowledge graphs, and interactive quizzes in dark and light themes.

**Architecture:** A modular client-side web application incorporating:
1. **Multi-Agent Engine (Galileo-inspired):** An Orchestrator that coordinates 6 specialized agents (Storyteller, Pedagogy/5yo Tutor, Exam Solver & Citation Engine, Quizmaster, Knowledge Graph Cartographer, Voiceover Synthesizer).
2. **Interactive 3D / WebGL Canvas:** Three.js-powered real-time 3D knowledge universe and agent communication nexus with particle simulations and orbit controls.
3. **Storytelling Classroom & Slide Deck:** Multi-chapter interactive lessons (Chapters 1–15) designed for 5-year-olds with kid-friendly metaphors, illustrated themes, and dual-mode slides.
4. **Comprehensive Exam Solver:** Complete, verified solutions for all 5 uploaded question papers (2023 Sem 1, 2023 Sem 2, 2024 Sem 1, 2025 Sem 1, 2025 Sem 2) cross-referenced to textbook chapters, pages, and bible verses.
5. **Interactive Quiz & Knowledge Graph:** Live interactive testing engine with celebratory animations, and a graph connecting sacraments, chapters, and exam concepts.
6. **Voiceover & Theming System:** Web Speech API integration with voice avatar pitch/rate controls and light/dark mode CSS tokens.

**Tech Stack:** HTML5, Modern Vanilla CSS (Tokens, Glassmorphism, 4K/Retina Responsive), Modern ES6+ JavaScript, Three.js (via CDN/bundle for 3D), Canvas API (motion graphics & soundwave visualizer), Web Speech API.

**Spec:** User request: Multi-agent principles from `multi  agent.pdf`, Chapters 1–15 solutions with citations for 5 question papers (2023–2025), HTML slides, real-time demo, 3D, motion graphics, voiceover, light/dark themes, 5-year-old storytelling, quiz, and knowledge graph.

## Global Constraints
- Single-page application and companion presentation that run directly in modern browsers without complex server setup.
- Dual language support (Malayalam original terms + English explanations and transliterations) so young learners and teachers can easily follow.
- Strict WCAG accessibility compliance (high contrast in both dark and light modes, keyboard navigation, aria labels).
- Zero broken external dependencies; self-contained fallbacks for 3D WebGL and speech synthesis.

## Review Focus
1. **Question Paper Accuracy:** Are all questions from all 5 papers (2023 S1, 2023 S2, 2024 S1, 2025 S1, 2025 S2) accurately extracted and solved with explicit citations to Chapters 1–15?
2. **5-Year-Old Pedagogical Adaptation:** Are all 15 chapters translated into charming, engaging stories with clear analogies (e.g. Jesus the Vine, baptismal rebirth, repentance, bread of life)?
3. **Multi-Agent Fidelity:** Does the system clearly implement and visualize Galileo's multi-agent patterns (Orchestrator, context passing, state management, worker agents)?
4. **Interactive 3D & Motion Graphics:** Does the 3D knowledge graph render smoothly at 60 FPS in 4K/HD with camera controls and interactive nodes?
5. **Theme & Audio Accessibility:** Does theme switching work flawlessly across all views, and does speech synthesis read stories and quiz feedback aloud smoothly?

---

### Task 1: Data Extraction and Corpus Structuring
**Files:**
- Create: `src/data/chaptersData.js`
- Create: `src/data/examPapersData.js`
- Create: `src/data/knowledgeGraphData.js`
- Test: `tests/dataIntegrity.test.js`

**Interfaces:**
- Consumes: Raw text and images from workspace PDFs (`chapter1-15.pdf`, 5 question papers, `multi agent.pdf`).
- Produces: `CHAPTERS_DATA` (15 chapters with storytelling notes, ELI5 summaries, biblical verses, key definitions), `EXAM_PAPERS_DATA` (5 papers with 100+ questions, verified answers, chapter citations), `GRAPH_DATA` (nodes and edges connecting chapters, sacraments, concepts).

- [ ] **Step 1: Write test for data integrity**
Create `tests/dataIntegrity.test.js` verifying that `CHAPTERS_DATA` contains exactly 15 chapters and all 5 exam papers have structured questions with citations.
- [ ] **Step 2: Run test to verify it fails**
Run Node test runner to confirm modules do not exist yet.
- [ ] **Step 3: Extract and generate `src/data/chaptersData.js`**
Construct structured dataset for all 15 chapters with Malayalam titles, English translations, 5-year-old fairy tale stories, Bible citations, and doctrinal keys.
- [ ] **Step 4: Extract and generate `src/data/examPapersData.js`**
Construct structured dataset for the 5 question papers (2023 S1, 2023 S2, 2024 S1, 2025 S1, 2025 S2) with verbatim Malayalam questions, transliteration, English explanation, verified correct answer, and citation to Chapter & Page.
- [ ] **Step 5: Extract and generate `src/data/knowledgeGraphData.js`**
Construct nodes (Sacraments, Chapters 1–15, Virtues, Biblical figures) and relations (Initiation, Healing, Service, Communion).
- [ ] **Step 6: Run test to verify pass**
Run Node test to confirm datasets load cleanly and validate all schema checks.

---

### Task 2: Multi-Agent System Core Architecture
**Files:**
- Create: `src/agents/orchestrator.js`
- Create: `src/agents/specialists.js`
- Test: `tests/multiAgent.test.js`

**Interfaces:**
- Consumes: `CHAPTERS_DATA`, `EXAM_PAPERS_DATA`, Galileo multi-agent architectural patterns.
- Produces: `MultiAgentOrchestrator` class that routes user prompts to `StorytellerAgent`, `SolverAgent`, `QuizmasterAgent`, `KnowledgeAgent`, and `VoiceAgent`, maintaining shared context and preventing context poisoning.

- [ ] **Step 1: Write test for MultiAgentOrchestrator dispatch and context passing**
Verify message dispatching, state machine transitions, and worker output aggregation.
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `MultiAgentOrchestrator` and specialist agents**
Incorporate Galileo's principles: memory vs context separation, structured state updates, trace logs, and real-time event streaming for UI observation.
- [ ] **Step 4: Run test to verify pass**

---

### Task 3: 3D WebGL Universe & Motion Graphics Engine
**Files:**
- Create: `src/components/ThreeUniverse.js`
- Create: `src/components/MotionCanvas.js`
- Test: `tests/threeUniverse.test.js`

**Interfaces:**
- Consumes: `GRAPH_DATA`, Three.js library.
- Produces: Interactive 3D celestial knowledge graph with pulsing agent hubs, orbiting chapter nodes, dynamic particle streams, and node selection raycasting.

- [ ] **Step 1: Write headless test/mock verification for 3D universe structure**
- [ ] **Step 2: Implement `ThreeUniverse.js`**
Create Three.js scene with interactive 3D nodes (Orchestrator at center, 6 Agent satellites, 15 Chapter planets, 7 Sacrament stars), orbit controls, particle trails, and responsive resize handling.
- [ ] **Step 3: Implement `MotionCanvas.js`**
Create 2D HUD overlay with real-time waveform visualizer for voiceover, glowing connection lines, and motion graphic badges.
- [ ] **Step 4: Verify rendering and interaction handlers**

---

### Task 4: Interactive Slide Deck & 5-Year-Old Storytelling Classroom
**Files:**
- Create: `src/components/SlideDeck.js`
- Create: `src/components/StoryClassroom.js`
- Test: `tests/classroom.test.js`

**Interfaces:**
- Consumes: `CHAPTERS_DATA`, `MultiAgentOrchestrator`.
- Produces: Fullscreen slide presentation mode with keyboard controls (arrows, space, F for fullscreen), chapter selection, ELI5 visual cards, character dialog bubbles, and animated storyboards.

- [ ] **Step 1: Write unit tests for slide deck state and chapter progression**
- [ ] **Step 2: Implement `SlideDeck.js`**
Include 4K/HD responsive layout, slide progress bar, speaker notes, and presentation themes.
- [ ] **Step 3: Implement `StoryClassroom.js`**
Include interactive storytelling chapters with cute character guides (Leo the Cub, Bella the Dove, Sammy the Shepherd), interactive popups, and moral lessons.
- [ ] **Step 4: Verify slide deck and classroom logic**

---

### Task 5: 5 Question Papers Solver & Citation Engine
**Files:**
- Create: `src/components/ExamSolverView.js`
- Test: `tests/examSolver.test.js`

**Interfaces:**
- Consumes: `EXAM_PAPERS_DATA`, `CHAPTERS_DATA`.
- Produces: Interactive exam explorer allowing users to filter by year (2023, 2024, 2025), semester (1, 2), chapter (1–15), or question type (MCQ, Fill in blanks, Match, Short answer, Essay), with citation badges and "Explain to a 5-Year-Old" toggle.

- [ ] **Step 1: Write test for paper filtering and citation resolution**
- [ ] **Step 2: Implement `ExamSolverView.js`**
Render full question papers with verified answers, textbook page references, biblical references, and ELI5 explanations.
- [ ] **Step 3: Verify question solutions and citations display**

---

### Task 6: Interactive Quiz & Voiceover Audio Engine
**Files:**
- Create: `src/components/QuizEngine.js`
- Create: `src/components/VoiceoverManager.js`
- Test: `tests/quizAndVoice.test.js`

**Interfaces:**
- Consumes: Question data, Web Speech API.
- Produces: Gamified quiz with instant feedback, confetti, audio read-aloud, speed/pitch controls, and bilingual narration.

- [ ] **Step 1: Write test for quiz scoring logic and speech synthesis queue**
- [ ] **Step 2: Implement `QuizEngine.js`**
- [ ] **Step 3: Implement `VoiceoverManager.js`**
- [ ] **Step 4: Verify quiz feedback and voiceover triggers**

---

### Task 7: Premium UI Design System, Theming, and Main Master Application
**Files:**
- Create: `index.html`
- Create: `src/styles/main.css`
- Create: `src/styles/themes.css`
- Create: `src/app.js`

**Interfaces:**
- Consumes: All components, design tokens, responsive CSS.
- Produces: A unified, standalone, state-of-the-art Web Application combining the Multi-Agent live console, 3D universe, Slides, Exam Solver, Story Classroom, Quiz, and Knowledge Graph in dark and light modes.

- [ ] **Step 1: Implement `src/styles/themes.css` with dark/light variables, glassmorphism, 4K media queries**
- [ ] **Step 2: Implement `src/styles/main.css` with motion graphics keyframes and clean typography**
- [ ] **Step 3: Assemble `index.html` with semantic structure, navigation tabs, and accessibility attributes**
- [ ] **Step 4: Assemble `src/app.js` wiring up the entire system**
- [ ] **Step 5: End-to-end browser verification and polish**
