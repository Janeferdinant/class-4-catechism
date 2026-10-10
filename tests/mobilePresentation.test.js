import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MobilePresentation: file exists and exports MobilePresentation class', async () => {
  const compPath = path.resolve(process.cwd(), 'src/presentation/MobilePresentation.js');
  assert.ok(fs.existsSync(compPath), 'src/presentation/MobilePresentation.js must exist');

  const { MobilePresentation } = await import('../src/presentation/MobilePresentation.js');
  assert.ok(typeof MobilePresentation === 'function', 'MobilePresentation must be a class/constructor');
});

test('MobilePresentation: mobile.css stylesheet exists with dedicated mobile rules', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/mobile.css');
  assert.ok(fs.existsSync(cssPath), 'src/styles/mobile.css must exist');

  const css = fs.readFileSync(cssPath, 'utf-8');
  assert.ok(css.includes('.mob-bottom-nav') || css.includes('.mobile-app-header'), 'mobile.css must style dedicated mobile components');
  assert.ok(css.includes('min-height: 48px') || css.includes('min-height: 52px') || css.includes('min-height: 44px'), 'mobile.css must enforce touch targets');
});

test('MobilePresentation: index.html links src/styles/mobile.css', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('src/styles/mobile.css'), 'index.html must link src/styles/mobile.css');
});
