/**
 * SlideDeck Component
 * High-definition presentation slide deck supporting 16:9 layouts,
 * keyboard navigation, artwork/textbook toggle, thumbnail strip, and shared audio bar.
 */

export class SlideDeckManager {
  constructor(chapters = []) {
    this.chapters = chapters;
    this.currentIndex = 0;
    this.artMode = 'artwork';
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

  setArtMode(mode) {
    this.artMode = mode;
  }

  getArtMode() {
    return this.artMode;
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

  renderSlideHTML(chapter, mode = null) {
    if (!chapter) return '';
    const artMode = mode || this.artMode || 'artwork';
    const imgUrl = (artMode === 'textbook' && chapter.textbookUrl) ? chapter.textbookUrl : chapter.imageUrl;
    const total = this.chapters.length || 15;

    return `
      <div class="slide-presentation-card glass-panel animate-slide-fade" data-chapter="${chapter.number}">
        <!-- Slide Top Header -->
        <div class="slide-card-header">
          <div class="slide-header-left">
            <span class="slide-chapter-kicker">CHAPTER ${chapter.number} OF ${total}</span>
            <h2 class="slide-headline-title">
              <span class="slide-title-serif">${chapter.titleEng}</span>
              <span class="slide-title-malayalam">${chapter.titleMal}</span>
            </h2>
          </div>
          <div class="slide-header-right">
            <!-- Artwork / Textbook Toggle -->
            <div class="slide-art-segmented-control" role="group" aria-label="Slide artwork mode">
              <button class="slide-art-seg-btn ${artMode !== 'textbook' ? 'active' : ''}" id="btn-art-mode-art" onclick="window.app && window.app.setSlideArtMode && window.app.setSlideArtMode('artwork')">
                🎨 Artwork
              </button>
              <button class="slide-art-seg-btn ${artMode === 'textbook' ? 'active' : ''}" id="btn-art-mode-textbook" onclick="window.app && window.app.setSlideArtMode && window.app.setSlideArtMode('textbook')">
                📖 Textbook
              </button>
            </div>
            <div class="slide-counter-badge">Slide ${chapter.number} of ${total}</div>
          </div>
        </div>

        <!-- Main 16:9 Slide Stage -->
        <div class="slide-stage-viewport">
          <div class="slide-img-container" id="slide-img-container-${chapter.number}">
            <img src="${imgUrl}" alt="${chapter.titleEng} - ${chapter.titleMal}" class="slide-hero-image" id="slide-hero-img-${chapter.number}" loading="lazy" />
          </div>

          <!-- Mid-height Floating Round Prev / Next Navigation Arrows -->
          <button class="slide-arrow-btn slide-arrow-prev" id="btn-slide-stage-prev" onclick="window.app && window.app.prevSlide && window.app.prevSlide()" aria-label="Previous slide">
            ‹
          </button>
          <button class="slide-arrow-btn slide-arrow-next" id="btn-slide-stage-next" onclick="window.app && window.app.nextSlide && window.app.nextSlide()" aria-label="Next slide">
            ›
          </button>
        </div>

        <!-- Thumbnail Strip Container (Populated & Scrolled in app.js) -->
        <div class="slide-thumbs-container" id="slide-thumbs-strip">
          ${this.chapters.map((ch, i) => `
            <button class="slide-thumb-pill ${ch.number === chapter.number ? 'active' : ''}" onclick="window.app && window.app.jumpToSlide && window.app.jumpToSlide(${i})" title="Ch ${ch.number}: ${ch.titleEng}">
              <img src="${ch.imageUrl}" alt="Ch ${ch.number}" class="thumb-mini-img" loading="lazy" />
              <span class="thumb-num-label">Ch ${ch.number}</span>
            </button>
          `).join('')}
        </div>

        <!-- Shared Audio Bar & Fullscreen Controls Row -->
        <div class="slide-bottom-audio-bar shared-audio-bar" data-chapter="${chapter.number}">
          <div class="audio-lang-pills">
            <button class="btn-audio-pill btn-audio-mal" id="btn-slide-voice-mal" onclick="window.app && window.app.playChapterAudio && window.app.playChapterAudio(${chapter.number}, 'mal')" title="Listen in Malayalam">
              🔊 Malayalam
            </button>
            <button class="btn-audio-pill btn-audio-eng" id="btn-slide-voice-eng" onclick="window.app && window.app.playChapterAudio && window.app.playChapterAudio(${chapter.number}, 'eng')" title="Listen in English">
              🔊 English
            </button>
            <button class="btn-audio-pill btn-audio-stop" id="btn-slide-stop" onclick="window.app && window.app.stopVoice && window.app.stopVoice()" title="Stop Voice">
              🛑 Stop Audio
            </button>
          </div>

          <div class="audio-player-controls">
            <button class="btn-audio-play-pause" id="btn-slide-play-pause" onclick="window.app && window.app.togglePlayPause && window.app.togglePlayPause(${chapter.number})" aria-label="Play or pause audio">
              ▶
            </button>
            <div class="audio-progress-wrap" id="slide-audio-progress-wrap" onclick="window.app && window.app.seekAudio && window.app.seekAudio(event)">
              <div class="audio-progress-fill" id="slide-audio-progress-fill" style="width: 0%;"></div>
            </div>
            <span class="audio-time-display" id="slide-audio-time-display">0:00 / 0:38</span>
          </div>

          <div class="slide-actions-right">
            <button class="btn-ctrl btn-slide-fullscreen-stage" id="btn-slide-fullscreen" onclick="window.app && window.app.toggleSlideFullscreen && window.app.toggleSlideFullscreen()">
              ⛶ Fullscreen
            </button>
          </div>
        </div>

        <!-- Academic Mentor subtle attribution line (preserves tests/footerAttribution.test.js) -->
        <div class="slide-academic-attribution">
          Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
        </div>
      </div>
    `;
  }
}
