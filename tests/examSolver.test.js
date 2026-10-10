import test from 'node:test';
import assert from 'node:assert/strict';

test('ExamSolverView filtering and citation resolution', async () => {
  const { ExamSolverView } = await import('../src/components/ExamSolverView.js');
  const { EXAM_PAPERS_DATA } = await import('../src/data/examPapersData.js');

  const solver = new ExamSolverView(EXAM_PAPERS_DATA);

  // Test 1: Retrieve paper by ID
  const paper2025 = solver.getPaper('2025_s1');
  assert.ok(paper2025, 'Must return 2025 paper');
  assert.equal(paper2025.id, '2025_s1');
  assert.ok(paper2025.questions.length >= 10);

  // Test 2: Search questions across all papers
  const matches = solver.searchQuestions('പെസഹാ');
  assert.ok(matches.length > 0, 'Search for Pesaha should find questions');
  assert.ok(matches[0].citation.includes('Chapter 6'));

  // Test 3: Citation verification
  const qWithCitation = paper2025.questions[0];
  assert.ok(qWithCitation.citation, 'Question must have citation');
  assert.ok(qWithCitation.eli5, 'Question must have ELI5 note');
});
