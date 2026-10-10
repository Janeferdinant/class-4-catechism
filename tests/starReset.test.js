import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Star Reset: app.js contains updateStarsBadge and resets adventure-stars key', () => {
  const appJs = fs.readFileSync(path.resolve(process.cwd(), 'src/app.js'), 'utf-8');

  // Must have updateStarsBadge to prevent TypeError
  assert.ok(appJs.includes('updateStarsBadge('), 'app.js must define updateStarsBadge method');

  // Must reset adventure-stars in localStorage
  assert.ok(
    appJs.includes("localStorage.setItem('adventure-stars', '0')") ||
    appJs.includes('localStorage.setItem("adventure-stars", "0")') ||
    appJs.includes("localStorage.setItem('adventure-stars', 0)"),
    'reset handler must set adventure-stars to 0 in localStorage'
  );
});

test('Desktop Attribution: uses same centered implementation as mobile version', () => {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
  const mainCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/main.css'), 'utf-8');

  // Desktop footer must have centered mentor banner structure
  assert.ok(html.includes('mob-mentor-banner') || html.includes('desktop-mentor-banner'), 'footer must use mentor banner container');
  assert.ok(html.includes('mob-mentor-icon') || html.includes('mentor-badge-avatar'), 'footer must contain mentor icon');
  assert.ok(html.includes('mob-mentor-role') || html.includes('mentor-role-badge'), 'footer must contain mentor role');
  assert.ok(html.includes('Asst. Prof. Jane Rose'), 'footer must contain Asst. Prof. Jane Rose');
  assert.ok(html.includes('Department of Computer Science & Engineering (CSE)'), 'footer must contain CSE department');

  // Must NOT have align-items: flex-start on .footer-container
  const flexStartMatch = mainCss.match(/\.footer-container\s*\{[^}]*align-items:\s*flex-start/);
  assert.strictEqual(flexStartMatch, null, 'footer-container must NOT have align-items: flex-start');
});
