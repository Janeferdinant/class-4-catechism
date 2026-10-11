/**
 * QuizEngine Component
 * Interactive gamified assessment crafted for young children.
 * Features positive reinforcement, star collection, audio readout,
 * locked options upon answering, transparent Angel Cherub mascot,
 * and clear accessible states matching Mockup 06.
 */

import { KID_QUIZ_QUESTIONS } from '../data/quizQuestionsData.js';
import { CHAPTERS_DATA } from '../data/chaptersData.js';

export class QuizEngine {
  constructor() {
    this.questions = KID_QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.streak = 0;
    this.lastFeedback = null;
    this.isAnswered = false;
    this.onAnswerFeedback = null;
  }

  loadQuestions(questions = []) {
    this.questions = questions.length > 0 ? questions : KID_QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.streak = 0;
    this.lastFeedback = null;
    this.isAnswered = false;
  }

  getScore() {
    return this.score;
  }

  getStars() {
    return this.stars;
  }

  getStreak() {
    return this.streak;
  }

  getCurrentQuestionIndex() {
    return this.currentIndex;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  answerByIndex(index) {
    const q = this.getCurrentQuestion();
    if (!q) return { correct: false, score: this.score, stars: this.stars };

    // Prevent double-submission if already answered
    if (this.isAnswered && this.lastFeedback) {
      return this.lastFeedback;
    }

    const isCorrect = (index === q.correctIndex) || (q.options && q.options[index] === q.correctAnswer);
    this.isAnswered = true;

    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
      this.streak += 1;
    } else {
      this.streak = 0;
    }

    const result = {
      questionId: q.id,
      correct: isCorrect,
      chosenIndex: index,
      chosenOption: q.options[index],
      correctAnswer: q.options[q.correctIndex] || q.correctAnswer,
      score: this.score,
      stars: this.stars,
      streak: this.streak,
      encouragement: isCorrect
        ? (q.encouragement || "Super job! You earned a star! ⭐")
        : "Almost there! Keep trying with a happy heart! 💖",
      citation: q.citation,
      hint: q.eli5Hint || q.hint
    };

    this.lastFeedback = result;
    if (this.onAnswerFeedback) this.onAnswerFeedback(result);
    return result;
  }

