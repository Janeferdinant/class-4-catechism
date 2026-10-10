/**
 * StoryClassroom Component
 * Interactive classroom designed specifically for 5-year-old learners and primary students.
 * Features friendly animal guides, sensory descriptions, interactive buttons, and notes for all 15 chapters.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';

export class StoryClassroomManager {
  constructor() {
    this.chapters = CHAPTERS_DATA;
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

  renderLessonCard(lesson) {
    return `
      <div class="lesson-card-5yo glass-panel" data-chapter="${lesson.number}">
        <div class="lesson-hero">
          <div class="guide-badge">
            <span class="guide-emoji">${lesson.characterGuide.emoji}</span>
            <div class="guide-info">
              <span class="guide-name">${lesson.characterGuide.name}</span>
              <span class="guide-title">${lesson.characterGuide.title}</span>
            </div>
          </div>
          <div class="lesson-num-pill">അദ്ധ്യായം ${lesson.number} / Chapter ${lesson.number}</div>
        </div>

        <h3 class="lesson-heading-mal">${lesson.titleMal}</h3>
        <h4 class="lesson-heading-eng">${lesson.titleEng}</h4>

        <!-- Authentic Lesson Illustration Banner -->
        <div class="lesson-banner-art">
          <img src="${lesson.imageUrl || 'assets/textbook/ch' + lesson.number + '_p2.png'}" alt="${lesson.titleMal} - ${lesson.titleEng}" class="lesson-banner-img" loading="lazy" />
          <div class="banner-caption-pill">
            <span>🎨 ക്ലാസ് 4 പാഠപുസ്തക ചിത്രം • അദ്ധ്യായം ${lesson.number} (Official Textbook Illustration)</span>
          </div>
        </div>

        <div class="fairy-tale-story-box">
          <!-- Malayalam Story for 5-Year-Olds -->
          <div class="story-speech-bubble bubble-mal">
            <span class="lang-tag-pill">🦁 കൊച്ചുമക്കൾക്കുള്ള കഥ (Malayalam Story)</span>
            <p class="story-text-mal">${lesson.story5yoMal || lesson.story5yo}</p>
          </div>

          <!-- English Story -->
          <div class="story-speech-bubble bubble-eng">
            <span class="lang-tag-pill">Story for Little Angels (English)</span>
            <p class="story-text-eng">${lesson.story5yo}</p>
          </div>
        </div>

        <!-- Scripture Passage -->
        ${lesson.scripture ? `
          <div class="lesson-scripture-box">
            <div class="scripture-badge-row">
              <span class="icon-bible">📖</span>
              <strong>വിശുദ്ധ വേദപുസ്തകം (Holy Scripture):</strong>
            </div>
            <blockquote class="bible-quote-mal">"${lesson.scripture}"</blockquote>
            ${lesson.scriptureEng ? `<p class="bible-quote-eng">"${lesson.scriptureEng}"</p>` : ''}
            
            ${lesson.keyConcepts && lesson.keyConcepts.length > 0 ? `
              <div class="lesson-key-terms-row">
                ${lesson.keyConcepts.map(c => `
                  <span class="term-pill" title="${c.desc}">
                    <strong>${c.termMal}</strong> <small>(${c.termEng})</small>
                  </span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Golden Moral Lesson Banner -->
        <div class="golden-rule-banner">
          <span class="star-icon">⭐</span>
          <div>
            <strong>ഇന്നത്തെ സുവർണ്ണ പാഠം (Today's Golden Rule):</strong>
            <p class="golden-rule-mal">${lesson.moralLessonMal || ''}</p>
            <p class="golden-rule-eng">${lesson.moralLesson}</p>
          </div>
        </div>

        <div class="interactive-activity-box">
          <h5>🎈 Playground Activity with ${lesson.characterGuide.name}:</h5>
          <p>${lesson.interactivePrompts[0]}</p>
          <div class="action-buttons-row">
            <button class="btn-sound-story btn-sound-mal" onclick="window.app.speakStoryMal(${lesson.number})" title="Listen to story in Malayalam">
              🔊 മലയാളത്തിൽ കേൾക്കുക
            </button>
            <button class="btn-sound-story btn-sound-eng" onclick="window.app.speakStory(${lesson.number})" title="Listen to story in English">
              🔊 English Story
            </button>
            <button class="btn-stop-voice" onclick="window.app.stopVoice()" title="Stop narration">
              🛑 നിർത്തുക (Stop)
            </button>
            <button class="btn-give-star" onclick="window.app.awardStar(${lesson.number})">
              ⭐ Collect Chapter Star
            </button>
          </div>
        </div>

        <div class="lesson-academic-footer">
          <span class="footer-academic-icon">🎓</span>
          <div class="footer-academic-text">
            <strong>Academic Mentor: Asst. Prof. Jane Rose</strong> &bull; Department of Computer Science & Engineering (CSE)
          </div>
        </div>
      </div>
    `;
  }
}
