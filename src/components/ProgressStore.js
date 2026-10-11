/**
 * ProgressStore
 * Each learner's progress, saved only in their own browser (localStorage).
 *
 * Stars are not a free-running counter: they are counted from what has been
 * earned - one star per chapter (Story Lessons) and one per quiz question
 * answered correctly. Repeating an action can never add a second star, and
 * every new browser starts at 0.
 */

const STORAGE_KEY = 'class4-progress-v1';
// Older builds kept an editable running total; it is discarded, not migrated.
const LEGACY_KEYS = ['adventure-stars', 'class4-collected-stars'];

function browserStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch (_) {
    return null; // storage blocked (private mode, disabled site data)
  }
}

export class ProgressStore {
  /**
   * @param {object} options
   * @param {number[]} options.chapterNumbers  valid chapter numbers
   * @param {string[]} options.quizIds         valid quiz question ids
   * @param {Storage|null} [options.storage]   defaults to window.localStorage
   */
  constructor({ chapterNumbers = [], quizIds = [], storage = browserStorage() } = {}) {
    this.validChapters = new Set(chapterNumbers.map(Number));
    this.validQuiz = new Set(quizIds.map(String));
    this.storage = storage;
    this.chapters = new Set();
    this.quiz = new Set();
    this.load();
  }

  load() {
    let saved = null;
    try {
      saved = JSON.parse(this.storage?.getItem(STORAGE_KEY) || 'null');
      LEGACY_KEYS.forEach(key => this.storage?.removeItem(key));
    } catch (_) {
      saved = null;
    }
    // Keep only ids that really exist, so an edited value cannot add stars.
    this.chapters = new Set((saved?.chapters || []).map(Number).filter(n => this.validChapters.has(n)));
    this.quiz = new Set((saved?.quiz || []).map(String).filter(id => this.validQuiz.has(id)));
  }

  save() {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        chapters: [...this.chapters].sort((a, b) => a - b),
        quiz: [...this.quiz].sort()
      }));
    } catch (_) {
      // Storage full or blocked: progress still works for this visit.
    }
  }

  get stars() {
    return this.chapters.size + this.quiz.size;
  }

  get maxStars() {
    return this.validChapters.size + this.validQuiz.size;
  }

  hasChapterStar(chapterNumber) {
    return this.chapters.has(Number(chapterNumber));
  }

  hasQuizStar(questionId) {
    return this.quiz.has(String(questionId));
  }

  /** @returns {boolean} true only the first time this chapter's star is earned */
  awardChapterStar(chapterNumber) {
    const n = Number(chapterNumber);
    if (!this.validChapters.has(n) || this.chapters.has(n)) return false;
    this.chapters.add(n);
    this.save();
    return true;
  }

  /** @returns {boolean} true only the first time this question's star is earned */
  awardQuizStar(questionId) {
    const id = String(questionId);
    if (!this.validQuiz.has(id) || this.quiz.has(id)) return false;
    this.quiz.add(id);
    this.save();
    return true;
  }

  reset() {
    this.chapters.clear();
    this.quiz.clear();
    try {
      this.storage?.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
  }
}
