import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Desktop Gear Button: visible and styled for desktop viewport in main.css', () => {
  const mainCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/main.css'), 'utf-8');
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');

  // Must have gear button in header
  assert.ok(html.includes('id="btn-mobile-menu"'), 'index.html must contain #btn-mobile-menu');

  // Must NOT unconditionally hide .btn-mobile-menu on desktop
  const hiddenMatch = mainCss.match(/\.btn-mobile-menu\s*\{\s*display:\s*none/);
  assert.strictEqual(hiddenMatch, null, 'main.css must NOT set .btn-mobile-menu { display: none } on desktop');

  // Must define desktop styles for .btn-mobile-menu
  assert.ok(
    mainCss.includes('.btn-mobile-menu') && (mainCss.includes('display: flex') || mainCss.includes('display: inline-flex')),
    'main.css must style .btn-mobile-menu with flex/inline-flex'
  );
});

test('Desktop Settings Pop-up: DesktopPresentation or app.js handles gear click and toggles popup', async () => {
  const appJs = fs.readFileSync(path.resolve(process.cwd(), 'src/app.js'), 'utf-8');
  const desktopJs = fs.readFileSync(path.resolve(process.cwd(), 'src/presentation/DesktopPresentation.js'), 'utf-8');

  assert.ok(appJs.includes('toggleSettingsPopup'), 'app.js must provide toggleSettingsPopup()');
  assert.ok(
    desktopJs.includes('btn-mobile-menu') || appJs.includes('btn-mobile-menu'),
    'Desktop presentation or app must wire click handler for #btn-mobile-menu'
  );
});

test('Academic Mentor Attribution: styled and centered in desktop footer and mobile banner', () => {
  const mainCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/main.css'), 'utf-8');
  const mobCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/mobile.css'), 'utf-8');

  // Footer container and mentor card must be centered
  assert.ok(mainCss.includes('.footer-container'), 'main.css must contain .footer-container');
  assert.ok(mainCss.includes('text-align: center'), 'footer must have centered text alignment');
  assert.ok(mainCss.includes('flex-direction: column') || mainCss.includes('justify-content: center'), 'footer must be centered');

  // Mobile banner must be centered
  assert.ok(mobCss.includes('.mob-mentor-banner'), 'mobile.css must style .mob-mentor-banner');
  assert.ok(mobCss.includes('text-align: center'), 'mobile banner must have centered text');
});
