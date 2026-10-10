/**
 * SlideDeck Component
 * High-definition presentation slide deck supporting 4K layouts,
 * keyboard navigation, chapter story presentation, and speaker notes.
 */

export class SlideDeckManager {
  constructor(chapters = []) {
    this.chapters = chapters;
    this.currentIndex = 0;
    this.onSlideChange = null;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalSlides() {
    return this.chapters.length;
  }

  getCurrentSlide() {
    return this.chapters[this.currentIndex] || this.chapters[0];
  }

  next() {
    if (this.currentIndex < this.chapters.length - 1) {
      this.currentIndex++;
      if (this.onSlideChange) this.onSlideChange(this.getCurrentSlide(), this.currentIndex);
    }
    return this.currentIndex;
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.onSlideChange) this.onSlideChange(this.getCurrentSlide(), this.currentIndex);
    }
    return this.currentIndex;
  }

  jumpTo(index) {
    if (index >= 0 && index < this.chapters.length) {
      this.currentIndex = index;
      if (this.onSlideChange) this.onSlideChange(this.getCurrentSlide(), this.currentIndex);
    }
    return this.currentIndex;
  }

  renderSlideHTML(chapter) {
    if (!chapter) return '';
    return `
      <div class="slide-content animate-slide-fade" data-chapter="${chapter.number}">
        <div class="slide-badge">
          <span class="badge-tag">CHAPTER ${chapter.number} OF 15</span>
          <span class="badge-sem">SEMESTER ${chapter.semester}</span>
        </div>
        <h1 class="slide-title-mal">${chapter.titleMal}</h1>
        <h2 class="slide-title-eng">${chapter.titleEng}</h2>

        <div class="slide-body-grid">
          <!-- Column 1: Authentic Textbook Illustration Card -->
          <div class="slide-picture-card">
            <div class="card-header">
              <span class="character-avatar">🎨</span>
              <span class="character-name">പാഠപുസ്തക ചിത്രം (Lesson Art)</span>
              <span class="art-badge-hd">3D Pixar HD</span>
            </div>
            <div class="slide-img-container" id="slide-img-container-${chapter.number}">
              <img src="${chapter.imageUrl}" alt="${chapter.titleMal} - ${chapter.titleEng}" class="slide-hero-image ken-burns-active" id="slide-hero-img-${chapter.number}" loading="lazy" />
              <div class="slide-img-overlay-bar">
                <span>📖 Ch ${chapter.number} • 3D Motion Graphics</span>
                <span class="motion-pill-badge">🎬 Live 3D</span>
              </div>
            </div>
            <div class="slide-audio-quickbar">
              <button class="btn-ctrl btn-slide-speak-mal" onclick="window.app && window.app.speakStoryMal ? window.app.speakStoryMal(${chapter.number}) : null" title="മലയാളം വിവരണം">
                🔊 മലയാളം
              </button>
              <button class="btn-ctrl btn-slide-speak-eng" onclick="window.app && window.app.speakStory ? window.app.speakStory(${chapter.number}) : null" title="English Narration">
                🔊 English
              </button>
              <button class="btn-ctrl btn-slide-stop" onclick="window.app && window.app.stopVoice ? window.app.stopVoice() : null" title="Stop Voice">
                🛑 Stop
              </button>
              <button class="btn-ctrl btn-slide-ai-art" onclick="window.app && window.app.generate4KArt ? window.app.generate4KArt(${chapter.number}) : null" title="Generate 4K 3D Pixar Art with Gemini AI Studio">
                ✨ 4K Pixar AI
              </button>
              <button class="btn-ctrl btn-slide-toggle-art" onclick="window.app && window.app.toggleSlideArtMode ? window.app.toggleSlideArtMode(${chapter.number}) : null" title="Toggle between 3D Pixar Art and Textbook Illustration">
                🔄 3D / Scan
              </button>
            </div>
          </div>

          <!-- Column 2: Leo's 5yo Story -->
          <div class="slide-story-card">
            <div class="card-header">
              <span class="character-avatar">🦁</span>
              <span class="character-name">ലിയോയുടെ കഥ (Leo's 5yo Story)</span>
            </div>
            <p class="story-text-mal" style="font-family: var(--font-family-malayalam); font-size: 1.15rem; line-height: 1.7; margin-bottom: 12px; color: var(--text-primary); font-weight: 500;">${chapter.story5yoMal || chapter.story5yo}</p>
            <p class="story-text" style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">${chapter.story5yo}</p>
            <div class="moral-box">
              <strong>🌟 സുവർണ്ണ പാഠം (Golden Rule):</strong>
              <div style="font-family: var(--font-family-malayalam); font-weight: 700; color: var(--accent-gold); margin-top: 4px; font-size: 1rem;">${chapter.moralLessonMal || ''}</div>
              <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 2px;">${chapter.moralLesson}</div>
            </div>
          </div>

          <!-- Column 3: Scripture & Galileo Agent Insights -->
          <div class="slide-scripture-card">
            <div class="card-header">
              <span class="icon-bible">📖</span>
              <span class="scripture-heading">Holy Scripture</span>
            </div>
            <blockquote class="bible-quote">"${chapter.scripture}"</blockquote>
            <p class="bible-quote-eng">"${chapter.scriptureEng}"</p>
            <div class="concept-chips">
              ${chapter.keyConcepts.map(c => `
                <span class="concept-chip" title="${c.desc}">
                  <strong>${c.termMal}</strong> (${c.termEng})
                </span>
              `).join('')}
            </div>
            <div class="agent-insight">
              <strong>🤖 Galileo Multi-Agent Insight:</strong>
              <p>${chapter.agentPerspective}</p>
            </div>
          </div>
        </div>

        <div class="slide-academic-footer">
          <span class="footer-academic-icon">🎓</span>
          <div class="footer-academic-text">
            <strong>Asst. Prof. Jane Rose</strong> &bull; Department of Computer Science & Engineering (CSE)
          </div>
        </div>
      </div>
    `;
  }
}
