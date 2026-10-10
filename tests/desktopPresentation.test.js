import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('DesktopPresentation: file exists and exports DesktopPresentation class', async () => {
  const compPath = path.resolve(process.cwd(), 'src/presentation/DesktopPresentation.js');
  assert.ok(fs.existsSync(compPath), 'src/presentation/DesktopPresentation.js must exist');

  const { DesktopPresentation } = await import('../src/presentation/DesktopPresentation.js');
  assert.ok(typeof DesktopPresentation === 'function', 'DesktopPresentation must be a class/constructor');
});

test('DesktopPresentation: desktop layout preserves all widescreen elements and navigation', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Verify desktop root contains full desktop components
  assert.ok(html.includes('id="desktop-layout-root"'), 'index.html must have #desktop-layout-root');
  assert.ok(html.includes('class="app-header"'), 'desktop layout must retain full .app-header');
  assert.ok(html.includes('class="nav-tabs"'), 'desktop layout must retain wide .nav-tabs');
  assert.ok(html.includes('id="three-canvas-container"'), 'desktop layout must retain 3D WebGL container');
  assert.ok(html.includes('id="three-node-drawer"'), 'desktop layout must retain 3D side drawer');
  assert.ok(html.includes('id="btn-stop-audio-global"'), 'desktop layout must retain stop audio button');
  assert.ok(html.includes('id="header-star-count"'), 'desktop layout must retain star counter');
});

test('DesktopPresentation: desktop styles preserve multi-column grid on desktop screens', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('.universe-layout'), 'main.css must retain .universe-layout grid');
  assert.ok(css.includes('grid-template-columns'), 'main.css must retain multi-column grid layout');
});
