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
import { GeminiAIService } from './services/GeminiAIService.js';
import { MotionGraphicsEngine } from './components/MotionGraphicsEngine.js';

class AppController {
  constructor() {
    this.orchestrator = new MultiAgentOrchestrator();
    this.voiceover = new VoiceoverManager();
    this.sfx = new SoundEffects();
    this.geminiService = new GeminiAIService();
    this.voiceover.setGeminiService(this.geminiService);
    this.motionGraphics = new MotionGraphicsEngine();
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
    this.setupViewMode();
    this.setupNavigation();
    this.setupGeminiKeyUI();
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

  /* ---------------- Mobile / Desktop View Mode Toggle ---------------- */
  setupViewMode() {
    const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 768;
    // On desktop screens (> 768px), always start in clean desktop mode!
    // Never trap desktop monitors in 430px mobile mode across browser refreshes.
    let initialMode = isNarrow ? 'mobile' : 'desktop';
    localStorage.setItem('app-view-mode', initialMode);
    this.setViewMode(initialMode, true);

    const toggleBtn = document.getElementById('btn-mobile-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.toggleViewMode();
      });
    }
  }

  toggleViewMode() {
    if (this._isTogglingMode) return;
    this._isTogglingMode = true;
    setTimeout(() => { this._isTogglingMode = false; }, 250);

    const nextMode = this.viewMode === 'mobile' ? 'desktop' : 'mobile';
    this.setViewMode(nextMode, false);
  }

  setViewMode(mode, silent = false) {
    this.viewMode = mode;
    localStorage.setItem('app-view-mode', mode);
    const iconEl = document.getElementById('mobile-toggle-icon');
    const labelEl = document.getElementById('mobile-toggle-label');
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;

    if (mode === 'mobile') {
      document.documentElement.classList.add('mobile-view-active');
      document.body.classList.add('mobile-view-active');
      document.documentElement.classList.remove('desktop-view-forced');
      document.body.classList.remove('desktop-view-forced');
      if (iconEl) iconEl.textContent = '💻';
      if (labelEl) labelEl.textContent = 'Desktop View';
      if (!silent) this.showToast('📱 Switched to Mobile Mode (430px Preview)', '📱');
    } else {
      document.documentElement.classList.remove('mobile-view-active');
      document.body.classList.remove('mobile-view-active');
      if (isSmallScreen) {
        document.documentElement.classList.add('desktop-view-forced');
        document.body.classList.add('desktop-view-forced');
      } else {
        document.documentElement.classList.remove('desktop-view-forced');
        document.body.classList.remove('desktop-view-forced');
      }
      if (iconEl) iconEl.textContent = '📱';
      if (labelEl) labelEl.textContent = 'Mobile View';
      if (!silent) this.showToast('💻 Switched to Desktop Mode', '💻');
    }

    // Trigger 3D canvas resize if in universe view
    if (this.threeUniverse && this.currentView === 'universe') {
      setTimeout(() => {
        const container = document.getElementById('three-canvas-container');
        if (container && this.threeUniverse.renderer && this.threeUniverse.camera) {
          const width = container.clientWidth || 800;
          const height = container.clientHeight || 500;
          this.threeUniverse.camera.aspect = width / height;
          this.threeUniverse.camera.updateProjectionMatrix();
          this.threeUniverse.renderer.setSize(width, height);
        }
      }, 100);
    }
  }

  showToast(message, icon = '✨') {
    if (typeof document === 'undefined') return;
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'app-toast-pill glass-panel';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 350);
    }, 2400);
  }

  /* ---------------- Navigation Tabs & Mobile Bottom Nav ---------------- */
  setupNavigation() {
    const handleNavClick = (btn) => {
      if (this.sfx && this.sfx.playPop) this.sfx.playPop();
      const targetView = btn.getAttribute('data-view');
      this.switchView(targetView);
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => handleNavClick(btn));
    });

    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => handleNavClick(btn));
    });

    this.setupMobileSettingsSheet();
  }

  setupMobileSettingsSheet() {
    const menuBtn = document.getElementById('btn-mobile-menu');
    const sheet = document.getElementById('mobile-settings-sheet');
    const closeBtn = document.getElementById('btn-close-sheet');
    const backdrop = document.getElementById('sheet-backdrop');
    const sheetThemeBtn = document.getElementById('sheet-theme-btn');
    const sheetViewBtn = document.getElementById('sheet-view-btn');

    if (!sheet) return;

    const openSheet = (e) => {
      if (e) e.stopPropagation();
      if (this.sfx && this.sfx.playPop) this.sfx.playPop();
      sheet.classList.add('active');
      sheet.style.display = 'block';
      sheet.setAttribute('aria-hidden', 'false');
    };

    const closeSheet = (e) => {
      if (e) e.stopPropagation();
      sheet.classList.remove('active');
      sheet.style.display = 'none';
      sheet.setAttribute('aria-hidden', 'true');
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', openSheet);
      menuBtn.onclick = openSheet;
    }
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    if (backdrop) backdrop.addEventListener('click', closeSheet);

    if (sheetThemeBtn) {
      sheetThemeBtn.addEventListener('click', () => {
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
      });
    }

    if (sheetViewBtn) {
      sheetViewBtn.addEventListener('click', () => {
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.toggleViewMode();
        closeSheet();
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.mobile-nav-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${viewName}`);
    });

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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

      // Attach 3D physics tilt and floating golden starlight particle canvas
      const imgContainer = container.querySelector('.slide-img-container');
      if (imgContainer && this.motionGraphics) {
        this.motionGraphics.attach3DTilt(imgContainer);
        this.motionGraphics.attachParticleCanvas(imgContainer);
      }
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

    // Attach 3D physics tilt and floating particle canvas to lesson banner
    const bannerArt = container.querySelector('.lesson-banner-art');
    if (bannerArt && this.motionGraphics) {
      this.motionGraphics.attach3DTilt(bannerArt);
      this.motionGraphics.attachParticleCanvas(bannerArt);
    }
  }

  speakStory(chNum) {
    this.sfx.playPop();
    const ch = CHAPTERS_DATA.find(c => c.number === Number(chNum)) || this.slideDeck.getCurrentSlide();
    if (ch && ch.audioUrlEng) {
      this.voiceover.playStaticAudio(ch.audioUrlEng, () => {
        if (this.motionCanvas) this.motionCanvas.setAudioActive(false);
      });
      return;
    }
    const lesson = this.classroom.getLesson(chNum);
    this.speakText(`Chapter ${lesson.number}: ${lesson.titleEng}. ${lesson.story5yo} Today's golden rule: ${lesson.moralLesson}`);
  }

  speakStoryMal(chNum) {
    this.sfx.playPop();
    const ch = CHAPTERS_DATA.find(c => c.number === Number(chNum)) || this.slideDeck.getCurrentSlide();
    if (ch && ch.audioUrlMal) {
      this.voiceover.playStaticAudio(ch.audioUrlMal, () => {
        if (this.motionCanvas) this.motionCanvas.setAudioActive(false);
      });
      return;
    }
    const lesson = this.classroom.getLesson(chNum);
    const text = `അദ്ധ്യായം ${lesson.number}: ${lesson.titleMal}. ${lesson.story5yoMal || lesson.story5yo}. ഇന്നത്തെ സുവർണ്ണ പാഠം: ${lesson.moralLessonMal || ''}. ${lesson.scripture || ''}`;
    this.speakMalayalam(text);
  }

  toggleSlideArtMode(chNum) {
    this.sfx.playPop();
    const ch = CHAPTERS_DATA.find(c => c.number === Number(chNum)) || this.slideDeck.getCurrentSlide();
    if (!ch) return;
    const imgEl = document.getElementById(`slide-hero-img-${ch.number}`);
    if (!imgEl) return;

    const is3D = imgEl.src.includes('pixar');
    const newSrc = is3D ? ch.textbookUrl : ch.imageUrl;
    imgEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(0.95)';

    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    }, 300);
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

  /* ---------------- Google AI Studio Gemini API Modal ---------------- */
  setupGeminiKeyUI() {
    this.updateGeminiKeyButtonUI();
  }

  updateGeminiKeyButtonUI() {
    const btn = document.getElementById('btn-gemini-key');
    const statusText = document.getElementById('gemini-key-status');
    if (!btn || !statusText) return;

    if (this.geminiService && this.geminiService.hasKey()) {
      btn.classList.add('key-active');
      statusText.textContent = '🟢 Gemini Ready';
      btn.title = 'Google AI Studio Gemini Active: Natural Neural Malayalam Voice & 4K AI Art Enabled';
    } else {
      btn.classList.remove('key-active');
      statusText.textContent = '🔑 Gemini AI';
      btn.title = 'Click to connect Google AI Studio API Key for Natural Voice & 4K AI Art';
    }
  }

  openGeminiModal() {
    this.sfx.playPop();
    const modal = document.getElementById('gemini-api-modal');
    const input = document.getElementById('gemini-key-input');
    const feedback = document.getElementById('gemini-test-feedback');
    if (feedback) feedback.style.display = 'none';

    if (input && this.geminiService) {
      input.value = this.geminiService.getApiKey() || '';
    }
    if (modal) modal.style.display = 'flex';
  }

  closeGeminiModal() {
    this.sfx.playPop();
    const modal = document.getElementById('gemini-api-modal');
    if (modal) modal.style.display = 'none';
  }

  toggleKeyVisibility() {
    const input = document.getElementById('gemini-key-input');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  saveGeminiKey() {
    this.sfx.playSparkle();
    const input = document.getElementById('gemini-key-input');
    const feedback = document.getElementById('gemini-test-feedback');
    const key = input ? input.value.trim() : '';

    if (!key) {
      if (feedback) {
        feedback.className = 'modal-feedback-banner modal-feedback-error';
        feedback.textContent = '⚠️ Please enter a valid Gemini API Key.';
        feedback.style.display = 'block';
      }
      return;
    }

    this.geminiService.setApiKey(key);
    this.updateGeminiKeyButtonUI();

    if (feedback) {
      feedback.className = 'modal-feedback-banner modal-feedback-success';
      feedback.textContent = '✅ API Key saved! Natural Malayalam voice and 4K AI art generation are now active.';
      feedback.style.display = 'block';
    }

    setTimeout(() => {
      this.closeGeminiModal();
    }, 1200);
  }

  clearGeminiKey() {
    this.sfx.playPop();
    this.geminiService.clearApiKey();
    this.updateGeminiKeyButtonUI();
    const input = document.getElementById('gemini-key-input');
    if (input) input.value = '';
    const feedback = document.getElementById('gemini-test-feedback');
    if (feedback) {
      feedback.className = 'modal-feedback-banner modal-feedback-error';
      feedback.textContent = '🗑️ Gemini API Key cleared.';
      feedback.style.display = 'block';
    }
  }

  async testGeminiVoice() {
    const feedback = document.getElementById('gemini-test-feedback');
    const input = document.getElementById('gemini-key-input');
    const key = input ? input.value.trim() : '';

    if (key) {
      this.geminiService.setApiKey(key);
      this.updateGeminiKeyButtonUI();
    }

    if (!this.geminiService.hasKey()) {
      if (feedback) {
        feedback.className = 'modal-feedback-banner modal-feedback-error';
        feedback.textContent = '⚠️ Please enter an API key first to test.';
        feedback.style.display = 'block';
      }
      return;
    }

    if (feedback) {
      feedback.className = 'modal-feedback-banner modal-feedback-success';
      feedback.textContent = '⏳ Testing Google AI Studio natural voice...';
      feedback.style.display = 'block';
    }

    try {
      await this.voiceover.speakMalayalam('നമസ്കാരം! ഗൂഗിൾ ജെമിനി വോയ്‌സ് ഇപ്പോൾ സജീവമാണ്. നിങ്ങൾക്കെല്ലാവർക്കും സ്വാഗതം!');
      if (feedback) {
        feedback.className = 'modal-feedback-banner modal-feedback-success';
        feedback.textContent = '🎉 Natural Malayalam voice tested successfully!';
      }
    } catch (e) {
      if (feedback) {
        feedback.className = 'modal-feedback-banner modal-feedback-error';
        feedback.textContent = `❌ Voice test error: ${e.message}`;
      }
    }
  }

  async generate4KArt(chapterNum) {
    if (!this.geminiService.hasKey()) {
      this.openGeminiModal();
      const feedback = document.getElementById('gemini-test-feedback');
      if (feedback) {
        feedback.className = 'modal-feedback-banner modal-feedback-error';
        feedback.textContent = '🔑 Please paste your Google AI Studio Gemini API Key to generate 4K 3D Pixar art!';
        feedback.style.display = 'block';
      }
      return;
    }

    const chapter = CHAPTERS_DATA.find(c => c.number === Number(chapterNum)) || this.slideDeck.getCurrentSlide();
    const imgEl = document.getElementById(`slide-hero-img-${chapter.number}`);
    const btnEl = document.querySelector('.btn-slide-ai-art');

    if (btnEl) btnEl.textContent = '⏳ Generating 4K...';
    this.sfx.playSparkle();

    try {
      const newImageUrl = await this.geminiService.generate3DPixarArt(chapter);
      if (imgEl) {
        imgEl.style.transition = 'opacity 0.4s ease';
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = newImageUrl;
          imgEl.style.opacity = '1';
        }, 400);
      }
      chapter.imageUrl = newImageUrl;
      if (btnEl) btnEl.textContent = '✨ 4K Pixar Generated!';
      this.addStar(2);
    } catch (e) {
      alert(`Could not generate image: ${e.message}`);
      if (btnEl) btnEl.textContent = '✨ 4K Pixar AI';
    }
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
