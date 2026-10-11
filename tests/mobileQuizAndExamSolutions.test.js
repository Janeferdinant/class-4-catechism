import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { MobilePresentation } from '../src/presentation/MobilePresentation.js';
import { EXAM_PAPERS_DATA } from '../src/data/examPapersData.js';
import { KID_QUIZ_QUESTIONS } from '../src/data/quizQuestionsData.js';

test('Mobile Exam Solutions: renders verified answer, 5yo explanation, and citations correctly', () => {
  const mobPresCode = fs.readFileSync(path.resolve('src/presentation/MobilePresentation.js'), 'utf8');

  // Verify it doesn't use broken property q.ansMal or q.num
  assert.ok(
    mobPresCode.includes('q.answerMal'),
    'MobilePresentation must reference q.answerMal for verified exam solutions'
  );
  assert.ok(
    mobPresCode.includes('q.qNumber'),
    'MobilePresentation must reference q.qNumber for question numbering'
  );
  assert.ok(
    mobPresCode.includes('q.eli5'),
    'MobilePresentation must display q.eli5 for child-friendly explanations'
  );

  // Setup DOM mock to test renderExamSolverView
  const fakeDoc = {
    elements: {},
    getElementById(id) {
      if (!this.elements[id]) {
        this.elements[id] = { innerHTML: '', value: '', addEventListener() {} };
      }
      return this.elements[id];
    }
  };
  globalThis.document = fakeDoc;

  const mockApp = {
    sfx: { playPop: () => {}, playChime: () => {}, playFanfare: () => {} },
    starsCount: 5,
    addStar: () => {}
  };

  const pres = new MobilePresentation(mockApp);
  pres.activePaperId = '2023_s1';
  pres.renderExamSolverView();

  const renderedList = fakeDoc.getElementById('mob-exam-questions-list').innerHTML;
  const firstQ = EXAM_PAPERS_DATA[0].questions[0];

  assert.ok(
    renderedList.includes(firstQ.answerMal),
    `Rendered mobile exam solutions must contain answerMal "${firstQ.answerMal}"`
  );
  assert.ok(
    renderedList.includes(firstQ.eli5),
    `Rendered mobile exam solutions must contain 5yo explanation`
  );
  assert.ok(
    renderedList.includes(`Q${firstQ.qNumber}`),
    `Rendered mobile exam solutions must contain question number Q${firstQ.qNumber}`
  );
});

test('Mobile Quiz: allows progression to next question after right or wrong answers, and completion screen', () => {
  const createMockEl = () => ({
    innerHTML: '',
    style: {},
    className: '',
    disabled: false,
    classList: {
      classes: new Set(),
      add(cls) { this.classes.add(cls); },
      remove(cls) { this.classes.delete(cls); },
      contains(cls) { return this.classes.has(cls); }
    },
    addEventListener() {}
  });

  const fakeDoc = {
    elements: {},
    getElementById(id) {
      if (!this.elements[id]) {
        this.elements[id] = createMockEl();
      }
      return this.elements[id];
    },
    querySelectorAll() {
      return [];
    }
  };
  globalThis.document = fakeDoc;

  // Stars are awarded once per question id
  const awarded = new Set();
  const mockApp = {
    sfx: { playPop: () => {}, playChime: () => {}, playFanfare: () => {}, playCheer: () => {} },
    starsCount: 0,
    awardQuizStar: (id) => {
      if (awarded.has(id)) return false;
      awarded.add(id);
      mockApp.starsCount = awarded.size;
      return true;
    }
  };

  const pres = new MobilePresentation(mockApp);
  pres.init();
  pres.renderQuizView();

  const container = fakeDoc.getElementById('mob-quiz-card-container');
  assert.ok(container.innerHTML.includes('Question 1 of'), 'Quiz should render question progress header');

  // Test Wrong Answer: must provide a next question / continue button
  const currentQ = KID_QUIZ_QUESTIONS[0];
  const wrongIndex = (currentQ.correctIndex + 1) % currentQ.options.length;
  pres.handleQuizAnswer(wrongIndex, currentQ.correctIndex);

  const feedback = fakeDoc.getElementById('mob-quiz-feedback');
  assert.ok(
    feedback.innerHTML.includes('nextQuizQuestion'),
    'Feedback after wrong answer MUST contain a button/action to advance to the next question'
  );

  // Advance to next question
  const initialIndex = pres.currentQuizIndex;
  pres.nextQuizQuestion();
  assert.strictEqual(pres.currentQuizIndex, initialIndex + 1, 'nextQuizQuestion must increment currentQuizIndex');

  // Test Correct Answer: awards star and gives next button
  const nextQ = KID_QUIZ_QUESTIONS[pres.currentQuizIndex % KID_QUIZ_QUESTIONS.length];
  pres.handleQuizAnswer(nextQ.correctIndex, nextQ.correctIndex);
  assert.equal(awarded.size, 1, 'Correct answer must award star');
  assert.ok(awarded.has(nextQ.id), 'Star is recorded against the question id');
  assert.ok(
    feedback.innerHTML.includes('nextQuizQuestion'),
    'Feedback after correct answer MUST contain next question button'
  );
});
