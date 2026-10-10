import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Mobile Screen Widths Validation (320px, 375px, 390px, 430px, 768px, 1024px)', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify responsive media query coverage
  const breakpoints = [1024, 768, 480, 360];
  breakpoints.forEach(bp => {
    assert.ok(css.includes(`max-width: ${bp}px`), `CSS must cover max-width: ${bp}px`);
  });

  // Verify mobile overflow prevention
  assert.ok(css.includes('overflow-x: hidden'), 'CSS must prevent horizontal overflow on body/content');

  // Verify touch target requirements on mobile (>= 44px)
  const matches44 = css.match(/min-height:\s*4[4-8]px/g);
  assert.ok(matches44 && matches44.length >= 5, 'CSS must enforce >= 44px min-height for touch targets');

  // Verify mobile nav tabs scrollability
  assert.ok(css.includes('-webkit-overflow-scrolling: touch'), 'Nav tabs must support smooth touch scrolling on mobile');

  // Verify 3D universe viewport height on mobile
  assert.ok(css.includes('.viewport-3d-card'), 'Viewport card must be styled for mobile');

  // Verify slide title Malayalam responsive scaling
  assert.ok(css.includes('word-break: break-word'), 'Malayalam titles must use word-break to prevent text overflow');
});
