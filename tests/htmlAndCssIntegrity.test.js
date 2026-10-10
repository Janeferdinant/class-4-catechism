import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('HTML and CSS integrity check for kid-friendly UI, 3D drawer, and star badge', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // 1. 3D Drawer element check
  assert.ok(htmlContent.includes('id="three-node-drawer"'), 'index.html must include #three-node-drawer');
  assert.ok(htmlContent.includes('class="three-node-drawer"'), 'index.html must include .three-node-drawer');

  // 2. Star collection badge check
  assert.ok(htmlContent.includes('id="header-star-count"'), 'index.html must include #header-star-count');
  assert.ok(htmlContent.includes('header-star-badge'), 'index.html must include .header-star-badge');

  // 3. Child-friendly navigation tabs
  assert.ok(htmlContent.includes('Adventure Map'), 'Must have Adventure Map tab');
  assert.ok(htmlContent.includes('Picture Slides'), 'Must have Picture Slides tab');
  assert.ok(htmlContent.includes('Story Lessons'), 'Must have Story Lessons tab');
  assert.ok(htmlContent.includes('Exam Papers'), 'Must have Exam Papers tab');
  assert.ok(htmlContent.includes('Star Quizzes'), 'Must have Star Quizzes tab');

  // 4. CSS file checks
  const cssPath = path.resolve(process.cwd(), 'src/styles/main.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(cssContent.includes('.three-node-drawer'), 'main.css must style .three-node-drawer');
  assert.ok(cssContent.includes('.three-node-drawer.open'), 'main.css must style open state for drawer');
  assert.ok(cssContent.includes('.btn-choice-bubbly'), 'main.css must style .btn-choice-bubbly');
  assert.ok(cssContent.includes('.quiz-adventure-card'), 'main.css must style .quiz-adventure-card');
  assert.ok(cssContent.includes('.feedback-banner'), 'main.css must style .feedback-banner');
  assert.ok(cssContent.includes('.header-star-badge'), 'main.css must style .header-star-badge');
});
