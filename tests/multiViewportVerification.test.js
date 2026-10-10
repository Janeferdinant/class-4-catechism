import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LayoutSelector } from '../src/presentation/LayoutSelector.js';

const REQUIRED_VIEWPORTS = [
  { width: 320, height: 640, expectedLayout: 'mobile', label: 'Compact Mobile (320x640)' },
  { width: 360, height: 800, expectedLayout: 'mobile', label: 'Standard Android (360x800)' },
  { width: 375, height: 812, expectedLayout: 'mobile', label: 'iPhone SE/Mini (375x812)' },
  { width: 390, height: 844, expectedLayout: 'mobile', label: 'iPhone 14/15 (390x844)' },
  { width: 430, height: 932, expectedLayout: 'mobile', label: 'iPhone Pro Max (430x932)' },
  { width: 768, height: 1024, expectedLayout: 'mobile', label: 'iPad/Tablet Portrait (768x1024)' },
  { width: 1024, height: 768, expectedLayout: 'desktop', label: 'Tablet Landscape/Laptop (1024x768)' },
  { width: 1440, height: 900, expectedLayout: 'desktop', label: 'Widescreen Desktop (1440x900)' },
];

test('Multi-Viewport Verification: LayoutSelector classifies all 8 required viewports correctly', () => {
  const selector = new LayoutSelector();

  for (const vp of REQUIRED_VIEWPORTS) {
    const layout = selector.determineLayout(vp.width);
    assert.equal(
      layout,
      vp.expectedLayout,
      `Viewport ${vp.label} (${vp.width}x${vp.height}) should activate ${vp.expectedLayout} layout`
    );
  }
});

test('Multi-Viewport Verification: mobile.css contains responsive adaptations for mobile viewports', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/mobile.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify responsive fluid properties and no fixed wide desktop containers
  assert.ok(css.includes('max-width: 100%') || css.includes('width: 100%'), 'mobile.css must use fluid container widths');
  assert.ok(css.includes('overflow-x: hidden') || css.includes('overflow-x: auto'), 'mobile.css must prevent unintended horizontal scroll');
  assert.ok(css.includes('min-height: 48px') || css.includes('min-height: 52px'), 'mobile.css must guarantee touch targets >= 48px');
  assert.ok(css.includes('.mob-bottom-nav'), 'mobile.css must style fixed bottom navigation');
  assert.ok(css.includes('.mobile-app-header'), 'mobile.css must style compact mobile header');
});

test('Multi-Viewport Verification: desktop stylesheet retains full desktop grid rules above breakpoint', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('.desktop-layout-root') || css.includes('.app-header'), 'main.css must style desktop elements');
  assert.ok(css.includes('.nav-tabs'), 'main.css must style desktop nav tabs');
  assert.ok(css.includes('.universe-layout'), 'main.css must preserve desktop universe grid');
});
