# Multi-Agent Catechism Academy — Architecture Specification

## 1. System Overview
The **Multi-Agent Catechism Academy** is an interactive educational web platform built upon multi-agent collaboration principles. It transforms traditional grade-school religious curriculum into an engaging 3D multimedia experience tailored for young learners (ages 5–10).

```
                 ┌─────────────────────────────────┐
                 │       User / Student UI         │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │    Master Agent Orchestrator    │
                 │   (Routing, Intent, Context)   │
                 └──────┬─────────┬─────────┬──────┘
                        │         │         │
       ┌────────────────┘         │         └────────────────┐
       ▼                          ▼                          ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Storyteller  │          │ Exam Solver  │          │ 3D Visualizer│
│  Specialist  │          │  Specialist  │          │  Specialist  │
└──────────────┘          └──────────────┘          └──────────────┘
       │                          │                          │
       ▼                          ▼                          ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  Voiceover   │          │  Quiz Master │          │ Three.js     │
│  Specialist  │          │  Specialist  │          │ WebGL Canvas │
└──────────────┘          └──────────────┘          └──────────────┘
```

## 2. Agent Subsystems

### 2.1 Master Orchestrator (`src/agents/orchestrator.js`)
- Coordinates specialist agents based on active student goals (reading a story, solving past exam questions, exploring 3D universe, taking chapter quiz).
- Maintains shared session state, active chapter index, language selection, and theme preferences.

### 2.2 Storyteller & Pedagogy Specialist (`src/agents/specialists.js`)
- Formulates child-friendly metaphors, bedtime-style narratives, and moral lessons for 5-year-old comprehension.
- Maintains dual English and Malayalam localized content.

### 2.3 Theological Exam Solver Specialist (`src/components/ExamSolverView.js`)
- Ingests past semester exam questions from 2023 to 2025.
- Maps each question to specific chapter numbers, topics, and canonical textbook citations.
- Formulates both concise student answers and in-depth pedagogical explanations.

### 2.4 3D Universe Specialist (`src/components/ThreeUniverse.js`, `MotionGraphicsEngine.js`)
- Renders an interactive 3D WebGL cosmos of interconnected theological knowledge nodes (Chapters, Sacraments, Exams).
- Computes real-time gyroscope/mouse tilt parallax and particle dust simulation.
- Drives the slide-out 3D node drawer with contextual deep links.

### 2.5 Bilingual Voiceover Specialist (`src/components/VoiceoverManager.js`)
- Plays zero-latency pre-generated neural Malayalam (`ml-IN-SobhanaNeural`) and English (`en-US-JennyNeural`) audio tracks.
- Provides fallback to browser SpeechSynthesis API if audio files are inaccessible.

### 2.6 Gamified Quiz Master (`src/components/QuizEngine.js`)
- Administers single-choice interactive questions.
- Plays celebratory sound syntheses via Web Audio API.
- Awards floating stars and progress badges.

## 3. Data Flow
1. **Raw Ingestion**: Textbooks and question papers stored in `data/input/`.
2. **Normalized Structured Datasets**: Maintained in `src/data/chaptersData.js`, `examPapersData.js`, `knowledgeGraphData.js`, and `quizQuestionsData.js`.
3. **Component Binding**: Orchestrator binds datasets to ES6 UI components (`SlideDeck`, `StoryClassroom`, `ThreeUniverse`, `QuizEngine`, `ExamSolverView`).
4. **Rendering**: Vanilla HTML5 + CSS3 glassmorphism layout, Three.js WebGL canvas, and HTML5 Audio playback.
