import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Settings Dropdown/Popup: index.html contains top dropdown elements and tactile gear bindings', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Must preserve required legacy test IDs
  assert.ok(html.includes('id="mobile-settings-sheet"'), 'Must contain #mobile-settings-sheet');
  assert.ok(html.includes('id="btn-mobile-menu"'), 'Must contain #btn-mobile-menu in desktop header');
  assert.ok(html.includes('id="mob-btn-menu"'), 'Must contain #mob-btn-menu in mobile header');
  assert.ok(html.includes('id="sheet-theme-btn"'), 'Must contain #sheet-theme-btn');
  assert.ok(html.includes('id="sheet-view-btn"'), 'Must contain #sheet-view-btn');
  assert.ok(html.includes('Jane Rose'), 'Must contain Asst. Prof. Jane Rose credit');

  // New Dropdown / Audio Settings elements
  assert.ok(html.includes('popup-caret') || html.includes('sheet-caret'), 'Must contain popup caret pointing to gear');
  assert.ok(html.includes('id="sheet-lang-mal"') || html.includes('data-lang="mal"'), 'Must include Malayalam narration option');
  assert.ok(html.includes('id="sheet-speed-btn"') || html.includes('data-speed'), 'Must include speech speed option');
  assert.ok(html.includes('id="sheet-sfx-toggle"') || html.includes('data-sfx'), 'Must include sound effects toggle');
});

test('Settings Dropdown/Popup: main.css & mobile.css style top-anchored popup and tactile gear rotation', () => {
  const mainCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/main.css'), 'utf-8');
  const mobCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/mobile.css'), 'utf-8');

  const combined = mainCss + mobCss;
  assert.ok(
    combined.includes('.gear-active') || combined.includes('transform: rotate'),
    'Styles must define tactile gear rotation animation'
  );
  assert.ok(
    combined.includes('top:') || combined.includes('position: fixed'),
    'Popup must be positioned relative to top header'
  );
});

test('Settings Dropdown/Popup: app.js handles toggle, gear active state, and preferences', () => {
  const appJs = fs.readFileSync(path.resolve(process.cwd(), 'src/app.js'), 'utf-8');

  assert.ok(appJs.includes('setupMobileSettingsSheet'), 'Must contain setupMobileSettingsSheet()');
  assert.ok(appJs.includes('gear-active'), 'Must toggle gear-active class on gear icon on open/close');
});
