import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const load = async () => {
  const narration = await import('../src/data/narration.js');
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');
  const { EXAM_PAPERS_DATA } = await import('../src/data/examPapersData.js');
  const { KID_QUIZ_QUESTIONS } = await import('../src/data/quizQuestionsData.js');
  const clips = narration.buildNarrationScripts();
  const has = (id, lang) => clips.some(c => c.id === id && c.lang === lang);
  return { narration, CHAPTERS_DATA, EXAM_PAPERS_DATA, KID_QUIZ_QUESTIONS, clips, has };
};

test('Narration: every chapter has story, moral, scripture and key concepts in both languages', async () => {
  const { narration, CHAPTERS_DATA, has } = await load();
  for (const ch of CHAPTERS_DATA) {
    for (const part of ['story', 'moral', 'scripture', 'concepts']) {
      const id = narration.clipIds.chapter(ch.number, part);
      assert.ok(has(id, 'mal'), `${id} Malayalam`);
      assert.ok(has(id, 'eng'), `${id} English`);
    }
  }
});

test('Narration: every exam question and quiz question can be read in both languages', async () => {
  const { narration, EXAM_PAPERS_DATA, KID_QUIZ_QUESTIONS, has } = await load();
  for (const paper of EXAM_PAPERS_DATA) {
    for (const q of paper.questions) {
      assert.ok(has(narration.clipIds.exam(q.id), 'mal'), `exam ${q.id} Malayalam`);
      assert.ok(has(narration.clipIds.exam(q.id), 'eng'), `exam ${q.id} English`);
    }
  }
  for (const q of KID_QUIZ_QUESTIONS) {
    assert.ok(has(narration.clipIds.quiz(q.id), 'mal'), `quiz ${q.id} Malayalam`);
    assert.ok(has(narration.clipIds.quiz(q.id), 'eng'), `quiz ${q.id} English`);
    if (q.eli5Hint) assert.ok(has(narration.clipIds.quizHint(q.id), 'eng'), `quiz ${q.id} clue`);
  }
});

test('Narration: Malayalam scripts speak numbers as words and drop English glosses', async () => {
  const { clips } = await load();
  for (const clip of clips.filter(c => c.lang === 'mal')) {
    assert.ok(!/\d/.test(clip.text), `${clip.id} should not contain digits: ${clip.text.slice(0, 80)}`);
  }
  const quiz = clips.find(c => c.id === 'quiz-kq_1' && c.lang === 'mal');
  assert.ok(quiz && !/Divine Life/.test(quiz.text), 'English gloss removed from Malayalam option');
});

test('Narration: chapter audio URLs point at the rendered story clips', async () => {
  const { CHAPTERS_DATA } = await load();
  for (const ch of CHAPTERS_DATA) {
    assert.equal(ch.audioUrlMal, `assets/audio/narration/mal/ch${ch.number}-story.mp3`);
    assert.equal(ch.audioUrlEng, `assets/audio/narration/eng/ch${ch.number}-story.mp3`);
  }
});

test('Narration: every script has a rendered clip in the manifest', async () => {
  const { clips } = await load();
  const { NARRATION_MANIFEST } = await import('../src/data/narrationManifest.js');
  const missing = clips.filter(c => !(NARRATION_MANIFEST[c.id] && NARRATION_MANIFEST[c.id][c.lang]));
  assert.deepEqual(missing.map(c => `${c.lang}/${c.id}`), [], 'run: python scripts/generate_omnivoice_audio.py');
  for (const [id, langs] of Object.entries(NARRATION_MANIFEST)) {
    for (const [lang, entry] of Object.entries(langs)) {
      const file = path.resolve(entry.src.split('?')[0]);
      assert.ok(fs.existsSync(file), `${lang}/${id} file exists`);
      assert.ok(fs.statSync(file).size > 2000, `${lang}/${id} is not empty`);
    }
  }
});
