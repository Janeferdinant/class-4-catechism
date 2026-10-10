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
import { LayoutSelector } from './presentation/LayoutSelector.js';
import { MobilePresentation } from './presentation/MobilePresentation.js';
import { DesktopPresentation } from './presentation/DesktopPresentation.js';

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

    this.desktopPres = new DesktopPresentation(this);
    this.mobilePres = new MobilePresentation(this);
    this.layoutSelector = new LayoutSelector({
      mobileBreakpoint: 768,
      onLayoutChange: (layout) => {
        this.handleLayoutChange(layout);
      }
    });

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
    this.desktopPres.init();
    this.mobilePres.init();
    this.layoutSelector.init();
    if (typeof window !== 'undefined') {
      window.mobileApp = this.mobilePres;
    }
    this.setupViewMode();
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
    if (this.mobilePres) this.mobilePres.updateStars(this.starsCount);
    this.sfx.playSparkle();
  }

  updateHeaderStars() {
    const starEl = document.getElementById('header-star-count');
    if (starEl) starEl.textContent = `${this.starsCount} Stars`;
    if (this.mobilePres) this.mobilePres.updateStars(this.starsCount);
  }

  updateStarsBadge() {
    this.updateHeaderStars();
  }

  handleLayoutChange(layout) {
    if (layout === 'mobile' || layout === 'preview') {
      if (this.mobilePres) {
        this.mobilePres.updateStars(this.starsCount);
      }
    } else {
      if (this.desktopPres) {
        this.desktopPres.updateStars(this.starsCount);
      }
    }
  }

  /* ---------------- Theme Toggle ---------------- */
  setupTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        const segBtn = e.target.closest('.theme-segment');
        if (segBtn) {
          this.sfx.playPop();
          const targetTheme = segBtn.id === 'theme-btn-light' ? 'light' : 'dark';
          this.setTheme(targetTheme);
          return;
        }
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

    // Segmented theme control state
    const lightBtn = document.getElementById('theme-btn-light');
    const darkBtn = document.getElementById('theme-btn-dark');
    if (lightBtn && darkBtn) {
      lightBtn.classList.toggle('active', theme === 'light');
      darkBtn.classList.toggle('active', theme === 'dark');
    }

    // Light mode hero figure cutout
    const jesusCutout = document.getElementById('hero-jesus-cutout');
    if (jesusCutout) {
      jesusCutout.style.display = theme === 'light' ? 'block' : 'none';
    }

    if (this.heroAtmosphere) {
      this.heroAtmosphere.setTheme(theme);
    }
    const scriptureText = document.querySelector('.scripture-quote-text');
    const scriptureRef = document.querySelector('.scripture-ref-tag');
    if (scriptureText && scriptureRef) {
      if (theme === 'dark') {
        scriptureText.textContent = '“Your word is a lamp to my feet and a light to my path.”';
        scriptureRef.textContent = 'Psalm 119:105';
      } else {
        scriptureText.textContent = '“Let the little children come to me...”';
        scriptureRef.textContent = 'Mark 10:14';
      }
    }
  }

  /* ---------------- Mobile / Desktop View Mode Toggle ---------------- */
  setupViewMode() {
    const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 768;
    // On desktop screens (> 768px), default to desktop; on narrow screens, mobile.
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

    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isSmallScreen) {
      const nextMode = this.viewMode === 'mobile' ? 'desktop' : 'mobile';
      this.setViewMode(nextMode, false);
    } else {
      if (this.layoutSelector.currentMode === 'preview') {
        this.setViewMode('desktop', false);
      } else {
        this.setViewMode('mobile', false);
      }
    }
  }

  setViewMode(mode, silent = false) {
    this.viewMode = mode;
    localStorage.setItem('app-view-mode', mode);
    const iconEl = document.getElementById('mobile-toggle-icon');
    const labelEl = document.getElementById('mobile-toggle-label');
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;

    if (mode === 'mobile') {
      if (!isSmallScreen && this.layoutSelector) {
        this.layoutSelector.previewMobile(390);
      } else if (this.layoutSelector) {
        this.layoutSelector.applyLayout('mobile');
      }
      document.documentElement.classList.add('mobile-view-active');
      document.body.classList.add('mobile-view-active');
      document.documentElement.classList.remove('desktop-view-forced');
      document.body.classList.remove('desktop-view-forced');
      if (iconEl) iconEl.textContent = '💻';
      if (labelEl) labelEl.textContent = isSmallScreen ? 'Desktop View' : 'Exit Mobile Preview';
      if (!silent) this.showToast('📱 Switched to Mobile Mode Preview', '📱');
    } else {
      if (this.layoutSelector && this.layoutSelector.currentMode === 'preview') {
        this.layoutSelector.exitPreview();
      } else if (this.layoutSelector) {
        this.layoutSelector.applyLayout('desktop');
      }
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
      if (labelEl) labelEl.textContent = 'Preview Mobile Layout';
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
    const mobMenuBtn = document.getElementById('mob-btn-menu');
    const sheet = document.getElementById('mobile-settings-sheet');
    const closeBtn = document.getElementById('btn-close-sheet');
    const backdrop = document.getElementById('sheet-backdrop');
    const sheetThemeBtn = document.getElementById('sheet-theme-btn');
    const sheetViewBtn = document.getElementById('sheet-view-btn');
    const sheetFullscreenBtn = document.getElementById('sheet-fullscreen-btn');
    const resetStarsBtn = document.getElementById('sheet-reset-stars-btn');
    const sfxToggleBtn = document.getElementById('sheet-sfx-toggle');

    if (!sheet) return;

    this.toggleSettingsPopup = (forceOpen) => {
      const isCurrentlyOpen = sheet.classList.contains('active');
      const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

      if (this.sfx && this.sfx.playPop) this.sfx.playPop();

      if (shouldOpen) {
        sheet.classList.add('active');
        sheet.style.display = 'block';
        sheet.setAttribute('aria-hidden', 'false');
        if (menuBtn) menuBtn.classList.add('gear-active');
        if (mobMenuBtn) mobMenuBtn.classList.add('gear-active');
        this.updateSettingsPopupUI();
      } else {
        sheet.classList.remove('active');
        sheet.style.display = 'none';
        sheet.setAttribute('aria-hidden', 'true');
        if (menuBtn) menuBtn.classList.remove('gear-active');
        if (mobMenuBtn) mobMenuBtn.classList.remove('gear-active');
      }
    };

    const handleMenuClick = (e) => {
      if (e) e.stopPropagation();
      this.toggleSettingsPopup();
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', handleMenuClick);
      menuBtn.onclick = handleMenuClick;
    }
    if (mobMenuBtn) {
      mobMenuBtn.addEventListener('click', handleMenuClick);
      mobMenuBtn.onclick = handleMenuClick;
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.toggleSettingsPopup(false);
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.toggleSettingsPopup(false);
      });
    }

    // Dismiss when clicking anywhere outside popup card or gear buttons
    document.addEventListener('click', (e) => {
      if (sheet && sheet.classList.contains('active')) {
        const popupCard = sheet.querySelector('.sheet-card');
        const clickedInsidePopup = popupCard && popupCard.contains(e.target);
        const clickedGearBtn = (menuBtn && menuBtn.contains(e.target)) || (mobMenuBtn && mobMenuBtn.contains(e.target));
        if (!clickedInsidePopup && !clickedGearBtn) {
          this.toggleSettingsPopup(false);
        }
      }
    });

    if (sheetThemeBtn) {
      sheetThemeBtn.addEventListener('click', () => {
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
        this.updateSettingsPopupUI();
      });
    }

    if (sheetViewBtn) {
      sheetViewBtn.addEventListener('click', () => {
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.toggleViewMode();
        this.toggleSettingsPopup(false);
      });
    }

    if (sheetFullscreenBtn) {
      sheetFullscreenBtn.addEventListener('click', () => {
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          sheetFullscreenBtn.textContent = '✕ Exit Fullscreen';
        } else {
          document.exitFullscreen().catch(() => {});
          sheetFullscreenBtn.textContent = '⛶ Fullscreen';
        }
      });
    }

    if (resetStarsBtn) {
      resetStarsBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.starsCount = 0;
        try {
          localStorage.setItem('adventure-stars', '0');
          localStorage.setItem('class4-collected-stars', '0');
        } catch (_) {}
        this.updateHeaderStars();
        if (this.desktopPres) this.desktopPres.updateStars(0);
        if (this.mobilePres) this.mobilePres.updateStars(0);
        this.updateSettingsPopupUI();
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.showToast('⭐ Stars reset to 0', '⭐');
      });
    }

    // Audio Language Pills
    const langMalBtn = document.getElementById('sheet-lang-mal');
    const langEngBtn = document.getElementById('sheet-lang-eng');
    if (langMalBtn && langEngBtn) {
      langMalBtn.addEventListener('click', () => {
        langMalBtn.classList.add('active');
        langEngBtn.classList.remove('active');
        try { localStorage.setItem('preferred-narration-lang', 'mal'); } catch (_) {}
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.showToast('🔊 Malayalam Voice Selected', '🇮🇳');
      });
      langEngBtn.addEventListener('click', () => {
        langEngBtn.classList.add('active');
        langMalBtn.classList.remove('active');
        try { localStorage.setItem('preferred-narration-lang', 'eng'); } catch (_) {}
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.showToast('🔊 English Voice Selected', '🇬🇧');
      });
    }

    // Speech Speed Pills
    const speedChildBtn = document.getElementById('sheet-speed-btn');
    const speedNormalBtn = document.getElementById('sheet-speed-normal');
    if (speedChildBtn && speedNormalBtn) {
      speedChildBtn.addEventListener('click', () => {
        speedChildBtn.classList.add('active');
        speedNormalBtn.classList.remove('active');
        this.speechRate = 0.85;
        try { localStorage.setItem('preferred-speech-rate', '0.85'); } catch (_) {}
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.showToast('🧸 0.85x Child-Pace Voice Enabled', '🧸');
      });
      speedNormalBtn.addEventListener('click', () => {
        speedNormalBtn.classList.add('active');
        speedChildBtn.classList.remove('active');
        this.speechRate = 1.0;
        try { localStorage.setItem('preferred-speech-rate', '1.0'); } catch (_) {}
        if (this.sfx && this.sfx.playPop) this.sfx.playPop();
        this.showToast('⚡ 1.0x Normal Pace Enabled', '⚡');
      });
    }

    // Sound Effects Toggle
    if (sfxToggleBtn) {
      sfxToggleBtn.addEventListener('click', () => {
        this.sfxMuted = !this.sfxMuted;
        sfxToggleBtn.classList.toggle('active', !this.sfxMuted);
        sfxToggleBtn.textContent = this.sfxMuted ? '🔕 SFX Off' : '🔔 SFX On';
        if (!this.sfxMuted && this.sfx && this.sfx.playChime) this.sfx.playChime();
        this.showToast(this.sfxMuted ? '🔕 Sound Effects Muted' : '🔔 Sound Effects Enabled', '🔔');
      });
    }
  }

  updateSettingsPopupUI() {
    const starsVal = document.getElementById('sheet-stars-count-val');
    if (starsVal) {
      starsVal.textContent = `${this.starsCount || 0} Stars Collected`;
    }

    const themeIcon = document.getElementById('sheet-theme-icon');
    const themeText = document.getElementById('sheet-theme-text');
    if (themeIcon && themeText) {
      const isDark = (this.currentTheme || 'dark') === 'dark';
      themeIcon.textContent = isDark ? '🌙' : '☀️';
      themeText.textContent = isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)';
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

    if (this.mobilePres && this.mobilePres.currentView !== viewName) {
      this.mobilePres.switchMobileView(viewName);
    }

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
    const heroCanvas = document.getElementById('hero-particle-canvas');
    if (heroCanvas && this.motionGraphics) {
      this.heroAtmosphere = this.motionGraphics.attachAtmosphericSystem(heroCanvas, this.currentTheme);
    }

    const container = document.getElementById('three-canvas-container');
    if (container && window.THREE) {
      this.threeUniverse = new ThreeUniverse(container, (drawerData, rawNode) => {
        this.handleNodeClick(drawerData, rawNode);
      });
      this.threeUniverse.init(GRAPH_DATA.nodes, GRAPH_DATA.edges);
    }
  }

  handleNodeClick(drawerData, rawNode) {
    if (!drawerData) return;
    this.sfx.playPop();
    if (this.heroAtmosphere) {
      this.heroAtmosphere.spawnBurst();
    }

    const drawer = document.getElementById('three-node-drawer');
    const mobDrawer = document.getElementById('mob-three-node-drawer');
    const consolePanel = document.getElementById('agent-console-panel');

    // On desktop, swap console with node drawer
    if (consolePanel && window.innerWidth > 768) {
      consolePanel.style.display = 'none';
    }

    // Get chapter image if available
    let coverImgHtml = '';
    if (drawerData.chapterNumber) {
      const ch = CHAPTERS_DATA.find(c => c.number === drawerData.chapterNumber);
      if (ch && ch.imageUrl) {
        coverImgHtml = `<div class="drawer-cover-wrap"><img src="${ch.imageUrl}" alt="${drawerData.title}" class="drawer-cover-img" /></div>`;
      }
    }

    // Render drawer HTML
    const drawerHtml = `
      <div class="drawer-header">
        <button class="drawer-back-console-btn" onclick="window.app.closeUniverseDrawer()" title="Back to Learning Console">
          ← Learning Console
        </button>
        <button class="drawer-close-btn" onclick="window.app.closeUniverseDrawer()" title="Close">✕</button>
      </div>

      <div class="drawer-body">
        ${coverImgHtml}
        <div class="drawer-chips-row">
          <span class="drawer-category-pill">${drawerData.category.toUpperCase()}</span>
          ${drawerData.chapterNumber ? `<span class="drawer-ch-chip">Chapter ${drawerData.chapterNumber}</span>` : ''}
        </div>
        <h3 class="drawer-title">${drawerData.title}</h3>
        <h4 class="drawer-subtitle">${drawerData.subtitle}</h4>

        <div class="drawer-story-box">
          <p>${drawerData.story || drawerData.description}</p>
          ${drawerData.storyMal ? `<p class="drawer-story-mal">${drawerData.storyMal}</p>` : ''}
        </div>

        ${drawerData.scripture ? `
          <div class="drawer-scripture-box">
            <span class="scripture-icon">📖</span>
            <em>${drawerData.scripture}</em>
          </div>
        ` : ''}

        <!-- Shared Audio Bar Row -->
        <div class="drawer-audio-row">
          <button class="btn-drawer-audio btn-drawer-audio-mal" onclick="window.app.speakDrawerContentMal()" title="Listen in Malayalam">
            🔊 Malayalam
          </button>
          <button class="btn-drawer-audio btn-drawer-audio-eng" onclick="window.app.speakDrawerContent()" title="Listen in English">
            🔊 English
          </button>
          <button class="btn-drawer-audio btn-stop-voice" onclick="window.app.stopVoice()" title="Stop Audio">
            ⏹ Stop
          </button>
        </div>

        <div class="drawer-actions-col">
          ${drawerData.targetView === 'classroom' ? `
            <button class="btn-drawer-jump btn-primary-gold" onclick="window.app.jumpFromDrawerToClassroom(${drawerData.targetChapter || 1})">
              Go to Story Lesson →
            </button>
            <button class="btn-drawer-secondary" onclick="window.app.jumpFromDrawerToSlides(${drawerData.targetChapter || 1})">
              Picture Slides ➔
            </button>
          ` : drawerData.targetView === 'solver' ? `
            <button class="btn-drawer-jump btn-primary-gold" onclick="window.app.jumpFromDrawerToSolver('${drawerData.targetPaperId}')">
              Explore Exam Solutions →
            </button>
          ` : `
            <button class="btn-drawer-jump btn-primary-gold" onclick="window.app.closeUniverseDrawer()">
              Explore More Stars →
            </button>
          `}
        </div>
      </div>
    `;

    this.activeDrawerData = drawerData;

    if (drawer) {
      drawer.innerHTML = drawerHtml;
      drawer.style.display = 'block';
      drawer.classList.add('open');
    }
    if (mobDrawer) {
      mobDrawer.innerHTML = drawerHtml;
      mobDrawer.style.display = 'block';
      mobDrawer.classList.add('open');
    }
    this.orchestrator.logTrace('3D Knowledge Graph', 'Node Explored', `Opened side-drawer for "${drawerData.title}"`);
  }

  closeUniverseDrawer() {
    this.sfx.playPop();
    const drawer = document.getElementById('three-node-drawer');
    const mobDrawer = document.getElementById('mob-three-node-drawer');
    const consolePanel = document.getElementById('agent-console-panel');

    if (drawer) {
      drawer.classList.remove('open');
      drawer.style.display = 'none';
    }
    if (consolePanel) {
      consolePanel.style.display = 'flex';
    }
    if (mobDrawer) {
      mobDrawer.classList.remove('open');
      mobDrawer.style.display = 'none';
    }
    if (this.threeUniverse) this.threeUniverse.isRotating = true;
  }

  exploreChapterOne() {
    this.sfx.playSparkle();
    this.filterUniverse('chapter');
    if (this.threeUniverse) {
      this.threeUniverse.focusChapter(1);
    }
  }

  jumpFromDrawerToSlides(chNum) {
    this.sfx.playSparkle();
    this.closeUniverseDrawer();
    this.switchView('slides');
    if (this.slideDeck) {
      this.slideDeck.currentIdx = (chNum - 1);
      this.renderCurrentSlide();
    }
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
    if (this.mobilePres) {
      this.mobilePres.is3dOpen = false;
      const box3d = document.getElementById('mob-3d-view-box');
      if (box3d) box3d.style.display = 'none';
      const toggle3dBtn = document.getElementById('mob-btn-toggle-3d');
      if (toggle3dBtn) toggle3dBtn.textContent = '🌐 Open 3D Map View';
      this.mobilePres.jumpToChapterLesson(chNum);
    }
    this.switchView('classroom');
    this.renderClassroomLesson(chNum);
    this.renderChapterSelectorStrip();
  }

  jumpFromDrawerToSolver(paperId) {
    this.sfx.playSparkle();
    this.closeUniverseDrawer();
    this.activePaperId = paperId;
    if (this.mobilePres) {
      this.mobilePres.is3dOpen = false;
      const box3d = document.getElementById('mob-3d-view-box');
      if (box3d) box3d.style.display = 'none';
      const toggle3dBtn = document.getElementById('mob-btn-toggle-3d');
      if (toggle3dBtn) toggle3dBtn.textContent = '🌐 Open 3D Map View';
      this.mobilePres.switchMobileView('solver');
      this.mobilePres.activePaperId = paperId;
      this.mobilePres.renderExamSolver();
    }
    this.switchView('solver');
    this.renderPaperTabs();
    this.renderActivePaper();
  }

  filterUniverse(category) {
    this.sfx.playPop();
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === category);
    });

    if (this.threeUniverse) {
      this.threeUniverse.filterCategory(category);
    }
  }

  /* ---------------- Slides View ---------------- */
  initSlidesView() {
    this.renderCurrentSlide();

    document.getElementById('btn-slide-prev')?.addEventListener('click', () => {
      this.prevSlide();
    });

    document.getElementById('btn-slide-next')?.addEventListener('click', () => {
      this.nextSlide();
    });

    document.getElementById('btn-slide-fullscreen')?.addEventListener('click', () => {
      this.toggleSlideFullscreen();
    });
  }

  prevSlide() {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.slideDeck.prev();
    this.renderCurrentSlide();
  }

  nextSlide() {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.slideDeck.next();
    this.renderCurrentSlide();
  }

  jumpToSlide(index) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.slideDeck.jumpTo(index);
    this.renderCurrentSlide();
  }

  setSlideArtMode(mode) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.slideDeck.setArtMode(mode);
    this.renderCurrentSlide();
  }

  toggleSlideFullscreen() {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    const el = document.getElementById('view-slides');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el) {
      el.requestFullscreen().catch(() => {});
    }
  }

  renderCurrentSlide() {
    const container = document.getElementById('slide-deck-container');
    const slide = this.slideDeck.getCurrentSlide();
    const idx = this.slideDeck.getCurrentIndex();
    const total = this.slideDeck.getTotalSlides();

    if (container && slide) {
      container.innerHTML = this.slideDeck.renderSlideHTML(slide, this.slideDeck.getArtMode());

      // Attach 3D physics tilt and floating golden starlight particle canvas
      const imgContainer = container.querySelector('.slide-img-container');
      if (imgContainer && this.motionGraphics) {
        this.motionGraphics.attach3DTilt(imgContainer);
        this.motionGraphics.attachParticleCanvas(imgContainer);
      }

      // Smoothly scroll active thumbnail pill into view
      setTimeout(() => {
        const activeThumb = container.querySelector('.slide-thumb-pill.active');
        if (activeThumb) {
          activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 50);
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
    if (strip) {
      strip.innerHTML = CHAPTERS_DATA.map(ch => `
        <button class="ch-btn-pill ${ch.number === this.activeChapter ? 'active' : ''}" onclick="window.app.selectClassroomChapter(${ch.number})">
          ⭐ Ch ${ch.number}
        </button>
      `).join('');
    }

    const chList = document.getElementById('classroom-ch-list');
    if (chList) {
      chList.innerHTML = CHAPTERS_DATA.map(ch => `
        <button class="classroom-ch-sidebar-item ${ch.number === this.activeChapter ? 'active' : ''}" onclick="window.app.selectClassroomChapter(${ch.number})">
          <span class="ch-item-badge">${ch.number}</span>
          <span class="ch-item-name">${ch.titleEng}</span>
        </button>
      `).join('');
    }
  }

  setStoryTab(tab) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.classroom.setActiveTab(tab);
    this.renderClassroomLesson(this.activeChapter);
  }

  selectClassroomChapter(chNum) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    this.activeChapter = chNum;
    this.renderChapterSelectorStrip();
    this.renderClassroomLesson(chNum);
    this.orchestrator.processPrompt({ intent: 'story', chapterNumber: chNum });
  }

  renderClassroomLesson(chNum) {
    const container = document.getElementById('classroom-lesson-container');
    if (!container) return;
    const lesson = this.classroom.getLesson(chNum);
    container.innerHTML = this.classroom.renderLessonCard(lesson, this.classroom.getActiveTab());

    // Attach 3D physics tilt and floating particle canvas to lesson banner
    const bannerArt = container.querySelector('.lesson-banner-art');
    if (bannerArt && this.motionGraphics) {
      this.motionGraphics.attach3DTilt(bannerArt);
      this.motionGraphics.attachParticleCanvas(bannerArt);
    }
  }

  awardStar(chNum) {
    this.addStar(1);
    this.showToast(`⭐ Golden Star collected for Chapter ${chNum}!`, '⭐');
  }

  /* ---------------- Shared Audio Player Controller ---------------- */
  playChapterAudio(chNum, lang = 'mal') {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    const ch = CHAPTERS_DATA.find(c => c.number === Number(chNum)) || this.slideDeck.getCurrentSlide();
    if (!ch) return;

    const audioUrl = lang === 'mal' ? ch.audioUrlMal : ch.audioUrlEng;
    this.activeAudioChapter = ch.number;
    this.activeAudioLang = lang;

    // Update button states in visible audio bars
    document.querySelectorAll('.shared-audio-bar').forEach(bar => {
      const malBtn = bar.querySelector('.btn-audio-mal');
      const engBtn = bar.querySelector('.btn-audio-eng');
      const playBtn = bar.querySelector('.btn-audio-play-pause');
      if (malBtn) malBtn.classList.toggle('active', lang === 'mal');
      if (engBtn) engBtn.classList.toggle('active', lang === 'eng');
      if (playBtn) playBtn.textContent = '⏸';
    });

    if (audioUrl) {
      const audioEl = this.voiceover.playStaticAudio(audioUrl, () => {
        this.resetAudioPlayerUI();
      }, () => {
        this.resetAudioPlayerUI();
      });

      if (audioEl) {
        audioEl.ontimeupdate = () => {
          this.updateAudioProgressUI(audioEl.currentTime, audioEl.duration);
        };
      }
    } else {
      // Fallback to Web Speech
      if (lang === 'mal') {
        this.speakMalayalam(`അദ്ധ്യായം ${ch.number}: ${ch.titleMal}. ${ch.story5yoMal || ''}`);
      } else {
        this.speakText(`${ch.titleEng}. ${ch.story5yo}`);
      }
    }
  }

  togglePlayPause(chNum) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    const currentAudio = this.voiceover.currentAudioElement;

    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      document.querySelectorAll('.btn-audio-play-pause').forEach(b => b.textContent = '▶');
    } else if (currentAudio && currentAudio.paused) {
      currentAudio.play().catch(() => {});
      document.querySelectorAll('.btn-audio-play-pause').forEach(b => b.textContent = '⏸');
    } else {
      this.playChapterAudio(chNum || this.activeChapter || 1, this.activeAudioLang || 'mal');
    }
  }

  seekAudio(e) {
    const currentAudio = this.voiceover.currentAudioElement;
    if (!currentAudio || !currentAudio.duration) return;

    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    currentAudio.currentTime = pct * currentAudio.duration;
  }

  updateAudioProgressUI(currentTime, duration) {
    const dur = (duration && isFinite(duration) && duration > 0) ? duration : 38;
    const pct = Math.min(100, (currentTime / dur) * 100);
    const formatTime = (sec) => {
      if (isNaN(sec) || !isFinite(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    document.querySelectorAll('.audio-progress-fill').forEach(fill => {
      fill.style.width = `${pct}%`;
    });
    document.querySelectorAll('.audio-time-display').forEach(disp => {
      disp.textContent = `${formatTime(currentTime)} / ${formatTime(dur)}`;
    });
  }

  resetAudioPlayerUI() {
    document.querySelectorAll('.btn-audio-play-pause').forEach(b => b.textContent = '▶');
    document.querySelectorAll('.audio-progress-fill').forEach(fill => fill.style.width = '0%');
    document.querySelectorAll('.audio-lang-pills .btn-audio-pill').forEach(b => b.classList.remove('active'));
  }

  stopVoice() {
    this.voiceover.stop();
    this.resetAudioPlayerUI();
    if (this.motionCanvas) this.motionCanvas.setAudioActive(false);
    this.showToast('🔇 Audio Stopped', '🛑');
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
      <button class="paper-tile-btn ${paper.id === this.activePaperId ? 'active' : ''}" onclick="window.app.switchPaper('${paper.id}')">
        <span class="paper-tile-year">${paper.year}</span>
        <span class="paper-tile-sem">Semester ${paper.semester}</span>
        <span class="paper-tile-marks">${paper.totalMarks} Marks</span>
      </button>
    `).join('');
  }

  switchPaper(paperId) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
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
      container.innerHTML = `
        <div class="glass-panel text-center p-4 solver-no-results">
          <p>No matching exam questions found for "<strong>${term}</strong>".</p>
          <button class="btn-primary-gold-pill" onclick="document.getElementById('solver-search-input').value=''; window.app.renderActivePaper();">
            Clear Search
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="solver-search-results-banner">
        <h3>Found ${matches.length} matching questions across all 5 papers:</h3>
      </div>
      <div class="solver-questions-list">
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
    if (this.sfx && this.sfx.playSparkle) this.sfx.playSparkle();
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
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    const result = this.quiz.answerByIndex(index);

    if (result.correct) {
      if (this.sfx && this.sfx.playChime) this.sfx.playChime();
      this.addStar(1);
      if (this.heroAtmosphere) {
        this.heroAtmosphere.spawnBurst(undefined, undefined, 30);
      }
    } else {
      if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    }

    this.renderQuiz();
    this.orchestrator.logTrace('Quizmaster', 'Answer Evaluated', `Child selected option ${index + 1}. Correct: ${result.correct}`);
  }

  nextQuizQuestion() {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
    const hasNext = this.quiz.nextQuestion();
    if (!hasNext) {
      if (this.sfx && this.sfx.playCheer) this.sfx.playCheer();
    }
    this.renderQuiz();
  }

  showQuizHint() {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();
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
      if (this.sfx && this.sfx.playPop) this.sfx.playPop();
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

  playVoice(lang = 'mal', chNumber = 1) {
    if (this.sfx && this.sfx.playPop) this.sfx.playPop();

    // Stop any existing playback first to prevent overlapping tracks
    this.stopVoice();

    // Normalize chapter number: could be 1, "1", "ch1"
    let num = 1;
    if (typeof chNumber === 'number') {
      num = chNumber;
    } else if (typeof chNumber === 'string') {
      num = parseInt(chNumber.replace(/\D/g, ''), 10) || 1;
    }

    const ch = CHAPTERS_DATA.find(c => c.number === num) || CHAPTERS_DATA[0];
    if (!ch) return;

    const isEng = (lang === 'eng' || lang === 'english');
    const isLesson = (lang === 'lesson');
    const audioUrl = isEng ? ch.audioUrlEng : ch.audioUrlMal;
    const langLabel = isEng ? 'English' : 'മലയാളം';

    const indicator = document.getElementById('audio-indicator');
    if (indicator) indicator.textContent = `🔊 Playing Ch ${ch.number} (${langLabel})`;
    if (this.motionCanvas) this.motionCanvas.setAudioActive(true);

    if (isLesson) {
      const lessonText = `അദ്ധ്യായം ${ch.number}: ${ch.titleMal}. സുവർണ്ണ പാഠം: ${ch.moralLessonMal || ch.moralLesson}.`;
      this.speakMalayalam(lessonText);
      return;
    }

    if (audioUrl) {
      this.voiceover.playStaticAudio(audioUrl, () => {
        if (this.motionCanvas) this.motionCanvas.setAudioActive(false);
        if (indicator) indicator.textContent = '🔇 Audio Ready';
      }, (err) => {
        console.warn('Audio playback issue, trying speech fallback:', err);
        if (isEng) {
          this.speakText(`${ch.titleEng}. ${ch.story5yo} Golden rule: ${ch.moralLesson}`);
        } else {
          this.speakMalayalam(`അദ്ധ്യായം ${ch.number}: ${ch.titleMal}. ${ch.story5yoMal || ch.story5yo}`);
        }
      });
    } else {
      if (isEng) {
        this.speakText(`${ch.titleEng}. ${ch.story5yo} Golden rule: ${ch.moralLesson}`);
      } else {
        this.speakMalayalam(`അദ്ധ്യായം ${ch.number}: ${ch.titleMal}. ${ch.story5yoMal || ch.story5yo}`);
      }
    }
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
