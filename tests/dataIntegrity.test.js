import test from 'node:test';
import assert from 'node:assert/strict';

test('Data Integrity: Chapters Data', async () => {
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');
  assert.ok(Array.isArray(CHAPTERS_DATA), 'CHAPTERS_DATA must be an array');
  assert.equal(CHAPTERS_DATA.length, 15, 'Must contain exactly 15 chapters');

  CHAPTERS_DATA.forEach((ch, idx) => {
    assert.equal(ch.number, idx + 1, `Chapter number must match index ${idx + 1}`);
    assert.ok(ch.titleMal, `Chapter ${idx + 1} must have titleMal`);
    assert.ok(ch.titleEng, `Chapter ${idx + 1} must have titleEng`);
    assert.ok(ch.story5yo, `Chapter ${idx + 1} must have a 5yo story`);
    assert.ok(ch.moralLesson, `Chapter ${idx + 1} must have a moralLesson`);
    assert.ok(ch.scripture, `Chapter ${idx + 1} must have scripture`);
    assert.ok(Array.isArray(ch.keyConcepts) && ch.keyConcepts.length > 0, `Chapter ${idx + 1} must have key concepts`);
  });
});

test('Data Integrity: Exam Papers Data', async () => {
  const { EXAM_PAPERS_DATA } = await import('../src/data/examPapersData.js');
  assert.ok(Array.isArray(EXAM_PAPERS_DATA), 'EXAM_PAPERS_DATA must be an array');
  assert.equal(EXAM_PAPERS_DATA.length, 5, 'Must contain exactly 5 question papers');

  const paperKeys = ['2023_s1', '2023_s2', '2024_s1', '2025_s1', '2025_s2'];
  paperKeys.forEach(key => {
    const paper = EXAM_PAPERS_DATA.find(p => p.id === key);
    assert.ok(paper, `Paper with id ${key} must exist`);
    assert.ok(Array.isArray(paper.questions) && paper.questions.length >= 10, `Paper ${key} must have questions`);
    
    paper.questions.forEach((q, qIdx) => {
      assert.ok(q.qMal, `Paper ${key} Q${qIdx + 1} must have qMal`);
      assert.ok(q.answerMal || q.answerEng, `Paper ${key} Q${qIdx + 1} must have answer`);
      assert.ok(q.citation, `Paper ${key} Q${qIdx + 1} must have citation`);
      assert.ok(q.eli5, `Paper ${key} Q${qIdx + 1} must have eli5 explanation`);
    });
  });
});

test('Data Integrity: Knowledge Graph Data', async () => {
  const { GRAPH_DATA } = await import('../src/data/knowledgeGraphData.js');
  assert.ok(GRAPH_DATA.nodes && Array.isArray(GRAPH_DATA.nodes), 'GRAPH_DATA must have nodes array');
  assert.ok(GRAPH_DATA.edges && Array.isArray(GRAPH_DATA.edges), 'GRAPH_DATA must have edges array');
  assert.ok(GRAPH_DATA.nodes.length >= 25, 'GRAPH_DATA should contain chapter and sacrament nodes');
});
