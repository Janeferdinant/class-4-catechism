import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { LayoutSelector } from '../src/presentation/LayoutSelector.js';

test('LayoutSelector: automatic layout determination and breakpoint logic', async () => {
  const selector = new LayoutSelector({ mobileBreakpoint: 768 });

  // Mobile widths
  assert.strictEqual(selector.determineLayout(320), 'mobile');
  assert.strictEqual(selector.determineLayout(360), 'mobile');
  assert.strictEqual(selector.determineLayout(375), 'mobile');
  assert.strictEqual(selector.determineLayout(390), 'mobile');
  assert.strictEqual(selector.determineLayout(430), 'mobile');
  assert.strictEqual(selector.determineLayout(768), 'mobile');

  // Desktop widths
  assert.strictEqual(selector.determineLayout(769), 'desktop');
  assert.strictEqual(selector.determineLayout(1024), 'desktop');
  assert.strictEqual(selector.determineLayout(1440), 'desktop');
});

test('Zero-Flash Layout Architecture: pure CSS media queries for instant viewport adaptation', async () => {
  const mobileCss = fs.readFileSync(path.resolve('src/styles/mobile.css'), 'utf8');

  // Verify pure CSS rules exist for instant layout selection without JS flash
  assert.ok(
    mobileCss.includes('@media (max-width: 768px)') &&
    mobileCss.includes('#desktop-layout-root') &&
    mobileCss.includes('#mobile-layout-root'),
    'mobile.css must include zero-flash CSS media query @media (max-width: 768px) switching roots'
  );

  assert.ok(
    mobileCss.includes('@media (min-width: 769px)'),
    'mobile.css must include @media (min-width: 769px) preserving desktop view on wide screens'
  );
});

test('Mobile Header Theme Toggle: 1-tap theme button exists in header and is wired', async () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(
    indexHtml.includes('id="mob-btn-theme"'),
    'index.html mobile header must include #mob-btn-theme for 1-tap theme switching'
  );

  const mobPresCode = fs.readFileSync(path.resolve('src/presentation/MobilePresentation.js'), 'utf8');
  assert.ok(
    mobPresCode.includes('mob-btn-theme'),
    'MobilePresentation.js must wire #mob-btn-theme to toggle the app theme'
  );
});
