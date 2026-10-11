import test from 'node:test';
import assert from 'node:assert/strict';

test('SoundEffects component synthesizer methods', async () => {
  const { SoundEffects } = await import('../src/components/SoundEffects.js');
  const sfx = new SoundEffects();
  assert.ok(sfx, 'SoundEffects must be instantiable');
  assert.equal(typeof sfx.playChime, 'function');
  assert.equal(typeof sfx.playSparkle, 'function');
  assert.equal(typeof sfx.playPop, 'function');
  assert.equal(typeof sfx.playCheer, 'function');

  // Should execute cleanly without throwing even without window AudioContext in Node
  sfx.playChime();
  sfx.playSparkle();
  sfx.playPop();
  sfx.playCheer();
});

test('VoiceoverManager plays pre-rendered clips with live pace and language settings', async () => {
  const { VoiceoverManager, MIN_RATE, MAX_RATE } = await import('../src/components/VoiceoverManager.js');
  const manifest = {
    'ch1-story': { mal: { src: 'mal.mp3', seconds: 30 }, eng: { src: 'eng.mp3', seconds: 26 } },
    'node-agent_quiz': { eng: { src: 'agent.mp3', seconds: 4 } }
  };
  const vm = new VoiceoverManager({ manifest });
  assert.ok(vm, 'VoiceoverManager must be instantiable');

  // Pace slider range is clamped
  assert.equal(vm.setRate(0.1), MIN_RATE);
  assert.equal(vm.setRate(9), MAX_RATE);
  assert.equal(vm.setRate(0.85), 0.85);

  // Clip lookup per language
  assert.equal(vm.hasClip('ch1-story', 'mal'), true);
  assert.equal(vm.hasClip('node-agent_quiz', 'mal'), false);
  assert.equal(vm.setLanguage('eng'), 'eng');

  // Missing clips report as unavailable instead of falling back to robotic speech
  let unavailable = null;
  vm.onUnavailable = (id, lang) => { unavailable = `${id}/${lang}`; };
  assert.equal(vm.playClip('node-agent_quiz', 'mal'), false);
  assert.equal(unavailable, 'node-agent_quiz/mal');

  // Stop should not crash
  vm.stop();
  assert.equal(vm.isPlaying(), false);
});

test('VoiceoverManager never uses browser speech synthesis', async () => {
  const fs = await import('node:fs');
  const code = fs.readFileSync(new URL('../src/components/VoiceoverManager.js', import.meta.url), 'utf8');
  assert.ok(!/speechSynthesis|SpeechSynthesisUtterance/.test(code), 'narration must only use rendered audio clips');
});
