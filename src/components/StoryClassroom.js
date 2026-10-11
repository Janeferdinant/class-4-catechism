/**
 * StoryClassroom Component
 * Engaging classroom experience designed for 5-to-10-year-old learners.
 * Features 4-tab content switching (Story, Moral Lesson, Key Concepts, Scripture),
 * bilingual text presentation, authentic chapter artwork, and shared audio controls.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';

export class StoryClassroomManager {
  constructor() {
    this.chapters = CHAPTERS_DATA;
    this.activeTab = 'story';
    this.characters = [
      { id: 'leo', name: 'Leo the Lion Cub', emoji: '🦁', title: 'The Story Guide' },
      { id: 'bella', name: 'Bella the Holy Dove', emoji: '🕊️', title: 'The Spirit Guide' },
      { id: 'sammy', name: 'Sammy the Little Lamb', emoji: '🐑', title: 'The Curious Explorer' }
    ];
  }

  getLesson(chapterNumber) {
    const ch = this.chapters.find(c => c.number === Number(chapterNumber)) || this.chapters[0];
    const char = this.characters[(ch.number - 1) % this.characters.length];

    return {
      ...ch,
      characterGuide: char,
      interactivePrompts: [
        `What fruit would you like to grow on your branch today? 🍇`,
        `Can you make the sign of the cross slowly with your fingers? ✝️`,
        `Give someone next to you a big happy smile! 😊`
      ]
    };
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
  }

  getActiveTab() {
    return this.activeTab || 'story';
  }

  renderLessonCard(lesson, currentTab = null, { starCollected = false } = {}) {
    const tab = currentTab || this.activeTab || 'story';
    const tabName = { story: 'story', moral: 'moral lesson', concepts: 'key concepts', scripture: 'scripture' }[tab] || 'story';

    return `
      <div class="story-lesson-card glass-panel animate-slide-fade" data-chapter="${lesson.number}">
        <!-- Top Title & Tabs Header -->
        <div class="story-card-top-header">
          <div class="story-title-meta">
            <span class="story-chapter-kicker">Chapter ${lesson.number}</span>
            <h2 class="story-headline-eng">${lesson.titleEng}</h2>
            <h3 class="story-headline-mal">${lesson.titleMal}</h3>
          </div>

          <!-- 4 Tab Navigation Pills (Matching Mockup 04) -->
          <div class="story-tabs-pills-row" role="tablist">
            <button class="story-tab-pill ${tab === 'story' ? 'active' : ''}" onclick="window.app && window.app.setStoryTab && window.app.setStoryTab('story')">
              📖 Story
            </button>
            <button class="story-tab-pill ${tab === 'moral' ? 'active' : ''}" onclick="window.app && window.app.setStoryTab && window.app.setStoryTab('moral')">
              ⭐ Moral Lesson
            </button>
            <button class="story-tab-pill ${tab === 'concepts' ? 'active' : ''}" onclick="window.app && window.app.setStoryTab && window.app.setStoryTab('concepts')">
              💡 Key Concepts
            </button>
            <button class="story-tab-pill ${tab === 'scripture' ? 'active' : ''}" onclick="window.app && window.app.setStoryTab && window.app.setStoryTab('scripture')">
              ✝ Scripture
            </button>
          </div>
        </div>

        <!-- Split Content Area: Left Text + Right Illustration -->
        <div class="story-split-stage">
          <!-- Left Column: Bilingual Text Content -->
          <div class="story-text-pane">
            ${this.renderTabContentHTML(lesson, tab)}
          </div>

          <!-- Right Column: Chapter Illustration with soft fade toward text -->
          <div class="story-illustration-pane">
            <div class="story-illustration-wrapper lesson-banner-art">
              <img src="${lesson.imageUrl || 'assets/textbook/ch' + lesson.number + '_p2.png'}" alt="${lesson.titleEng} - ${lesson.titleMal}" class="story-illustration-img lesson-banner-img" loading="lazy" />
              <div class="story-art-scrim-gradient"></div>
            </div>
          </div>
        </div>

        <!-- Bottom Pinned Shared Audio Bar (Matching Mockup 04) -->
        <div class="story-bottom-audio-bar shared-audio-bar" data-chapter="${lesson.number}">
          <div class="audio-lang-pills">
            <button class="btn-audio-pill btn-audio-mal" onclick="window.app && window.app.speakStoryMal && window.app.speakStoryMal(${lesson.number})" title="Listen to the ${tabName} in Malayalam">
              🔊 Malayalam
            </button>
            <button class="btn-audio-pill btn-audio-eng" onclick="window.app && window.app.speakStoryEng && window.app.speakStoryEng(${lesson.number})" title="Listen to the ${tabName} in English">
              🔊 English
            </button>
            <button class="btn-audio-pill btn-audio-stop" onclick="window.app && window.app.stopVoice && window.app.stopVoice()" title="Stop narration">
              🛑 Stop Audio
            </button>
          </div>

          <div class="audio-player-controls">
            <button class="btn-audio-play-pause" onclick="window.app && window.app.togglePlayPause && window.app.togglePlayPause(${lesson.number})" aria-label="Play or pause story narration">
              ▶
            </button>
            <div class="audio-progress-wrap" onclick="window.app && window.app.seekAudio && window.app.seekAudio(event)">
              <div class="audio-progress-fill" style="width: 0%;"></div>
            </div>
            <span class="audio-time-display">0:00</span>
          </div>

          <div class="story-star-action">
            <button class="btn-award-star-pill${starCollected ? ' collected' : ''}" data-chapter="${lesson.number}" ${starCollected ? 'disabled' : ''} onclick="window.app && window.app.awardStar && window.app.awardStar(${lesson.number})">
              ${starCollected ? '⭐ Star collected' : '⭐ Collect Chapter Star'}
            </button>
          </div>
        </div>

        <!-- Academic Mentor attribution line (preserves tests/footerAttribution.test.js) -->
        <div class="story-academic-attribution">
          Academic Mentor: Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)
        </div>
      </div>
    `;
  }

  renderTabContentHTML(lesson, tab) {
    switch (tab) {
      case 'moral':
        return `
          <div class="tab-panel-inner animate-fade-in">
            <div class="story-section-badge">🌟 Moral Lesson (സുവർണ്ണ പാഠം)</div>
            <p class="story-lead-paragraph">${lesson.moralLesson}</p>
            <div class="story-malayalam-block">
              <p class="story-malayalam-paragraph story-text-mal">${lesson.moralLessonMal || ''}</p>
            </div>
          </div>
        `;
      case 'concepts':
        return `
          <div class="tab-panel-inner animate-fade-in">
            <div class="story-section-badge">💡 Key Concepts (പ്രധാന ആശയങ്ങൾ)</div>
            <div class="story-concepts-list">
              ${(lesson.keyConcepts || []).map(c => `
                <div class="concept-card-row">
                  <span class="concept-bullet">✦</span>
                  <div class="concept-details">
                    <strong class="concept-term-eng">${c.termEng}</strong>
                    <span class="concept-term-mal">${c.termMal}</span>
                    <p class="concept-desc">${c.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'scripture':
        return `
          <div class="tab-panel-inner animate-fade-in">
            <div class="story-section-badge">✝ Holy Scripture (വിശുദ്ധ വേദപുസ്തകം)</div>
            <blockquote class="story-scripture-quote-eng">"${lesson.scriptureEng || ''}"</blockquote>
            <div class="story-malayalam-block">
              <blockquote class="story-scripture-quote-mal story-text-mal">"${lesson.scripture || ''}"</blockquote>
            </div>
          </div>
        `;
      case 'story':
      default:
        return `
          <div class="tab-panel-inner animate-fade-in">
            <p class="story-lead-paragraph">${lesson.story5yo}</p>
            <div class="story-malayalam-block">
              <p class="story-malayalam-paragraph story-text-mal">${lesson.story5yoMal || ''}</p>
            </div>
          </div>
        `;
    }
  }
}
