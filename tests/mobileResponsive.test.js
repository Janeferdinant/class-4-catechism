import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Responsiveness: index.html has mobile view toggle and proper viewport meta', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // Verify viewport meta tag exists
  assert.ok(htmlContent.includes('name="viewport"'), 'index.html must include viewport meta tag');
  assert.ok(htmlContent.includes('width=device-width'), 'viewport must configure width=device-width');

  // Verify mobile view toggle button exists
  assert.ok(
    htmlContent.includes('id="btn-mobile-toggle"') || htmlContent.includes('id="btn-view-mode-toggle"'),
    'index.html must include a mobile view toggle button'
  );
});

test('Mobile Responsiveness: main.css contains mobile breakpoints and .mobile-view-active rules', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Verify key mobile breakpoints
  assert.ok(cssContent.includes('@media (max-width: 768px)'), 'main.css must contain max-width: 768px query');
  assert.ok(cssContent.includes('@media (max-width: 480px)'), 'main.css must contain max-width: 480px query for phones');
  assert.ok(cssContent.includes('@media (max-width: 360px)'), 'main.css must contain max-width: 360px query for compact screens');

  // Verify mobile view toggle class exists
  assert.ok(cssContent.includes('.mobile-view-active'), 'main.css must contain .mobile-view-active override class');

  // Verify touch target min-height rules exist (>= 44px)
  assert.ok(cssContent.includes('min-height: 44px') || cssContent.includes('min-height: 46px') || cssContent.includes('min-height: 48px'), 'main.css must ensure minimum touch targets');
});
