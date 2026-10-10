import test from 'node:test';
import assert from 'node:assert/strict';

test('SlideDeck and StoryClassroom logic', async () => {
  const { SlideDeckManager } = await import('../src/components/SlideDeck.js');
  const { CHAPTERS_DATA } = await import('../src/data/chaptersData.js');

  const deck = new SlideDeckManager(CHAPTERS_DATA);
  assert.equal(deck.getCurrentIndex(), 0);
  assert.equal(deck.getTotalSlides(), 15);

  deck.next();
  assert.equal(deck.getCurrentIndex(), 1);

  deck.prev();
  assert.equal(deck.getCurrentIndex(), 0);

  deck.jumpTo(5);
  assert.equal(deck.getCurrentIndex(), 5);

  const { StoryClassroomManager } = await import('../src/components/StoryClassroom.js');
  const classroom = new StoryClassroomManager();
  const lesson = classroom.getLesson(1);
  assert.equal(lesson.number, 1);
  assert.ok(lesson.story5yo);
  assert.ok(lesson.characterGuide);
});
