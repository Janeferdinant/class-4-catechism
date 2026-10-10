import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Settings Sheet: index.html contains slide-up bottom sheet with theme, view mode, and attribution', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('id="mobile-settings-sheet"'), 'index.html must contain #mobile-settings-sheet');
  assert.ok(html.includes('id="btn-mobile-menu"'), 'index.html must contain #btn-mobile-menu in header');
  assert.ok(html.includes('id="sheet-theme-btn"'), 'index.html must contain #sheet-theme-btn in sheet');
  assert.ok(html.includes('id="sheet-view-btn"'), 'index.html must contain #sheet-view-btn in sheet');
  assert.ok(html.includes('Jane Rose'), 'index.html sheet must include Asst. Prof. Jane Rose credit');
});

test('Mobile Settings Sheet: app.js contains setupMobileSettingsSheet listener binding', () => {
  const appJsPath = path.resolve(process.cwd(), 'src/app.js');
  const appJs = fs.readFileSync(appJsPath, 'utf-8');

  assert.ok(appJs.includes('setupMobileSettingsSheet'), 'app.js must implement setupMobileSettingsSheet()');
});

test('Mobile Settings Sheet: main.css styles slideUp animation and sheet card', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('.mobile-settings-sheet'), 'main.css must style .mobile-settings-sheet');
  assert.ok(css.includes('@keyframes slideUp'), 'main.css must define slideUp keyframes');
});
