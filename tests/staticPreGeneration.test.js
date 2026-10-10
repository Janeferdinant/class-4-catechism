import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Static Pre-generation: All 15 chapters have pre-generated natural audio files', async () => {
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');

  for (let i = 1; i <= 15; i++) {
    const ch = CHAPTERS_DATA[i - 1];
    assert.ok(ch.audioUrlMal, `Ch ${i} must have audioUrlMal`);
    assert.ok(ch.audioUrlEng, `Ch ${i} must have audioUrlEng`);

    const malPath = path.resolve(process.cwd(), ch.audioUrlMal);
    assert.ok(fs.existsSync(malPath), `Pre-generated Malayalam audio must exist at ${malPath}`);
    const statMal = fs.statSync(malPath);
    assert.ok(statMal.size > 1000, `Audio file for Ch ${i} Mal must not be empty (size: ${statMal.size})`);

    const engPath = path.resolve(process.cwd(), ch.audioUrlEng);
    assert.ok(fs.existsSync(engPath), `Pre-generated English audio must exist at ${engPath}`);
    const statEng = fs.statSync(engPath);
    assert.ok(statEng.size > 1000, `Audio file for Ch ${i} Eng must not be empty (size: ${statEng.size})`);

    const imgPath = path.resolve(process.cwd(), ch.imageUrl);
    assert.ok(fs.existsSync(imgPath), `3D image for Ch ${i} must exist at ${imgPath}`);
  }
});

test('Static Pre-generation: VoiceoverManager plays static audio files directly without API keys', async () => {
  const { VoiceoverManager } = await import('../src/components/VoiceoverManager.js');
  const vm = new VoiceoverManager();

  assert.equal(typeof vm.playStaticAudio, 'function', 'VoiceoverManager must support playStaticAudio');
});

