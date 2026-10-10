/**
 * Application Master Controller
 * Magical Learning Adventure for 6-Year-Old Children
 * Integrates SoundEffects (Web Audio), Voiceover (Web Speech),
 * 3D Interactive Side-Drawer, Quiz Engine, Slides, Classroom, and Exam Solver.
 */

import { CHAPTERS_DATA } from './data/chaptersData.js';
import { EXAM_PAPERS_DATA } from './data/examPapersData.js';
import { GRAPH_DATA } from './data/knowledgeGraphData.js';
import { KID_QUIZ_QUESTIONS } from './data/quizQuestionsData.js';
import { MultiAgentOrchestrator } from './agents/orchestrator.js';
import { ThreeUniverse } from './components/ThreeUniverse.js';
import { MotionCanvas } from './components/MotionCanvas.js';
import { SlideDeckManager } from './components/SlideDeck.js';
import { StoryClassroomManager } from './components/StoryClassroom.js';
import { ExamSolverView } from './components/ExamSolverView.js';
import { QuizEngine } from './components/QuizEngine.js';
import { VoiceoverManager } from './components/VoiceoverManager.js';
import { SoundEffects } from './components/SoundEffects.js';

class AppController {
  constructor() {
    this.orchestrator = new MultiAgentOrchestrator();
    this.voiceover = new VoiceoverManager();
    this.sfx = new SoundEffects();
    this.slideDeck = new SlideDeckManager(CHAPTERS_DATA);
    this.classroom = new StoryClassroomManager();
    this.solver = new ExamSolverView(EXAM_PAPERS_DATA);
    this.quiz = new QuizEngine();

    this.threeUniverse = null;
    this.motionCanvas = null;
    this.currentTheme = 'dark';
    this.activeChapter = 1;
    this.activePaperId = '2025_s1';
    this.starsCount = 0;
    this.currentMascot = 'leo';
  }

  init() {
    this.loadSavedStars();
    this.setupTheme();
    this.setupNavigation();
    this.initMotionCanvas();
    this.initThreeUniverse();
    this.initSlidesView();
    this.initClassroomView();
    this.initSolverView();
    this.initQuizView();
    this.setupOrchestratorFeed();
    this.setupKeyboardShortcuts();
    this.updateHeaderStars();

    // Welcome message trace
    this.orchestrator.processPrompt({
      intent: 'story',
      chapterNumber: 1,
      query: 'Magical Learning Adventure initialized! All 15 Chapters and 5 Exam Papers ready.'
    });
  }

  loadSavedStars() {
    const saved = localStorage.getItem('adventure-stars');
    this.starsCount = saved ? parseInt(saved, 10) : 3;
  }

  addStar(amount = 1) {
    this.starsCount += amount;
    localStorage.setItem('adventure-stars', this.starsCount);
    this.updateHeaderStars();
    this.sfx.playSparkle();
  }

  updateHeaderStars() {
    const starEl = document.getElementById('header-star-count');
    if (starEl) starEl.textContent = `${this.starsCount} Stars`;
  }

