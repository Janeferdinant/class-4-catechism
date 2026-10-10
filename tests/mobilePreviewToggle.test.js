import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Preview: index.html contains preview simulator container, width presets, and exit button', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('id="mobile-preview-frame-container"'), 'index.html must have #mobile-preview-frame-container');
  assert.ok(html.includes('id="btn-exit-mobile-preview"'), 'index.html must have #btn-exit-mobile-preview');
  assert.ok(html.includes('data-width="320"'), 'must have 320px preset');
  assert.ok(html.includes('data-width="375"'), 'must have 375px preset');
  assert.ok(html.includes('data-width="390"'), 'must have 390px preset');
  assert.ok(html.includes('data-width="430"'), 'must have 430px preset');
});

test('Mobile Preview: desktop header contains clearly labeled Preview Mobile Layout control', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(
    html.includes('id="btn-desktop-preview-mobile"') || html.includes('id="btn-mobile-toggle"'),
    'must have preview mobile trigger button in header'
  );
  assert.ok(
    html.includes('Preview Mobile') || html.includes('Preview Mobile Layout') || html.includes('Mobile View'),
    'button must be clearly labeled'
  );
});

test('Mobile Preview: LayoutSelector handles preview activation and exit cleanly', async () => {
  const { LayoutSelector } = await import('../src/presentation/LayoutSelector.js');
  const selector = new LayoutSelector();

  assert.equal(typeof selector.previewMobile, 'function', 'previewMobile must be a function');
  assert.equal(typeof selector.exitPreview, 'function', 'exitPreview must be a function');

  // Activate preview with 375px
  selector.previewMobile(375);
  assert.equal(selector.currentMode, 'preview', 'mode must be preview');
  assert.equal(selector.previewWidth, 375, 'preview width must be set to 375');
  assert.equal(selector.activeLayout, 'preview', 'active layout must be preview');

  // Exit preview
  selector.exitPreview();
  assert.equal(selector.currentMode, 'auto', 'mode must return to auto');
});
