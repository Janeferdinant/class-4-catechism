/**
 * QuizEngine Component
 * Interactive gamified assessment crafted for young children.
 * Features positive reinforcement, star collection, audio readout,
 * large bubbly touch targets, and robust event-driven answering.
 */

import { KID_QUIZ_QUESTIONS } from '../data/quizQuestionsData.js';

export class QuizEngine {
  constructor() {
    this.questions = KID_QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.streak = 0;
    this.lastFeedback = null;
    this.onAnswerFeedback = null;
  }

  loadQuestions(questions = []) {
    this.questions = questions.length > 0 ? questions : KID_QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.streak = 0;
    this.lastFeedback = null;
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

    const isCorrect = (index === q.correctIndex) || (q.options && q.options[index] === q.correctAnswer);
    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
      this.streak += 1;
    } else {
      // Gentle encouragement: no negative score or penalty for children!
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
      encouragement: isCorrect ? (q.encouragement || "Super job! You earned a star! ⭐") : "Almost there! Let's try again with a happy heart! 💖",
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
    // Fallback comparison
    const isCorrect = chosenOption === q.correctAnswer;
    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
    }
    return { correct: isCorrect, score: this.score, stars: this.stars };
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.lastFeedback = null;
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
  }

  renderQuizCardHTML() {
    const q = this.getCurrentQuestion();
    if (!q) {
      return `
        <div class="quiz-completed-box glass-panel text-center">
          <div class="celebration-badge-hero">🎉 🏆 ✨</div>
          <h2 class="adventure-title">You Did It, Star Champion!</h2>
          <p class="final-score">You earned <strong>${this.stars} Golden Stars</strong> and <strong>${this.score} Points</strong>!</p>
          <p class="encouragement-msg">Jesus is smiling at your happy, eager heart today!</p>
          <button class="btn-bubble-primary" onclick="window.app.restartQuiz()">
            🔄 Play Again With Leo
          </button>
        </div>
      `;
    }

    return `
      <div class="quiz-adventure-card glass-panel" data-quiz-index="${this.currentIndex}">
        <!-- Top Fun Ribbon -->
        <div class="quiz-ribbon">
          <div class="quiz-star-counter">
            <span class="star-icon">⭐</span>
            <span>${this.stars} Stars</span>
          </div>
          <div class="quiz-progress-pill">
            Adventure ${this.currentIndex + 1} of ${this.questions.length}
          </div>
          <button class="btn-voice-mini" onclick="window.app.speakQuizQuestion()" title="Listen to Leo read this question">
            🔊 Read Aloud
          </button>
        </div>

        <!-- Question Title with Emoji -->
        <div class="quiz-question-hero">
          <div class="question-emoji-bubble">${q.emoji || '✨'}</div>
          <h3 class="q-mal-title">${q.questionMal}</h3>
          <p class="q-eng-subtitle">${q.questionEng}</p>
        </div>

        <!-- Feedback Banner if answered -->
        ${this.lastFeedback ? `
          <div class="feedback-banner ${this.lastFeedback.correct ? 'feedback-success' : 'feedback-tryagain'}">
            ${this.lastFeedback.correct ? `
              <div class="feedback-angel-badge">
                <img src="assets/generated/angel_mascot_celebrate.jpg" alt="Celebrating Angel" class="feedback-angel-img" />
                <span class="feedback-angel-tag">Correct! ✨</span>
              </div>
            ` : `
              <span class="feedback-icon">🎈</span>
            `}
            <div class="feedback-text-content">
              <strong>${this.lastFeedback.correct ? 'Hooray! Correct Answer!' : 'Good Try!'}</strong>
              <p>${this.lastFeedback.encouragement}</p>
            </div>
            <button class="btn-bubble-next btn-gold-next" onclick="window.app.nextQuizQuestion()">
              ${this.lastFeedback.correct ? 'Next Question ➔' : 'Keep Going ➔'}
            </button>
          </div>
        ` : ''}

        <!-- Big Rounded Choice Buttons with A, B, C, D badges -->
        <div class="quiz-bubbly-grid">
          ${q.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx] || (idx + 1);
            let stateClass = '';
            if (this.lastFeedback) {
              if (idx === q.correctIndex) {
                stateClass = 'choice-correct';
              } else if (idx === this.lastFeedback.chosenIndex && !this.lastFeedback.correct) {
                stateClass = 'choice-incorrect';
              }
            }
            return `
              <button class="btn-choice-bubbly ${stateClass}" data-choice-index="${idx}" onclick="window.app.chooseQuizOption(${idx})">
                <span class="choice-num">${letter}</span>
                <span class="choice-text">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Helpful Clue and Citation -->
        <div class="quiz-bottom-clues">
          <button class="btn-clue-toggle" onclick="window.app.showQuizHint()">
            💡 Need a Clue from Leo?
          </button>
          <span class="citation-tag">📖 ${q.citation}</span>
        </div>
        <div id="quiz-hint-box" class="quiz-hint-box" style="display:none;"></div>
      </div>
    `;
  }
}
