import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Features Restoration: image paths and textbook toggle', () => {
  const mobJsPath = path.resolve(process.cwd(), 'src/presentation/MobilePresentation.js');
  const mobJs = fs.readFileSync(mobJsPath, 'utf-8');

  // Verify no broken undefined imagePrompt references
  assert.ok(!mobJs.includes('ch.imagePrompt'), 'MobilePresentation.js must not reference undefined ch.imagePrompt');
  assert.ok(mobJs.includes('imageUrl'), 'MobilePresentation.js must use valid ch.imageUrl');
  assert.ok(mobJs.includes('textbookUrl'), 'MobilePresentation.js must support textbook scans via ch.textbookUrl');
  assert.ok(mobJs.includes('toggleArtMode') || mobJs.includes('toggleSlideArtMode'), 'MobilePresentation.js must allow toggling textbook scans');
});

test('Mobile Features Restoration: bilingual audio buttons', () => {
  const mobJsPath = path.resolve(process.cwd(), 'src/presentation/MobilePresentation.js');
  const mobJs = fs.readFileSync(mobJsPath, 'utf-8');

  // Verify both Malayalam and English voice triggers
  assert.ok(mobJs.includes("playVoice('mal'") || mobJs.includes('playVoice("mal"'), 'Must have Malayalam voice trigger');
  assert.ok(mobJs.includes("playVoice('eng'") || mobJs.includes('playVoice("eng"'), 'Must have English voice trigger');
});

test('Mobile Features Restoration: navigation syntax and scripture properties', () => {
  const mobJsPath = path.resolve(process.cwd(), 'src/presentation/MobilePresentation.js');
  const mobJs = fs.readFileSync(mobJsPath, 'utf-8');

  // Verify no unquoted ch.id in inline onclick
  assert.ok(!mobJs.includes('jumpToChapterLesson(${ch.id})'), 'Must not generate unquoted jumpToChapterLesson(ch1) which throws ReferenceError');
  // Verify correct scripture properties
  assert.ok(!mobJs.includes('ch.verseMal'), 'Must not reference non-existent ch.verseMal');
  assert.ok(mobJs.includes('ch.scripture'), 'Must reference valid ch.scripture');
});
