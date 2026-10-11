import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(path.resolve('src/styles/glass.css'), 'utf8');
const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

/** The declarations of the first rule whose selector list contains `selector`. */
function ruleFor(selector) {
  const at = css.indexOf(selector);
  assert.ok(at >= 0, `${selector} is styled`);
  const open = css.indexOf('{', at);
  return css.slice(open + 1, css.indexOf('}', open));
}

test('Glass: the stylesheet loads after the main and mobile styles', () => {
  const main = html.indexOf('src/styles/mobile.css');
  const glass = html.indexOf('src/styles/glass.css');
  assert.ok(main > 0 && glass > main, 'glass.css is linked after mobile.css');
});

test('Glass: soft light glass and dark glass tokens exist for both themes', () => {
  for (const theme of ['light', 'dark']) {
    const block = css.slice(css.indexOf(`[data-theme="${theme}"] {`));
    for (const token of ['--gl-nav', '--gl-float', '--gl-modal', '--gl-content', '--gl-control', '--gl-stroke', '--gl-ambient']) {
      assert.ok(block.includes(`${token}:`), `${theme} theme defines ${token}`);
    }
  }
});

test('Glass: reading surfaces are not blurred (cheap and readable)', () => {
  assert.match(ruleFor('[data-theme] .story-lesson-card'), /backdrop-filter:\s*none/);
});

test('Glass: navigation and dialogs use backdrop blur', () => {
  assert.match(ruleFor('[data-theme] .app-header'), /backdrop-filter:\s*blur\(/);
  assert.match(ruleFor('[data-theme] .three-node-drawer'), /backdrop-filter:\s*blur\(/);
});

test('Glass: accessibility fallbacks are in place', () => {
  for (const query of [
    '@media (prefers-reduced-transparency: reduce)',
    '@media (prefers-contrast: more)',
    '@media (forced-colors: active)',
    '@media (prefers-reduced-motion: reduce)',
    '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))'
  ]) {
    assert.ok(css.includes(query), `handles ${query}`);
  }
});

test('Glass: answer states keep their colours', () => {
  assert.ok(css.includes('.quiz-option-row:not(.option-state-correct):not(.option-state-incorrect)'));
  assert.ok(css.includes('.mob-quiz-option-btn:not(.correct-choice):not(.wrong-choice)'));
});
