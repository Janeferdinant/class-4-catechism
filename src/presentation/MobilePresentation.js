import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { EXAM_PAPERS_DATA } from '../data/examPapersData.js';

/**
 * MobilePresentation
 * Dedicated mobile presentation layer for Class 4 Catechism.
 * Renders touch-optimized, single-column views with high visual appeal,
 * large touch targets (>= 48px), and bottom navigation.
 */
export class MobilePresentation {
  constructor(app) {
    this.app = app;
    this.currentView = 'universe';
    this.activeChapter = 1;
    this.activePaperId = '2025_s1';
    this.currentQuizIndex = 0;
    this.is3dOpen = false;
  }

  init() {
    if (typeof document === 'undefined') return;
    this.setupBottomNav();
    this.setupMobileHeader();
    this.renderChapterDeck();
    this.renderSlidesView();
    this.renderStoryClassroomView();
    this.renderExamSolverView();
    this.renderQuizView();
  }

  setupBottomNav() {
    const navButtons = document.querySelectorAll('.mob-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.app?.sfx?.playPop) this.app.sfx.playPop();
        const targetView = btn.getAttribute('data-mob-view');
        this.switchMobileView(targetView);
      });
    });
  }

  setupMobileHeader() {
    const menuBtn = document.getElementById('mob-btn-menu');
    const sheet = document.getElementById('mobile-settings-sheet');
    if (menuBtn && sheet) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.app?.sfx?.playPop) this.app.sfx.playPop();
        sheet.classList.add('active');
        sheet.style.display = 'block';
        sheet.setAttribute('aria-hidden', 'false');
      });
    }

    const toggle3dBtn = document.getElementById('mob-btn-toggle-3d');
    const box3d = document.getElementById('mob-3d-view-box');
    if (toggle3dBtn && box3d) {
      toggle3dBtn.addEventListener('click', () => {
        this.is3dOpen = !this.is3dOpen;
        box3d.style.display = this.is3dOpen ? 'block' : 'none';
        toggle3dBtn.textContent = this.is3dOpen ? '❌ Close 3D Map' : '🌐 Open 3D Map View';
        if (this.is3dOpen && this.app?.threeUniverse) {
          const container = document.getElementById('mob-three-container');
          if (container && this.app.threeUniverse.renderer) {
            container.appendChild(this.app.threeUniverse.renderer.domElement);
          }
        }
      });
    }
  }

  switchMobileView(viewName) {
    this.currentView = viewName;
    if (this.app) {
      this.app.currentView = viewName;
    }
    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mob-view') === viewName);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${viewName}`);
    });
    document.querySelectorAll('.mob-view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `mob-view-${viewName}`);
    });

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  updateStars(count) {
    const el = document.getElementById('mob-header-star-count');
    if (el) el.textContent = `${count}`;
  }

  /* ---------------- View 1: Chapter Deck ---------------- */
  renderChapterDeck() {
    const container = document.getElementById('mob-chapter-cards-grid');
    if (!container) return;

    container.innerHTML = CHAPTERS_DATA.map(ch => `
      <div class="mob-ch-card glass-panel" data-ch="${ch.id}">
        <div class="mob-ch-thumb-wrap">
          <img src="${ch.imagePrompt}" alt="${ch.titleEng}" class="mob-ch-thumb" loading="lazy" />
          <span class="mob-ch-badge">Ch ${ch.id}</span>
        </div>
        <div class="mob-ch-info">
          <h4 class="mob-ch-title-mal">${ch.titleMal}</h4>
          <p class="mob-ch-title-eng">${ch.titleEng}</p>
          <div class="mob-ch-actions">
            <button class="mob-btn-listen" onclick="window.app.playVoice('chapter', ${ch.id})">
              🔊 കേൾക്കുക (Listen)
            </button>
            <button class="mob-btn-open-lesson" onclick="window.mobileApp.jumpToChapterLesson(${ch.id})">
              📖 പാഠം (Story)
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ---------------- View 2: Picture Slides ---------------- */
  renderSlidesView() {
    const container = document.getElementById('mob-slide-card-container');
    if (!container) return;

    const ch = CHAPTERS_DATA.find(c => c.id === this.activeChapter) || CHAPTERS_DATA[0];

    container.innerHTML = `
      <div class="mob-slide-hero">
        <img src="${ch.imagePrompt}" alt="${ch.titleEng}" class="mob-slide-img" />
        <div class="mob-slide-indicator">Chapter ${ch.id} of 15</div>
      </div>
      <div class="mob-slide-content">
        <h3 class="mob-slide-title-mal">${ch.titleMal}</h3>
        <p class="mob-slide-title-eng">${ch.titleEng}</p>
        <div class="mob-slide-story-box">
          <p class="mob-slide-story-text">${ch.story5yoMal || ch.storyEng}</p>
        </div>
        <div class="mob-slide-audio-cta">
          <button class="mob-btn-big-audio" onclick="window.app.playVoice('chapter', ${ch.id})">
            🔊 മലയാളം കഥ കേൾക്കൂ (Play Natural Voice)
          </button>
        </div>
        <div class="mob-slide-nav-row">
          <button class="mob-slide-nav-btn" onclick="window.mobileApp.prevSlide()" ${ch.id === 1 ? 'disabled' : ''}>
            ◀ മുമ്പത്തേത് (Prev)
          </button>
          <span class="mob-slide-counter">${ch.id} / 15</span>
          <button class="mob-slide-nav-btn" onclick="window.mobileApp.nextSlide()" ${ch.id === 15 ? 'disabled' : ''}>
            അടുത്തത് (Next) ▶
          </button>
        </div>
      </div>
    `;
  }

  nextSlide() {
    if (this.activeChapter < 15) {
      this.activeChapter++;
      this.renderSlidesView();
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    }
  }

  prevSlide() {
    if (this.activeChapter > 15) {
      this.activeChapter--;
      this.renderSlidesView();
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    }
  }

  /* ---------------- View 3: Story Lessons ---------------- */
  renderStoryClassroomView() {
    const strip = document.getElementById('mob-story-strip-container');
    const card = document.getElementById('mob-story-lesson-card');
    if (!strip || !card) return;

    strip.innerHTML = `
      <div class="mob-pill-scroll">
        ${CHAPTERS_DATA.map(ch => `
          <button class="mob-chapter-pill ${ch.id === this.activeChapter ? 'active' : ''}" onclick="window.mobileApp.jumpToChapterLesson(${ch.id})">
            Ch ${ch.id}
          </button>
        `).join('')}
      </div>
    `;

    const ch = CHAPTERS_DATA.find(c => c.id === this.activeChapter) || CHAPTERS_DATA[0];

    card.innerHTML = `
      <div class="mob-lesson-header">
        <span class="mob-lesson-badge">പാഠം ${ch.id}</span>
        <h2 class="mob-lesson-heading-mal">${ch.titleMal}</h2>
        <p class="mob-lesson-heading-eng">${ch.titleEng}</p>
      </div>
      <div class="mob-lesson-image-wrap">
        <img src="${ch.imagePrompt}" alt="${ch.titleEng}" class="mob-lesson-banner-img" />
      </div>
      <div class="mob-lesson-section">
        <h4 class="mob-sec-label">🌟 കുഞ്ഞു കഥ (5-Year-Old Story)</h4>
        <p class="mob-sec-body">${ch.story5yoMal}</p>
        <button class="mob-btn-section-audio" onclick="window.app.playVoice('story', ${ch.id})">
          🔊 കഥ കേൾക്കാം (Listen to Story)
        </button>
      </div>
      <div class="mob-lesson-section highlight">
        <h4 class="mob-sec-label">❤️ നമ്മൾ പഠിക്കേണ്ട കാര്യം (Golden Rule)</h4>
        <p class="mob-sec-body">${ch.moralLessonMal}</p>
        <button class="mob-btn-section-audio" onclick="window.app.playVoice('lesson', ${ch.id})">
          🌟 പാഠം കേൾക്കാം (Listen)
        </button>
      </div>
      <div class="mob-lesson-section">
        <h4 class="mob-sec-label">📖 ദൈവവചനം (Scripture)</h4>
        <blockquote class="mob-scripture-quote">"${ch.verseMal}"</blockquote>
        <p class="mob-scripture-ref">— ${ch.verseRef}</p>
      </div>
    `;
  }

  jumpToChapterLesson(chId) {
    this.activeChapter = chId;
    this.renderStoryClassroomView();
    this.renderSlidesView();
    this.switchMobileView('classroom');
  }

  /* ---------------- View 4: Exam Solver ---------------- */
  renderExamSolverView() {
    const strip = document.getElementById('mob-paper-selector-strip');
    const list = document.getElementById('mob-exam-questions-list');
    const searchInput = document.getElementById('mob-solver-search-input');
    if (!strip || !list) return;

    strip.innerHTML = `
      <div class="mob-pill-scroll">
        ${EXAM_PAPERS_DATA.map(p => `
          <button class="mob-paper-pill ${p.id === this.activePaperId ? 'active' : ''}" onclick="window.mobileApp.selectExamPaper('${p.id}')">
            ${p.year} (${p.semester})
          </button>
        `).join('')}
      </div>
    `;

    const paper = EXAM_PAPERS_DATA.find(p => p.id === this.activePaperId) || EXAM_PAPERS_DATA[0];
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const questions = query 
      ? paper.questions.filter(q => (q.qMal && q.qMal.toLowerCase().includes(query)) || (q.ansMal && q.ansMal.toLowerCase().includes(query)))
      : paper.questions;

    list.innerHTML = `
      <div class="mob-paper-meta-card glass-panel">
        <h4>${paper.title}</h4>
        <p>Total Marks: ${paper.totalMarks} • Verified Diocesan Solution</p>
      </div>
      <div class="mob-questions-accordion">
        ${questions.map((q, idx) => `
          <details class="mob-q-details glass-panel" ${idx === 0 ? 'open' : ''}>
            <summary class="mob-q-summary">
              <span class="mob-q-number">Q${q.num}</span>
              <span class="mob-q-text-mal">${q.qMal}</span>
              <span class="mob-q-marks">${q.marks} marks</span>
            </summary>
            <div class="mob-q-answer-body">
              <div class="mob-ans-label">✅ Verified Answer (ഉത്തരം):</div>
              <p class="mob-ans-mal">${q.ansMal}</p>
              <div class="mob-citation-row">
                <span class="mob-citation-tag">📖 Ch ${q.citation?.chapter}: ${q.citation?.topic}</span>
              </div>
            </div>
          </details>
        `).join('')}
      </div>
    `;

    if (searchInput && !searchInput._bound) {
      searchInput._bound = true;
      searchInput.addEventListener('input', () => this.renderExamSolverView());
    }
  }

  selectExamPaper(paperId) {
    this.activePaperId = paperId;
    this.renderExamSolverView();
  }

  /* ---------------- View 5: Star Quizzes ---------------- */
  renderQuizView() {
    const container = document.getElementById('mob-quiz-card-container');
    if (!container) return;

    const questions = this.app?.quiz?.questions || [
      {
        q: "ആരാണ് സഭയുടെ തലവൻ? (Who is the Head of the Church?)",
        options: ["യേശുക്രിസ്തു (Jesus Christ)", "മാർപാപ്പ (The Pope)", "പത്രോസ് (Peter)", "യോഹന്നാൻ (John)"],
        correct: 0,
        explanation: "യേശുക്രിസ്തുവാണ് സഭയുടെ അദൃശ്യ തലവൻ. (Jesus Christ is the Head of the Church - Col 1:18)"
      },
      {
        q: "ആദ്യത്തെ കൂദാശ ഏതാണ്? (Which is the First Sacrament?)",
        options: ["മാമ്മോദീസാ (Baptism)", "കുർബാന (Holy Eucharist)", "സ്ഥൈര്യലേപനം (Confirmation)", "വിവാഹം (Matrimony)"],
        correct: 0,
        explanation: "മാമ്മോദീസാ ക്രൈസ്തവ ജീവിതത്തിന്റെ വാതിലാണ്. (Baptism is the gateway to Christian life)"
      }
    ];

    const q = questions[this.currentQuizIndex % questions.length];

    container.innerHTML = `
      <div class="mob-quiz-header">
        <span class="mob-quiz-badge">Question ${(this.currentQuizIndex % questions.length) + 1} of ${questions.length}</span>
        <span class="mob-quiz-star-indicator">⭐ Collected: ${this.app?.starsCount || 0}</span>
      </div>
      <h3 class="mob-quiz-question">${q.q}</h3>
      <div class="mob-quiz-options-list">
        ${q.options.map((opt, i) => `
          <button class="mob-quiz-option-btn" onclick="window.mobileApp.handleQuizAnswer(${i}, ${q.correct})">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="mob-quiz-feedback" class="mob-quiz-feedback" style="display: none;"></div>
    `;
  }

  handleQuizAnswer(selectedIndex, correctIndex) {
    const feedback = document.getElementById('mob-quiz-feedback');
    if (!feedback) return;

    if (selectedIndex === correctIndex) {
      if (this.app?.sfx?.playFanfare) this.app.sfx.playFanfare();
      if (this.app?.addStar) this.app.addStar();
      this.updateStars(this.app?.starsCount || 0);

      feedback.style.display = 'block';
      feedback.className = 'mob-quiz-feedback success';
      feedback.innerHTML = `
        🎉 മിടുക്കൻ / മിടുക്കി! Correct Answer! +1 Star ⭐
        <button class="mob-btn-next-quiz" onclick="window.mobileApp.nextQuizQuestion()">Next Question ▶</button>
      `;
    } else {
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
      feedback.style.display = 'block';
      feedback.className = 'mob-quiz-feedback error';
      feedback.innerHTML = `
        ❌ ശ്രമിക്കൂ! ഒന്നുകൂടി നോക്കൂ (Try Again!)
      `;
    }
  }

  nextQuizQuestion() {
    this.currentQuizIndex++;
    this.renderQuizView();
  }
}
