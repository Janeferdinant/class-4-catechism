import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { EXAM_PAPERS_DATA } from '../data/examPapersData.js';
import { KID_QUIZ_QUESTIONS } from '../data/quizQuestionsData.js';

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
    this.slideArtMode = 'pixar';
    this.activeStoryTab = 'story';
    if (typeof window !== 'undefined') {
      window.mobileApp = this;
    }
  }

  init() {
    if (typeof document === 'undefined') return;
    if (typeof window !== 'undefined') {
      window.mobileApp = this;
    }
    this.setupBottomNav();
    this.setupMobileHeader();
    this.renderChapterDeck();
    this.renderSlidesView();
    this.renderStoryClassroomView();
    this.renderExamSolverView();
    this.renderQuizView();
  }

  setupBottomNav() {
    const navButtons = typeof document !== 'undefined' && document.querySelectorAll 
      ? Array.from(document.querySelectorAll('.mob-nav-btn')) 
      : [];
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
        if (this.app?.toggleSettingsPopup) {
          this.app.toggleSettingsPopup();
        } else {
          const isOpen = sheet.classList.contains('active');
          if (isOpen) {
            sheet.classList.remove('active');
            sheet.style.display = 'none';
            sheet.setAttribute('aria-hidden', 'true');
            menuBtn.classList.remove('gear-active');
          } else {
            sheet.classList.add('active');
            sheet.style.display = 'block';
            sheet.setAttribute('aria-hidden', 'false');
            menuBtn.classList.add('gear-active');
          }
        }
      });
    }

    const themeBtn = document.getElementById('mob-btn-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (this.app?.sfx?.playPop) this.app.sfx.playPop();
        const nextTheme = (this.app?.currentTheme || 'light') === 'dark' ? 'light' : 'dark';
        if (this.app?.setTheme) {
          this.app.setTheme(nextTheme);
        }
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
            this.app.threeUniverse.attachToContainer(container);
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
      <div class="mob-ch-card glass-panel" data-ch="${ch.number}">
        <div class="mob-ch-thumb-wrap">
          <img src="${ch.imageUrl}" alt="${ch.titleEng}" class="mob-ch-thumb" loading="lazy" />
          <span class="mob-ch-badge">Ch ${ch.number}</span>
        </div>
        <div class="mob-ch-info">
          <h4 class="mob-ch-title-mal">${ch.titleMal}</h4>
          <p class="mob-ch-title-eng">${ch.titleEng}</p>
          <div class="mob-ch-actions">
            <button class="mob-btn-audio-pill mal" onclick="window.app.playVoice('mal', ${ch.number})" title="Listen in Malayalam">
              🔊 മലയാളം
            </button>
            <button class="mob-btn-audio-pill eng" onclick="window.app.playVoice('eng', ${ch.number})" title="Listen in English">
              🔊 English
            </button>
            <button class="mob-btn-open-lesson" onclick="window.mobileApp.jumpToChapterLesson(${ch.number})">
              📖 പാഠം
            </button>
          </div>
        </div>
      </div>
    `).join('') + `
      <div class="mob-mentor-banner glass-panel">
        <span class="mob-mentor-icon">🎓</span>
        <div class="mob-mentor-details">
          <span class="mob-mentor-role">Academic Mentor</span>
          <h4 class="mob-mentor-name">Asst. Prof. Jane Rose</h4>
          <p class="mob-mentor-dept">Department of Computer Science & Engineering (CSE)</p>
        </div>
      </div>
    `;
  }

  /* ---------------- View 2: Picture Slides (Mockup 10) ---------------- */
  renderSlidesView() {
    const container = document.getElementById('mob-slide-card-container');
    if (!container) return;

    const ch = CHAPTERS_DATA.find(c => c.number === this.activeChapter) || CHAPTERS_DATA[0];
    const isTextbook = this.slideArtMode === 'textbook';
    const currentImg = isTextbook ? ch.textbookUrl : ch.imageUrl;

    container.innerHTML = `
      <div class="mob-screen-top-nav">
        <button class="mob-btn-back-link" onclick="window.mobileApp.switchMobileView('universe')">
          ‹ Back to Map
        </button>
        <span class="mob-screen-header-title">Picture Slides</span>
      </div>

      <div class="mob-slide-hero">
        <div class="mob-slide-frame-container">
          <img id="mob-slide-hero-img" src="${currentImg}" alt="${ch.titleEng}" class="mob-slide-img" />
          <button class="mob-slide-overlay-arrow prev" onclick="window.mobileApp.prevSlide()" ${ch.number === 1 ? 'disabled' : ''} aria-label="Previous Slide">‹</button>
          <button class="mob-slide-overlay-arrow next" onclick="window.mobileApp.nextSlide()" ${ch.number === 15 ? 'disabled' : ''} aria-label="Next Slide">›</button>
          <div class="mob-slide-counter-chip">${ch.number} / 15</div>
        </div>
        <div class="mob-slide-badge-row">
          <span class="mob-slide-indicator">Chapter ${ch.number} of 15</span>
          <button class="mob-btn-art-toggle" onclick="window.mobileApp.toggleSlideArtMode()">
            🔄 ${isTextbook ? 'Show 3D Art 🖼️' : 'Show Textbook Scan 📖'}
          </button>
        </div>
      </div>

      <div class="mob-slide-content">
        <h3 class="mob-slide-title-serif">${ch.titleEng}</h3>
        <p class="mob-slide-title-mal">${ch.titleMal}</p>

        <!-- Horizontal Thumbnail Strip (Mockup 10) -->
        <div class="mob-slide-thumb-strip">
          ${CHAPTERS_DATA.map(c => `
            <button class="mob-thumb-item ${c.number === ch.number ? 'active' : ''}" onclick="window.mobileApp.jumpToSlide(${c.number})" title="Slide ${c.number}">
              <img src="${c.imageUrl}" alt="Ch ${c.number}" class="mob-thumb-img" loading="lazy" />
              <span class="mob-thumb-num">${c.number}</span>
            </button>
          `).join('')}
        </div>

        <div class="mob-slide-story-box">
          <p class="mob-slide-story-text">${ch.story5yoMal || ch.story5yo}</p>
        </div>

        <div class="mob-slide-audio-cta">
          <button class="mob-btn-big-audio mal" onclick="window.app && window.app.playVoice ? window.app.playVoice('mal', ${ch.number}) : (window.app && window.app.playChapterAudio && window.app.playChapterAudio(${ch.number}, 'mal'))">
            🔊 മലയാളം കഥ കേൾക്കൂ (Play Malayalam Audio)
          </button>
          <button class="mob-btn-big-audio eng" onclick="window.app && window.app.playVoice ? window.app.playVoice('eng', ${ch.number}) : (window.app && window.app.playChapterAudio && window.app.playChapterAudio(${ch.number}, 'eng'))">
            🔊 English Story Narration (Play English Audio)
          </button>
          <button class="mob-btn-stop-audio-pill" onclick="window.app && window.app.stopVoice && window.app.stopVoice()">
            🛑 Stop Audio (ഓഡിയോ നിർത്തുക)
          </button>
        </div>

        <div class="mob-slide-nav-row">
          <button class="mob-slide-nav-btn" onclick="window.mobileApp.prevSlide()" ${ch.number === 1 ? 'disabled' : ''}>
            ◀ Prev
          </button>
          <span class="mob-slide-counter">${ch.number} / 15</span>
          <button class="mob-slide-nav-btn" onclick="window.mobileApp.nextSlide()" ${ch.number === 15 ? 'disabled' : ''}>
            Next ▶
          </button>
        </div>

        <div class="mob-tab-mentor-footer">
          Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
        </div>
      </div>
    `;
  }

  jumpToSlide(chNum) {
    this.activeChapter = Number(chNum) || 1;
    if (this.app) this.app.activeChapter = this.activeChapter;
    this.renderSlidesView();
    if (this.app?.sfx?.playPop) this.app.sfx.playPop();
  }

  toggleSlideArtMode() {
    this.slideArtMode = this.slideArtMode === 'textbook' ? 'pixar' : 'textbook';
    if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    const ch = CHAPTERS_DATA.find(c => c.number === this.activeChapter) || CHAPTERS_DATA[0];
    const imgEl = document.getElementById('mob-slide-hero-img');
    if (imgEl && ch) {
      imgEl.style.transition = 'opacity 0.25s ease';
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = this.slideArtMode === 'textbook' ? ch.textbookUrl : ch.imageUrl;
        imgEl.style.opacity = '1';
        this.renderSlidesView();
      }, 250);
    } else {
      this.renderSlidesView();
    }
  }

  nextSlide() {
    if (this.activeChapter < 15) {
      this.activeChapter++;
      if (this.app) this.app.activeChapter = this.activeChapter;
      this.renderSlidesView();
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    }
  }

  prevSlide() {
    if (this.activeChapter > 1) {
      this.activeChapter--;
      if (this.app) this.app.activeChapter = this.activeChapter;
      this.renderSlidesView();
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    }
  }

  /* ---------------- View 3: Story Lessons (Mockup 09) ---------------- */
  renderStoryClassroomView() {
    const strip = document.getElementById('mob-story-strip-container');
    const card = document.getElementById('mob-story-lesson-card');
    if (!strip || !card) return;

    strip.innerHTML = `
      <div class="mob-pill-scroll">
        ${CHAPTERS_DATA.map(ch => `
          <button class="mob-chapter-pill ${ch.number === this.activeChapter ? 'active' : ''}" onclick="window.mobileApp.jumpToChapterLesson(${ch.number})">
            Ch ${ch.number}
          </button>
        `).join('')}
      </div>
    `;

    const ch = CHAPTERS_DATA.find(c => c.number === this.activeChapter) || CHAPTERS_DATA[0];
    const currentTab = this.activeStoryTab || 'story';

    let tabBodyHtml = '';
    if (currentTab === 'moral') {
      tabBodyHtml = `
        <div class="mob-lesson-section highlight">
          <h4 class="mob-sec-label">🌟 Moral Lesson (സുവർണ്ണ പാഠം)</h4>
          <p class="mob-sec-body">${ch.moralLesson}</p>
          <div class="mob-mal-card"><p class="mob-mal-text">${ch.moralLessonMal}</p></div>
          <button class="mob-btn-section-audio moral" onclick="window.app && window.app.playVoice ? window.app.playVoice('lesson', ${ch.number}) : (window.app && window.app.playChapterAudio && window.app.playChapterAudio(${ch.number}, 'mal'))">
            🌟 സുവർണ്ണ പാഠം കേൾക്കാം (Listen to Lesson)
          </button>
        </div>
      `;
    } else if (currentTab === 'concepts') {
      tabBodyHtml = `
        <div class="mob-lesson-section">
          <h4 class="mob-sec-label">💡 Key Concepts (പ്രധാന ആശയങ്ങൾ)</h4>
          <div class="mob-concepts-list">
            ${(ch.keyConcepts || []).map(c => `
              <div class="mob-concept-item">
                <strong class="mob-concept-title">${c.termEng} <span class="mob-concept-mal">(${c.termMal})</span></strong>
                <p class="mob-concept-desc">${c.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (currentTab === 'scripture') {
      tabBodyHtml = `
        <div class="mob-lesson-section">
          <h4 class="mob-sec-label">📖 Holy Scripture (വിശുദ്ധ വേദപുസ്തകം)</h4>
          <blockquote class="mob-scripture-quote">"${ch.scriptureEng || ''}"</blockquote>
          <div class="mob-mal-card">
            <blockquote class="mob-scripture-quote-mal">"${ch.scripture || ''}"</blockquote>
          </div>
        </div>
      `;
    } else {
      // 'story'
      tabBodyHtml = `
        <div class="mob-lesson-section">
          <h4 class="mob-sec-label">🌟 Faith Story (കുഞ്ഞു കഥ)</h4>
          <p class="mob-sec-body">${ch.story5yo}</p>
          <div class="mob-mal-card"><p class="mob-mal-text">${ch.story5yoMal}</p></div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="mob-screen-top-nav">
        <button class="mob-btn-back-link" onclick="window.mobileApp.switchMobileView('universe')">
          ‹ Back to Map
        </button>
        <span class="mob-screen-header-title">Story Lessons</span>
      </div>

      <div class="mob-lesson-header">
        <span class="mob-lesson-badge">Chapter ${ch.number}</span>
        <h2 class="mob-lesson-heading-serif">${ch.titleEng}</h2>
        <p class="mob-lesson-heading-mal">${ch.titleMal}</p>
      </div>

      <div class="mob-lesson-image-wrap">
        <img src="${ch.imageUrl}" alt="${ch.titleEng}" class="mob-lesson-banner-img" />
      </div>

      <!-- 4 Tab Pills (Mockup 09) -->
      <div class="mob-story-tabs-row" role="tablist">
        <button class="mob-tab-pill ${currentTab === 'story' ? 'active' : ''}" onclick="window.mobileApp.switchStoryTab('story')">Story</button>
        <button class="mob-tab-pill ${currentTab === 'moral' ? 'active' : ''}" onclick="window.mobileApp.switchStoryTab('moral')">Moral</button>
        <button class="mob-tab-pill ${currentTab === 'concepts' ? 'active' : ''}" onclick="window.mobileApp.switchStoryTab('concepts')">Key Points</button>
        <button class="mob-tab-pill ${currentTab === 'scripture' ? 'active' : ''}" onclick="window.mobileApp.switchStoryTab('scripture')">Scripture</button>
      </div>

      <div class="mob-story-tab-body">
        ${tabBodyHtml}
      </div>

      <div class="mob-lesson-audio-row">
        <button class="mob-btn-section-audio mal" onclick="window.app && window.app.playVoice ? window.app.playVoice('mal', ${ch.number}) : (window.app && window.app.playChapterAudio && window.app.playChapterAudio(${ch.number}, 'mal'))">
          🔊 മലയാളം കഥ (Malayalam Audio)
        </button>
        <button class="mob-btn-section-audio eng" onclick="window.app && window.app.playVoice ? window.app.playVoice('eng', ${ch.number}) : (window.app && window.app.playChapterAudio && window.app.playChapterAudio(${ch.number}, 'eng'))">
          🔊 English Narration
        </button>
        <button class="mob-btn-stop-audio-pill" onclick="window.app && window.app.stopVoice && window.app.stopVoice()">
          🛑 Stop Audio
        </button>
      </div>

      <div class="mob-tab-mentor-footer">
        Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
      </div>
    `;
  }

  switchStoryTab(tabName) {
    this.activeStoryTab = tabName;
    this.renderStoryClassroomView();
    if (this.app?.sfx?.playPop) this.app.sfx.playPop();
  }

  jumpToChapterLesson(chNum) {
    this.activeChapter = Number(chNum) || 1;
    if (this.app) this.app.activeChapter = this.activeChapter;
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
            ${p.year} (${p.semester === 1 ? 'Sem 1' : 'Sem 2'})
          </button>
        `).join('')}
      </div>
    `;

    const paper = EXAM_PAPERS_DATA.find(p => p.id === this.activePaperId) || EXAM_PAPERS_DATA[0];
    const query = searchInput && searchInput.value ? searchInput.value.toLowerCase().trim() : '';

    const questions = query 
      ? paper.questions.filter(q => 
          (q.qMal && q.qMal.toLowerCase().includes(query)) ||
          (q.qEng && q.qEng.toLowerCase().includes(query)) ||
          (q.answerMal && q.answerMal.toLowerCase().includes(query)) ||
          (q.answerEng && q.answerEng.toLowerCase().includes(query)) ||
          (q.citation && q.citation.toLowerCase().includes(query))
        )
      : paper.questions;

    list.innerHTML = `
      <div class="mob-screen-top-nav">
        <button class="mob-btn-back-link" onclick="window.mobileApp.switchMobileView('universe')">
          ‹ Back to Map
        </button>
        <span class="mob-screen-header-title">Exam Papers</span>
      </div>

      <div class="mob-paper-meta-card glass-panel">
        <h4 class="mob-paper-title-serif">${paper.title}</h4>
        <p class="mob-paper-scope">📚 Syllabus: ${paper.syllabus || 'Chapters 1-15'}</p>
        <div class="mob-paper-badges-row">
          <span class="mob-meta-badge">📝 ${paper.questions.length} Questions</span>
          <span class="mob-meta-badge">⭐ ${paper.totalMarks} Marks</span>
          <span class="mob-meta-badge verified">✓ 100% Solved & Cited</span>
        </div>
      </div>
      <div class="mob-questions-accordion">
        ${questions.map((q, idx) => `
          <details class="mob-q-details glass-panel" ${idx === 0 ? 'open' : ''}>
            <summary class="mob-q-summary">
              <span class="mob-q-number">Q${q.qNumber || idx + 1}</span>
              <span class="mob-q-text-mal">${q.qMal}</span>
              <span class="mob-q-type-pill">${q.type || 'Q'}</span>
            </summary>
            <div class="mob-q-answer-body">
              ${q.qEng ? `<p class="mob-q-eng-sub"><em>${q.qEng}</em></p>` : ''}
              
              <div class="mob-ans-card">
                <div class="mob-ans-label">✅ Verified Solution (ഉത്തരം):</div>
                <p class="mob-ans-mal">${q.answerMal || ''}</p>
                ${q.answerEng ? `<p class="mob-ans-eng">${q.answerEng}</p>` : ''}
              </div>

              ${q.eli5 ? `
                <div class="mob-eli5-card">
                  <div class="mob-eli5-label">🧸 5-Year-Old Explanation:</div>
                  <p class="mob-eli5-text">${q.eli5}</p>
                </div>
              ` : ''}

              ${q.citation ? `
                <div class="mob-citation-row">
                  <span class="mob-citation-tag">📖 ${q.citation}</span>
                </div>
              ` : ''}

              <div class="mob-q-audio-row">
                <button class="mob-btn-audio-pill" onclick="window.app && window.app.speakMalayalam && window.app.speakMalayalam('${(q.qMal + '. ഉത്തരം: ' + (q.answerMal || '')).replace(/'/g, "\\'")}')">
                  🔊 കേൾക്കുക (Listen)
                </button>
                <button class="mob-btn-stop-audio-pill" onclick="window.app && window.app.stopVoice && window.app.stopVoice()">
                  🛑 Stop
                </button>
              </div>
            </div>
          </details>
        `).join('')}
      </div>

      <div class="mob-tab-mentor-footer">
        Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
      </div>
    `;

    if (searchInput && !searchInput._bound) {
      searchInput._bound = true;
      searchInput.addEventListener('input', () => this.renderExamSolverView());
    }
  }

  selectExamPaper(paperId) {
    if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    this.activePaperId = paperId;
    this.renderExamSolverView();
  }

  /* ---------------- View 5: Star Quizzes (Mockup 12) ---------------- */
  renderQuizView() {
    const container = document.getElementById('mob-quiz-card-container');
    if (!container) return;

    const questions = this.app?.quiz?.questions?.length ? this.app.quiz.questions : KID_QUIZ_QUESTIONS;

    // Check if finished
    if (this.currentQuizIndex >= questions.length) {
      const starsEarned = this.app?.starsCount || 0;
      container.innerHTML = `
        <div class="mob-screen-top-nav">
          <button class="mob-btn-back-link" onclick="window.mobileApp.switchMobileView('universe')">
            ‹ Back to Map
          </button>
          <span class="mob-screen-header-title">Star Quizzes</span>
        </div>

        <div class="mob-quiz-card glass-panel text-center mob-quiz-completed">
          <div class="mob-quiz-celebration-hero">🎉 🏆 ✨</div>
          <h2 class="mob-quiz-title-serif">You Are a Star Champion!</h2>
          <p class="mob-quiz-complete-sub">
            മിടുക്കൻ / മിടുക്കി! You explored all ${questions.length} quiz adventures!
          </p>
          <div class="mob-quiz-score-badge">
            ⭐ <strong>${starsEarned} Stars Collected</strong>
          </div>
          <p class="mob-quiz-blessing">Jesus loves your joyful and eager heart! Keep shining bright!</p>
          <button class="mob-btn-restart-quiz btn-primary-gold" onclick="window.mobileApp.restartQuiz()">
            🔄 Play Again (വീണ്ടും കളിക്കാം)
          </button>
        </div>

        <div class="mob-tab-mentor-footer">
          Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
        </div>
      `;
      return;
    }

    const q = questions[this.currentQuizIndex];
    const totalQ = questions.length;
    const progressPercent = Math.round(((this.currentQuizIndex) / totalQ) * 100);
    const chapterHeading = q.chapter ? `Chapter ${q.chapter} Quiz` : `Quiz Adventure`;

    container.innerHTML = `
      <div class="mob-screen-top-nav">
        <button class="mob-btn-back-link" onclick="window.mobileApp.switchMobileView('universe')">
          ‹ Back to Map
        </button>
        <span class="mob-screen-header-title">Star Quizzes</span>
      </div>

      <div class="mob-quiz-card glass-panel">
        <div class="mob-quiz-header">
          <span class="mob-quiz-badge">${chapterHeading}</span>
          <span class="mob-quiz-counter-text">Question ${this.currentQuizIndex + 1} of ${totalQ}</span>
        </div>
        <div class="mob-quiz-progress-bar-bg">
          <div class="mob-quiz-progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="mob-quiz-question-box">
          <div class="mob-quiz-emoji">${q.emoji || '✨'}</div>
          <h3 class="mob-quiz-question-mal">${q.questionMal || q.q || ''}</h3>
          ${q.questionEng ? `<p class="mob-quiz-question-eng">${q.questionEng}</p>` : ''}
        </div>

        <div class="mob-quiz-options-list" id="mob-quiz-options-list">
          ${q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return `
            <button class="mob-quiz-option-btn" id="mob-opt-btn-${i}" onclick="window.mobileApp.handleQuizAnswer(${i}, ${q.correctIndex !== undefined ? q.correctIndex : (q.correct !== undefined ? q.correct : 0)})">
              <span class="mob-opt-letter">${letter}</span>
              <span class="mob-opt-text">${opt}</span>
            </button>
          `;
          }).join('')}
        </div>

        <div id="mob-quiz-feedback" class="mob-quiz-feedback" style="display: none;"></div>

        <div class="mob-quiz-clue-row">
          ${q.eli5Hint ? `
            <button class="mob-btn-clue-toggle" onclick="window.mobileApp.toggleQuizHint()">
              💡 Need a Clue? (Leo)
            </button>
          ` : ''}
          ${q.citation ? `<span class="mob-quiz-citation">📖 ${q.citation}</span>` : ''}
        </div>
        <div id="mob-quiz-hint-box" class="mob-quiz-hint-box" style="display: none;">
          🧸 <strong>Leo's Clue:</strong> ${q.eli5Hint || ''}
        </div>
      </div>

      <div class="mob-tab-mentor-footer">
        Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
      </div>
    `;
  }

  handleQuizAnswer(selectedIndex, correctIndex) {
    const feedback = document.getElementById('mob-quiz-feedback');
    const questions = this.app?.quiz?.questions?.length ? this.app.quiz.questions : KID_QUIZ_QUESTIONS;
    const q = questions[this.currentQuizIndex % questions.length];
    const isCorrect = selectedIndex === correctIndex;

    // Highlight options visually
    if (q && q.options) {
      q.options.forEach((_, i) => {
        const btn = document.getElementById(`mob-opt-btn-${i}`);
        if (btn) {
          btn.disabled = true;
          if (btn.classList) {
            if (i === correctIndex) {
              btn.classList.add('correct-choice');
            } else if (i === selectedIndex && !isCorrect) {
              btn.classList.add('wrong-choice');
            }
          } else {
            if (i === correctIndex) {
              btn.className = (btn.className || '') + ' correct-choice';
            } else if (i === selectedIndex && !isCorrect) {
              btn.className = (btn.className || '') + ' wrong-choice';
            }
          }
        }
      });
    }

    if (feedback) {
      feedback.style.display = 'block';
      if (isCorrect) {
        if (this.app?.sfx?.playChime) this.app.sfx.playChime();
        if (this.app?.sfx?.playFanfare) this.app.sfx.playFanfare();
        if (this.app?.addStar) this.app.addStar(1);
        this.updateStars(this.app?.starsCount || 0);

        feedback.className = 'mob-quiz-feedback success';
        feedback.innerHTML = `
          <div class="mob-feedback-header">
            <img src="assets/generated/angel-cherub-cutout.webp" alt="Angel Mascot" class="mob-quiz-angel-img" />
            <div class="mob-feedback-text-col">
              <strong>വളരെ ശരി! (Super Job!) +1 Star ⭐</strong>
              <p>${q?.encouragement || 'Wonderful answer! Jesus is smiling at your heart!'}</p>
            </div>
          </div>
          <button class="mob-btn-next-quiz btn-primary-gold" onclick="window.mobileApp.nextQuizQuestion()">
            Next Question ➔
          </button>
        `;
      } else {
        if (this.app?.sfx?.playPop) this.app.sfx.playPop();

        feedback.className = 'mob-quiz-feedback error';
        const correctText = q?.options && q.options[correctIndex] ? q.options[correctIndex] : 'First Option';
        feedback.innerHTML = `
          <div class="mob-feedback-header">
            <span class="mob-feedback-icon">🎈</span>
            <div class="mob-feedback-text-col">
              <strong>നല്ല ശ്രമം! (Good Try!)</strong>
              <p>ശരിയായ ഉത്തരം: <strong>${correctText}</strong></p>
            </div>
          </div>
          <div class="mob-quiz-feedback-actions">
            <button class="mob-btn-retry-quiz" onclick="window.mobileApp.retryCurrentQuiz()">
              🔄 Try Again
            </button>
            <button class="mob-btn-next-quiz btn-primary-gold" onclick="window.mobileApp.nextQuizQuestion()">
              Next Question ➔
            </button>
          </div>
        `;
      }
    }
  }

  retryCurrentQuiz() {
    this.renderQuizView();
  }

  nextQuizQuestion() {
    if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    this.currentQuizIndex++;
    this.renderQuizView();
  }

  restartQuiz() {
    if (this.app?.sfx?.playSparkle) this.app.sfx.playSparkle();
    this.currentQuizIndex = 0;
    this.renderQuizView();
  }

  toggleQuizHint() {
    const hintBox = document.getElementById('mob-quiz-hint-box');
    if (hintBox) {
      hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
    }
  }

  toggleAgentPanel() {
    const panel = document.getElementById('mob-agent-panel');
    if (!panel) return;
    const isHidden = panel.style.display === 'none' || !panel.classList.contains('active');
    if (isHidden) {
      panel.style.display = 'block';
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    } else {
      panel.classList.remove('active');
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
      if (this.app?.sfx?.playPop) this.app.sfx.playPop();
    }
  }
}
