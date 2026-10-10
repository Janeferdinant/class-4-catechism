import test from 'node:test';
import assert from 'node:assert/strict';

test('QuizEngine scoring and state management', async () => {
  const { QuizEngine } = await import('../src/components/QuizEngine.js');
  const quiz = new QuizEngine();

  const questions = [
    { id: 'q1', question: 'Test Q1', correctAnswer: 'A', options: ['A', 'B', 'C'] },
    { id: 'q2', question: 'Test Q2', correctAnswer: 'B', options: ['A', 'B', 'C'] }
  ];
  quiz.loadQuestions(questions);

  assert.equal(quiz.getScore(), 0);
  assert.equal(quiz.getCurrentQuestionIndex(), 0);

  // Answer correctly
  const result1 = quiz.answerQuestion('A');
  assert.equal(result1.correct, true);
  assert.equal(quiz.getScore(), 10);

  // Answer incorrectly
  quiz.nextQuestion();
  const result2 = quiz.answerQuestion('A');
  assert.equal(result2.correct, false);
  assert.equal(quiz.getScore(), 10);
});

test('VoiceoverManager audio state and fallback', async () => {
  const { VoiceoverManager } = await import('../src/components/VoiceoverManager.js');
  const voice = new VoiceoverManager();

  assert.equal(voice.isPlaying(), false);
  assert.equal(typeof voice.speak, 'function');
  assert.equal(typeof voice.stop, 'function');
  assert.equal(typeof voice.setRate, 'function');
  assert.equal(typeof voice.setPitch, 'function');
});
