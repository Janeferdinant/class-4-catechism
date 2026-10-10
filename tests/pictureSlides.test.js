import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Picture Slides have valid images for all 15 chapters', async () => {
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');
  const { SlideDeckManager } = await import('../src/components/SlideDeck.js');
  const deck = new SlideDeckManager(CHAPTERS_DATA);

  for (let i = 0; i < CHAPTERS_DATA.length; i++) {
    const ch = CHAPTERS_DATA[i];
    assert.ok(ch.imageUrl, `Chapter ${ch.number} must have imageUrl`);

    // Verify file exists on disk
    const imgPath = path.resolve(process.cwd(), ch.imageUrl);
    assert.ok(fs.existsSync(imgPath), `Image file for Chapter ${ch.number} must exist at ${ch.imageUrl}`);

    // Verify slide HTML renders the image tag
    const html = deck.renderSlideHTML(ch);
    assert.ok(html.includes('<img'), `Slide HTML for Chapter ${ch.number} must contain an <img> element`);
    assert.ok(html.includes(ch.imageUrl), `Slide HTML for Chapter ${ch.number} must reference ${ch.imageUrl}`);
  }
});

test('Story Classroom renders chapter illustration banner for all 15 lessons', async () => {
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');
  const { StoryClassroomManager } = await import('../src/components/StoryClassroom.js');
  const classroom = new StoryClassroomManager();

  for (let i = 0; i < CHAPTERS_DATA.length; i++) {
    const ch = CHAPTERS_DATA[i];
    const lesson = classroom.getLesson(ch.number);
    const html = classroom.renderLessonCard(lesson);
    assert.ok(html.includes('<img'), `Lesson card for Chapter ${ch.number} must contain an <img> element`);
    assert.ok(html.includes(ch.imageUrl), `Lesson card for Chapter ${ch.number} must reference ${ch.imageUrl}`);
  }
});

