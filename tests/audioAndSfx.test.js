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

test('VoiceoverManager resilience and voice presets', async () => {
  const { VoiceoverManager } = await import('../src/components/VoiceoverManager.js');
  const vm = new VoiceoverManager();
  assert.ok(vm, 'VoiceoverManager must be instantiable');
  assert.equal(vm.character, 'leo');

  vm.setCharacter('bella');
  assert.equal(vm.character, 'bella');
  assert.ok(vm.pitch > 1.0, 'Bella should have gentle pitch');

  vm.setCharacter('sammy');
  assert.equal(vm.character, 'sammy');

  // Stop should not crash
  vm.stop();
  assert.equal(vm.isPlaying(), false);
});
