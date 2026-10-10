import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Chapters data must contain story5yoMal and moralLessonMal for all 15 chapters', async () => {
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');
  assert.equal(CHAPTERS_DATA.length, 15, 'Must have 15 chapters');

  CHAPTERS_DATA.forEach((ch, idx) => {
    assert.ok(ch.titleMal, `Ch ${idx + 1} must have titleMal`);
    assert.ok(ch.story5yoMal, `Ch ${idx + 1} must have story5yoMal`);
    assert.ok(ch.moralLessonMal, `Ch ${idx + 1} must have moralLessonMal`);
    assert.ok(ch.scripture, `Ch ${idx + 1} must have scripture in Malayalam`);

    // Verify Malayalam characters are present in story5yoMal
    assert.match(ch.story5yoMal, /[\u0D00-\u0D7F]/, `Ch ${idx + 1} story5yoMal must contain Malayalam unicode characters`);
    assert.match(ch.moralLessonMal, /[\u0D00-\u0D7F]/, `Ch ${idx + 1} moralLessonMal must contain Malayalam unicode characters`);
  });
});

test('VoiceoverManager Malayalam detection and stop functionality', async () => {
  const { VoiceoverManager } = await import('../src/components/VoiceoverManager.js');
  const vm = new VoiceoverManager();

  assert.equal(typeof vm.stop, 'function');
  assert.equal(typeof vm.speak, 'function');
  assert.equal(typeof vm.speakMalayalam, 'function');

  // Verify language detection helper
  assert.equal(vm.isMalayalamText('ഈശോ ജീവന്റെ ഉറവിടം'), true);
  assert.equal(vm.isMalayalamText('Jesus is the Bread of Life'), false);
});

test('index.html must contain global Stop Audio button and Malayalam labels', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(htmlContent.includes('id="btn-stop-audio-global"'), 'Must have #btn-stop-audio-global');
});

test('StoryClassroom renders Malayalam story, scripture, and Malayalam audio button', async () => {
  const { StoryClassroomManager } = await import('../src/components/StoryClassroom.js');
  const sc = new StoryClassroomManager();
  const lesson = sc.getLesson(1);
  const html = sc.renderLessonCard(lesson);

  assert.ok(html.includes('story-text-mal') || html.includes('fairy-tale-mal'), 'Must render Malayalam story container');
  assert.ok(html.includes('speakStoryMal'), 'Must have speakStoryMal audio trigger');
  assert.ok(html.includes('stopVoice'), 'Must have stop voice control');
});