  /* ---------------- Theme Toggle ---------------- */
  setupTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.sfx.playPop();
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    const themeLabel = document.getElementById('theme-label');
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Daylight Mode' : 'Night Mode';
    }
  }

  /* ---------------- Navigation Tabs ---------------- */
  setupNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sfx.playPop();
        const targetView = btn.getAttribute('data-view');
        this.switchView(targetView);
      });
    });
  }

  switchView(viewName) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${viewName}`);
    });

    if (viewName === 'universe' && this.threeUniverse) {
      const container = document.getElementById('three-canvas-container');
      if (container && this.threeUniverse.renderer && this.threeUniverse.camera) {
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 500;
        this.threeUniverse.camera.aspect = width / height;
        this.threeUniverse.camera.updateProjectionMatrix();
        this.threeUniverse.renderer.setSize(width, height);
      }
    }
  }

  /* ---------------- Motion Canvas ---------------- */
  initMotionCanvas() {
    const canvas = document.getElementById('motion-audio-canvas');
    if (canvas) {
      canvas.width = 120;
      canvas.height = 28;
      this.motionCanvas = new MotionCanvas(canvas);
      this.motionCanvas.start();

      this.voiceover.onStartSpeaking = () => {
        this.motionCanvas.setAudioActive(true);
        const statusEl = document.getElementById('audio-indicator');
        if (statusEl) statusEl.textContent = '🔊 Leo is Speaking...';
      };

      this.voiceover.onEndSpeaking = () => {
        this.motionCanvas.setAudioActive(false);
        const statusEl = document.getElementById('audio-indicator');
        if (statusEl) statusEl.textContent = '🔇 Audio Ready';
      };
    }
  }

  /* ---------------- 3D Universe & Side-Drawer ---------------- */
  initThreeUniverse() {
    const container = document.getElementById('three-canvas-container');
    if (container && window.THREE) {
      this.threeUniverse = new ThreeUniverse(container, (drawerData, rawNode) => {
        this.handleNodeClick(drawerData, rawNode);
      });
      this.threeUniverse.init(GRAPH_DATA.nodes, GRAPH_DATA.edges);
    }
  }

  handleNodeClick(drawerData) {
    if (!drawerData) return;
    this.sfx.playPop();

    const drawer = document.getElementById('three-node-drawer');
    if (!drawer) return;

    // Render drawer HTML
    drawer.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-emoji-badge">${drawerData.emoji}</div>
        <button class="drawer-close-btn" onclick="window.app.closeUniverseDrawer()" title="Close">✕</button>
      </div>

      <div class="drawer-body">
        <span class="drawer-category-pill">${drawerData.category.toUpperCase()}</span>
        <h3 class="drawer-title">${drawerData.title}</h3>
        <h4 class="drawer-subtitle">${drawerData.subtitle}</h4>

        <div class="drawer-story-box">
          <p>${drawerData.story || drawerData.description}</p>
        </div>

        ${drawerData.scripture ? `
          <div class="drawer-scripture-box">
            <span>📖</span>
            <em>${drawerData.scripture}</em>
          </div>
        ` : ''}

        <div class="drawer-actions-col">
          <button class="btn-drawer-audio btn-drawer-audio-mal" onclick="window.app.speakDrawerContentMal()" title="Listen in Malayalam">
            🔊 മലയാളത്തിൽ കേൾക്കുക
          </button>
          <button class="btn-drawer-audio btn-drawer-audio-eng" onclick="window.app.speakDrawerContent()" title="Listen in English">
            🔊 English Narration
          </button>
          <button class="btn-drawer-audio btn-stop-voice" onclick="window.app.stopVoice()" title="Stop Audio">
            🛑 Stop Audio (നിർത്തുക)
          </button>
          
          ${drawerData.targetView === 'classroom' ? `
            <button class="btn-drawer-jump" onclick="window.app.jumpFromDrawerToClassroom(${drawerData.targetChapter || 1})">
              🚀 Open Story Lesson
            </button>
          ` : drawerData.targetView === 'solver' ? `
            <button class="btn-drawer-jump" onclick="window.app.jumpFromDrawerToSolver('${drawerData.targetPaperId}')">
              📝 Explore Exam Solutions
            </button>
          ` : `
            <button class="btn-drawer-jump" onclick="window.app.closeUniverseDrawer()">
              ✨ Explore More Stars
            </button>
          `}
        </div>
      </div>
    `;

    this.activeDrawerData = drawerData;
    drawer.classList.add('open');
    this.orchestrator.logTrace('3D Knowledge Graph', 'Node Explored', `Opened side-drawer for "${drawerData.title}"`);
  }

  closeUniverseDrawer() {
    this.sfx.playPop();
    const drawer = document.getElementById('three-node-drawer');
    if (drawer) drawer.classList.remove('open');
    if (this.threeUniverse) this.threeUniverse.isRotating = true;
  }

  speakDrawerContent() {
    if (this.activeDrawerData && this.activeDrawerData.audioText) {
      this.sfx.playPop();
      this.voiceover.speak(this.activeDrawerData.audioText);
    }
  }

  speakDrawerContentMal() {
    if (this.activeDrawerData) {
      this.sfx.playPop();
      const text = this.activeDrawerData.audioTextMal || this.activeDrawerData.title || this.activeDrawerData.audioText;
      this.voiceover.speakMalayalam(text);
    }
  }

  jumpFromDrawerToClassroom(chNum) {
    this.sfx.playSparkle();
    this.closeUniverseDrawer();
    this.activeChapter = chNum;
    this.switchView('classroom');
    this.renderClassroomLesson(chNum);
    this.renderChapterSelectorStrip();
  }

  jumpFromDrawerToSolver(paperId) {
    this.sfx.playSparkle();
    this.closeUniverseDrawer();
    this.activePaperId = paperId;
    this.switchView('solver');
    this.renderPaperTabs();
    this.renderActivePaper();
  }

  filterUniverse(category) {
    this.sfx.playPop();
    if (!this.threeUniverse) return;
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === category);
    });

    this.threeUniverse.nodeMeshes.forEach(mesh => {
      mesh.visible = category === 'all' || mesh.userData.category === category || mesh.userData.id === 'concept_jesus_life';
    });
  }

  /* ---------------- Slides View ---------------- */
  initSlidesView() {
    this.renderCurrentSlide();

    document.getElementById('btn-slide-prev')?.addEventListener('click', () => {
      this.sfx.playPop();
      this.slideDeck.prev();
      this.renderCurrentSlide();
    });

    document.getElementById('btn-slide-next')?.addEventListener('click', () => {
      this.sfx.playPop();
      this.slideDeck.next();
      this.renderCurrentSlide();
    });

    document.getElementById('btn-slide-fullscreen')?.addEventListener('click', () => {
      this.sfx.playPop();
      const el = document.getElementById('view-slides');
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (el) {
        el.requestFullscreen();
      }
    });

    document.getElementById('btn-slide-voice-mal')?.addEventListener('click', () => {
      this.sfx.playPop();
      const current = this.slideDeck.getCurrentSlide();
      this.speakMalayalam(`അദ്ധ്യായം ${current.number}: ${current.titleMal}. ${current.story5yoMal || ''}. സുവർണ്ണ പാഠം: ${current.moralLessonMal || ''}. ${current.scripture || ''}`);
    });

    document.getElementById('btn-slide-voice')?.addEventListener('click', () => {
      this.sfx.playPop();
      const current = this.slideDeck.getCurrentSlide();
      this.speakText(`${current.titleEng}. ${current.story5yo} Golden rule: ${current.moralLesson}`);
    });

    document.getElementById('btn-slide-stop')?.addEventListener('click', () => {
      this.stopVoice();
    });
  }

  renderCurrentSlide() {
    const container = document.getElementById('slide-deck-container');
    const slide = this.slideDeck.getCurrentSlide();
    const idx = this.slideDeck.getCurrentIndex();
    const total = this.slideDeck.getTotalSlides();

    if (container && slide) {
      container.innerHTML = this.slideDeck.renderSlideHTML(slide);
    }

    const indicator = document.getElementById('slide-indicator');
    if (indicator) indicator.textContent = `${idx + 1} / ${total}`;

    const progress = document.getElementById('slide-progress-bar');
    if (progress) progress.style.width = `${((idx + 1) / total) * 100}%`;
  }

  /* ---------------- Classroom View ---------------- */
  initClassroomView() {
    this.renderChapterSelectorStrip();
    this.renderClassroomLesson(this.activeChapter);
  }

  renderChapterSelectorStrip() {
    const strip = document.getElementById('classroom-ch-strip');
    if (!strip) return;

    strip.innerHTML = CHAPTERS_DATA.map(ch => `
      <button class="ch-btn-pill ${ch.number === this.activeChapter ? 'active' : ''}" onclick="window.app.selectClassroomChapter(${ch.number})">
        ⭐ Ch ${ch.number}
      </button>
    `).join('');
  }

  selectClassroomChapter(chNum) {
    this.sfx.playPop();
    this.activeChapter = chNum;
    this.renderChapterSelectorStrip();
    this.renderClassroomLesson(chNum);
    this.orchestrator.processPrompt({ intent: 'story', chapterNumber: chNum });
  }

  renderClassroomLesson(chNum) {
    const container = document.getElementById('classroom-lesson-container');
    if (!container) return;
    const lesson = this.classroom.getLesson(chNum);
    container.innerHTML = this.classroom.renderLessonCard(lesson);
  }

  speakStory(chNum) {
    this.sfx.playPop();
    const lesson = this.classroom.getLesson(chNum);
    this.speakText(`Chapter ${lesson.number}: ${lesson.titleEng}. ${lesson.story5yo} Today's golden rule: ${lesson.moralLesson}`);
  }

  speakStoryMal(chNum) {
    this.sfx.playPop();
    const lesson = this.classroom.getLesson(chNum);
    const text = `അദ്ധ്യായം ${lesson.number}: ${lesson.titleMal}. ${lesson.story5yoMal || lesson.story5yo}. ഇന്നത്തെ സുവർണ്ണ പാഠം: ${lesson.moralLessonMal || ''}. ${lesson.scripture || ''}`;
    this.speakMalayalam(text);
  }

  awardStar(chNum) {
    this.addStar(1);
    alert(`⭐ Hooray! You collected a shining golden star for Chapter ${chNum}! Total: ${this.starsCount} Stars! ✨`);
  }

  /* ---------------- Exam Solver View ---------------- */
  initSolverView() {
    this.renderPaperTabs();
    this.renderActivePaper();

    const searchInput = document.getElementById('solver-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSolverSearch(e.target.value);
      });
    }
  }

  renderPaperTabs() {
    const tabsRow = document.getElementById('paper-tabs-row');
    if (!tabsRow) return;

    tabsRow.innerHTML = EXAM_PAPERS_DATA.map(paper => `
      <button class="paper-tab-btn ${paper.id === this.activePaperId ? 'active' : ''}" onclick="window.app.switchPaper('${paper.id}')">
        📝 ${paper.title.split('(')[0]}
      </button>
    `).join('');
  }

  switchPaper(paperId) {
    this.sfx.playPop();
    this.activePaperId = paperId;
    this.renderPaperTabs();
    this.renderActivePaper();
    this.orchestrator.processPrompt({ intent: 'solve', paperId });
  }

  renderActivePaper() {
    const container = document.getElementById('solver-content-container');
    if (container) {
      container.innerHTML = this.solver.renderPaperViewHTML(this.activePaperId);
    }
  }

  handleSolverSearch(term) {
    const container = document.getElementById('solver-content-container');
    if (!container) return;

    if (!term.trim()) {
      this.renderActivePaper();
      return;
    }

    const matches = this.solver.searchQuestions(term);
    if (matches.length === 0) {
      container.innerHTML = `<div class="glass-panel text-center p-4">No matching exam questions found for "${term}".</div>`;
      return;
    }

    container.innerHTML = `
      <div class="search-results-banner mb-3">
        <h3>Found ${matches.length} matching questions across all 5 papers:</h3>
      </div>
      <div class="questions-list">
        ${matches.map(q => this.solver.renderQuestionCardHTML(q)).join('')}
      </div>
    `;
  }

  /* ---------------- Kid-Friendly Quiz Engine ---------------- */
  initQuizView() {
    this.quiz.loadQuestions(KID_QUIZ_QUESTIONS);
    this.renderQuiz();
  }

  restartQuiz() {
    this.sfx.playSparkle();
    this.quiz.reset();
    this.renderQuiz();
  }

  renderQuiz() {
    const container = document.getElementById('quiz-content-container');
    if (container) {
      container.innerHTML = this.quiz.renderQuizCardHTML();
    }
  }

  chooseQuizOption(index) {
    this.sfx.playPop();
    const result = this.quiz.answerByIndex(index);

    if (result.correct) {
      this.sfx.playChime();
      this.addStar(1);
    } else {
      this.sfx.playPop();
    }

    this.renderQuiz();
    this.orchestrator.logTrace('Quizmaster', 'Answer Evaluated', `Child selected option ${index + 1}. Correct: ${result.correct}`);
  }

  nextQuizQuestion() {
    this.sfx.playPop();
    const hasNext = this.quiz.nextQuestion();
    if (!hasNext) {
      this.sfx.playCheer();
    }
    this.renderQuiz();
  }

  showQuizHint() {
    this.sfx.playPop();
    const box = document.getElementById('quiz-hint-box');
    const q = this.quiz.getCurrentQuestion();
    if (box && q) {
      box.innerHTML = `<strong>🧸 Clue from Leo:</strong> ${q.eli5Hint || 'Think of Jesus and the 7 Sacraments!'}`;
      box.style.display = 'block';
    }
  }

  speakQuizQuestion() {
    const q = this.quiz.getCurrentQuestion();
    if (q) {
      this.sfx.playPop();
      this.voiceover.speak(`${q.questionEng}. Option 1: ${q.options[0]}. Option 2: ${q.options[1]}. Option 3: ${q.options[2]}`);
    }
  }

  /* ---------------- Voiceover Helpers ---------------- */
  speakText(text) {
    this.sfx.playPop();
    this.voiceover.speak(text);
  }

  speakMalayalam(text) {
    this.sfx.playPop();
    this.voiceover.speakMalayalam(text);
  }

  stopVoice() {
    this.sfx.playPop();
    this.voiceover.stop();
    if (this.motionCanvas) this.motionCanvas.setAudioActive(false);
    const indicator = document.getElementById('audio-indicator');
    if (indicator) indicator.textContent = '🔇 Audio Stopped';
  }

  switchMascotVoice(characterName) {
    this.sfx.playSparkle();
    this.currentMascot = characterName;
    this.voiceover.setCharacter(characterName);
    const names = { leo: 'Leo the Lion Cub 🦁', bella: 'Bella the Dove 🕊️', sammy: 'Sammy the Lamb 🐑' };
    alert(`Voice switched to ${names[characterName] || 'Leo'}!`);
  }

  /* ---------------- Galileo Tracing Feed ---------------- */
  setupOrchestratorFeed() {
    const feed = document.getElementById('agent-trace-feed');
    if (!feed) return;

    this.orchestrator.onEvent((event) => {
      if (event.type === 'TRACE') {
        const trace = event.trace;
        const card = document.createElement('div');
        card.className = 'trace-card animate-slide-fade';
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between;">
            <span class="agent-tag">${trace.agent}</span>
            <span class="time">${trace.timestamp}</span>
          </div>
          <div class="action">${trace.action}</div>
          <div class="details text-muted">${trace.details}</div>
        `;
        feed.prepend(card);
        while (feed.children.length > 25) feed.removeChild(feed.lastChild);
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-view');
      if (activeTab === 'slides') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          this.slideDeck.next();
          this.renderCurrentSlide();
        } else if (e.key === 'ArrowLeft') {
          this.slideDeck.prev();
          this.renderCurrentSlide();
        }
      }
    });
  }
}

// Attach globally
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
