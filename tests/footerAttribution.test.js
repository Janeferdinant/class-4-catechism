import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Footer attribution: index.html contains faculty mentorship footer', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(htmlContent.includes('Asst. Prof. Jane Rose'), 'index.html must include "Asst. Prof. Jane Rose"');
  assert.ok(
    htmlContent.includes('Department of Computer Science & Engineering (CSE)'),
    'index.html must include "Department of Computer Science & Engineering (CSE)"'
  );
  assert.ok(htmlContent.includes('<footer class="app-footer"'), 'index.html must have footer.app-footer');
});

test('Footer attribution: SlideDeck and StoryClassroom include faculty mentorship footer', async () => {
  const { SlideDeckManager } = await import('../src/components/SlideDeck.js');
  const { StoryClassroomManager } = await import('../src/components/StoryClassroom.js');
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');

  const deck = new SlideDeckManager(CHAPTERS_DATA);
  const slideHtml = deck.renderSlideHTML(CHAPTERS_DATA[0]);
  assert.ok(slideHtml.includes('Asst. Prof. Jane Rose'), 'SlideDeck must include "Asst. Prof. Jane Rose"');
  assert.ok(
    slideHtml.includes('Department of Computer Science & Engineering (CSE)'),
    'SlideDeck must include "Department of Computer Science & Engineering (CSE)"'
  );

  const classroom = new StoryClassroomManager();
  const lesson = classroom.getLesson(1);
  const lessonHtml = classroom.renderLessonCard(lesson);
  assert.ok(lessonHtml.includes('Asst. Prof. Jane Rose'), 'StoryClassroom must include "Asst. Prof. Jane Rose"');
  assert.ok(
    lessonHtml.includes('Department of Computer Science & Engineering (CSE)'),
    'StoryClassroom must include "Department of Computer Science & Engineering (CSE)"'
  );
});

test('Footer attribution: README.md includes faculty mentorship', () => {
  const readmePath = path.resolve(process.cwd(), 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  assert.ok(readmeContent.includes('Asst. Prof. Jane Rose'), 'README.md must include "Asst. Prof. Jane Rose"');
  assert.ok(
    readmeContent.includes('Department of Computer Science & Engineering (CSE)'),
    'README.md must include "Department of Computer Science & Engineering (CSE)"'
  );
});
