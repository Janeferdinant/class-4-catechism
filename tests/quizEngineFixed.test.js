import test from 'node:test';
import assert from 'node:assert/strict';

test('Kid-friendly quiz dataset structure', async () => {
  const { KID_QUIZ_QUESTIONS } = await import('../src/data/quizQuestionsData.js');
  assert.ok(Array.isArray(KID_QUIZ_QUESTIONS), 'KID_QUIZ_QUESTIONS must be an array');
  assert.ok(KID_QUIZ_QUESTIONS.length >= 10, 'Must have at least 10 quiz questions');

  KID_QUIZ_QUESTIONS.forEach((q, idx) => {
    assert.ok(q.id, `Q${idx} must have id`);
    assert.ok(q.questionEng, `Q${idx} must have questionEng`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Q${idx} must have at least 3 options`);
    assert.ok(typeof q.correctIndex === 'number', `Q${idx} must have correctIndex`);
    assert.ok(q.options[q.correctIndex], `Q${idx} correctIndex must point to valid option`);
    assert.ok(q.citation, `Q${idx} must have citation`);
  });
});

test('QuizEngine event-based answering with positive reinforcement', async () => {
  const { QuizEngine } = await import('../src/components/QuizEngine.js');
  const { KID_QUIZ_QUESTIONS } = await import('../src/data/quizQuestionsData.js');

  const engine = new QuizEngine();
  engine.loadQuestions(KID_QUIZ_QUESTIONS);

  assert.equal(engine.getScore(), 0);
  assert.equal(engine.getStars(), 0);

  const current = engine.getCurrentQuestion();
  assert.ok(current);

  // Correct answer
  const res = engine.answerByIndex(current.correctIndex);
  assert.equal(res.correct, true);
  assert.equal(engine.getStars(), 1);
  assert.ok(engine.getScore() > 0);
});
