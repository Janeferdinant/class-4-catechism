import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CHAPTERS_DATA } from '../src/data/chaptersData.js';

test('Bilingual Audio Assets: All 15 chapters have non-empty Malayalam and English MP3 files', () => {
  assert.equal(CHAPTERS_DATA.length, 15, 'Must have 15 chapters');

  CHAPTERS_DATA.forEach(ch => {
    assert.ok(ch.audioUrlMal, `Chapter ${ch.number} must have audioUrlMal`);
    assert.ok(ch.audioUrlEng, `Chapter ${ch.number} must have audioUrlEng`);

    const malPath = path.resolve(process.cwd(), ch.audioUrlMal);
    const engPath = path.resolve(process.cwd(), ch.audioUrlEng);

    assert.ok(fs.existsSync(malPath), `Malayalam audio file must exist: ${ch.audioUrlMal}`);
    assert.ok(fs.existsSync(engPath), `English audio file must exist: ${ch.audioUrlEng}`);

    const malStat = fs.statSync(malPath);
    const engStat = fs.statSync(engPath);

    assert.ok(malStat.size > 10000, `Malayalam audio file must be non-empty (>10KB): ${ch.audioUrlMal}`);
    assert.ok(engStat.size > 10000, `English audio file must be non-empty (>10KB): ${ch.audioUrlEng}`);
  });
});

test('AppController Audio Architecture: implements playVoice and stopVoice methods', () => {
  const appJsPath = path.resolve(process.cwd(), 'src/app.js');
  const appJs = fs.readFileSync(appJsPath, 'utf-8');

  assert.ok(appJs.includes('playVoice('), 'app.js must implement playVoice(lang, chNumber)');
  assert.ok(appJs.includes('stopVoice('), 'app.js must implement stopVoice()');
  assert.ok(appJs.includes('audioUrlMal'), 'app.js must reference audioUrlMal');
  assert.ok(appJs.includes('audioUrlEng'), 'app.js must reference audioUrlEng');
});
