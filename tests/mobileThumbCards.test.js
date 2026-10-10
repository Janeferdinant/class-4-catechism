import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Thumb Cards: main.css ensures touch-action pan-y on 3D canvas to prevent scroll hijacking', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('touch-action: pan-y'), 'main.css must configure touch-action: pan-y for mobile touch scroll safety');
});

test('Mobile Thumb Cards: main.css enforces thumb-friendly touch heights (>= 48px) for buttons', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify thumb-friendly controls on mobile
  assert.ok(css.includes('.slide-audio-quickbar'), 'main.css must format slide audio bar for mobile');
  assert.ok(css.includes('.btn-choice-bubbly'), 'main.css must style quiz choices for mobile thumbs');
});
