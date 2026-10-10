import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile App Navigation: index.html contains dedicated mobile bottom navigation bar', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('class="mobile-bottom-nav"') || html.includes('id="mobile-bottom-nav"'), 'index.html must contain a mobile bottom navigation bar');

  // Verify all 5 views are present in mobile bottom nav
  const expectedViews = ['universe', 'slides', 'classroom', 'solver', 'quiz'];
  expectedViews.forEach(view => {
    assert.ok(html.includes(`data-view="${view}"`), `Bottom nav must include view: ${view}`);
  });
});

test('Mobile App Navigation: main.css styles fixed bottom nav with thumb touch targets', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('.mobile-bottom-nav'), 'main.css must style .mobile-bottom-nav');
  assert.ok(css.includes('position: fixed'), 'main.css must fix bottom nav at bottom of screen');
  assert.ok(css.includes('.mobile-nav-item'), 'main.css must style .mobile-nav-item touch targets');
});

test('Mobile App Navigation: app.js synchronizes view switching with mobile bottom nav', () => {
  const appJsPath = path.resolve(process.cwd(), 'src/app.js');
  const appJs = fs.readFileSync(appJsPath, 'utf-8');

  assert.ok(appJs.includes('.mobile-nav-item'), 'app.js must synchronize .mobile-nav-item buttons on view switch');
});