  answerQuestion(chosenOption) {
    const q = this.getCurrentQuestion();
    if (!q) return { correct: false, score: this.score, stars: this.stars };
    const idx = q.options ? q.options.indexOf(chosenOption) : -1;
    if (idx !== -1) {
      return this.answerByIndex(idx);
    }
    const isCorrect = chosenOption === q.correctAnswer;
    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
    }
    this.isAnswered = true;
    return { correct: isCorrect, score: this.score, stars: this.stars };
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.lastFeedback = null;
      this.isAnswered = false;
      return this.getCurrentQuestion();
    }
    return null;
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.streak = 0;
    this.lastFeedback = null;
    this.isAnswered = false;
  }

  renderQuizCardHTML() {
    const q = this.getCurrentQuestion();
    const totalQ = this.questions.length;

    // Completed State
    if (!q) {
      return `
        <div class="quiz-completed-box glass-panel text-center animate-fade-in">
          <div class="celebration-badge-hero">🎉 🏆 ✨</div>
          <h2 class="quiz-celebration-title">You Did It, Star Champion!</h2>
          <p class="quiz-final-score">
            You answered <strong class="gold-text">${this.stars} of ${totalQ}</strong> questions correctly and scored <strong>${this.score} Points</strong>!
          </p>
          <p class="quiz-star-rule">Each question gives you a star the first time you get it right.</p>
          <div class="celebration-angel-frame">
            <img src="assets/generated/angel-cherub-cutout.webp" alt="Angel Cherub" class="celebration-angel-cutout" />
          </div>
          <p class="quiz-encouragement-msg">Jesus is smiling at your happy, eager heart today!</p>
          <button class="btn-primary-gold-pill" onclick="window.app && window.app.restartQuiz && window.app.restartQuiz()">
            🔄 Play Again With Leo
          </button>
        </div>
      `;
    }

    const chNum = q.chapter || 1;
    const chData = CHAPTERS_DATA.find(c => c.number === chNum);
    const chTitle = chData ? chData.titleEng : `Chapter ${chNum}`;
    const progressPct = ((this.currentIndex + 1) / totalQ) * 100;
    const isAnswered = this.isAnswered;
    const feedback = this.lastFeedback;

    return `
      <div class="quiz-stage-card glass-panel animate-slide-fade" data-quiz-index="${this.currentIndex}">
        <!-- Top Card Header: Chapter Name, Question Counter & Gold Progress Bar -->
        <div class="quiz-card-header">
          <div class="quiz-header-top-row">
            <div class="quiz-chapter-title-group">
              <span class="quiz-ch-badge">Chapter ${chNum} Quiz</span>
              <h3 class="quiz-ch-name-serif">${chTitle}</h3>
            </div>
            <div class="quiz-counter-pill">
              Question ${this.currentIndex + 1} of ${totalQ}
            </div>
          </div>
          <div class="quiz-gold-progress-track">
            <div class="quiz-gold-progress-bar" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <!-- Split Content Area: Left Question & Options + Right Angel Mascot -->
        <div class="quiz-split-layout">
          <!-- Left Question Pane -->
          <div class="quiz-question-pane">
            <div class="quiz-question-box">
              <div class="quiz-emoji-badge">${q.emoji || '✨'}</div>
              <div class="quiz-question-texts">
                <h4 class="quiz-q-malayalam">${q.questionMal}</h4>
                <p class="quiz-q-english">${q.questionEng}</p>
              </div>
              <button class="btn-voice-read-aloud" onclick="window.app && window.app.speakQuizQuestion && window.app.speakQuizQuestion()" title="Listen to question read aloud">
                🔊 Read Aloud
              </button>
            </div>

            <!-- 3 Full-Width Options List -->
            <div class="quiz-options-list ${isAnswered ? 'options-locked' : ''}" role="radiogroup" aria-label="Quiz Answer Options">
              ${q.options.map((opt, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx] || (idx + 1);
                let stateClass = '';
                let stateBadge = '';

                if (isAnswered && feedback) {
                  if (idx === q.correctIndex) {
                    stateClass = 'option-state-correct';
                    stateBadge = '<span class="option-check-badge">✓ Correct</span>';
                  } else if (idx === feedback.chosenIndex && !feedback.correct) {
                    stateClass = 'option-state-incorrect';
                    stateBadge = '<span class="option-cross-badge">✕ Try Again</span>';
                  }
                }

                return `
                  <button 
                    class="quiz-option-row ${stateClass}" 
                    data-choice-index="${idx}" 
                    ${isAnswered ? 'disabled' : ''} 
                    onclick="window.app && window.app.chooseQuizOption && window.app.chooseQuizOption(${idx})"
                  >
                    <span class="option-letter-circle">${letter}</span>
                    <span class="option-text-label">${opt}</span>
                    ${stateBadge}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Bottom Action Bar: Citation + Clue + Next Question -->
            <div class="quiz-bottom-bar">
              <div class="quiz-bar-left">
                <span class="quiz-citation-badge">📖 Reference: ${q.citation}</span>
              </div>
              <div class="quiz-bar-right">
                <button class="btn-clue-pill" onclick="window.app && window.app.showQuizHint && window.app.showQuizHint()">
                  💡 Need a clue from Leo?
                </button>
                <button 
                  class="btn-primary-gold-pill btn-next-question ${!isAnswered ? 'btn-next-disabled' : ''}" 
                  ${!isAnswered ? 'disabled' : ''} 
                  onclick="window.app && window.app.nextQuizQuestion && window.app.nextQuizQuestion()"
                >
                  ${(this.currentIndex === totalQ - 1) ? 'Finish Quiz ★' : 'Next Question →'}
                </button>
              </div>
            </div>

            <!-- Clue Box (Hidden by default) -->
            <div id="quiz-hint-box" class="quiz-hint-box" style="display:none;"></div>
          </div>

          <!-- Right Mascot & Feedback Pane: Angel Cherub Cutout -->
          <div class="quiz-mascot-pane">
            <div class="quiz-angel-stage">
              <img src="assets/generated/angel-cherub-cutout.webp" alt="Angel Cherub" class="angel-cherub-cutout-img ${isAnswered && feedback && feedback.correct ? 'angel-celebrate-bounce' : ''}" />

              ${isAnswered && feedback ? `
                <div class="quiz-feedback-speech-bubble ${feedback.correct ? 'bubble-correct' : 'bubble-tryagain'} animate-pop-in">
                  <span class="bubble-verdict-title">${feedback.correct ? '✨ Correct!' : '🎈 Gentle Cheer!'}</span>
                  <p class="bubble-encouragement">${feedback.encouragement}</p>
                </div>
              ` : `
                <div class="quiz-angel-idle-note">
                  <p>Pick the best answer and earn a shiny golden star! ⭐</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
