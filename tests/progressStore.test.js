import test from 'node:test';
import assert from 'node:assert/strict';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
    dump: () => data
  };
}

const options = (storage) => ({
  chapterNumbers: [1, 2, 3],
  quizIds: ['kq_1', 'kq_2'],
  storage
});

test('ProgressStore: a new browser starts with 0 stars', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const store = new ProgressStore(options(memoryStorage()));
  assert.equal(store.stars, 0);
  assert.equal(store.maxStars, 5);
});

test('ProgressStore: each chapter star can be collected only once', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const store = new ProgressStore(options(memoryStorage()));
  assert.equal(store.awardChapterStar(1), true);
  assert.equal(store.awardChapterStar(1), false, 'clicking Collect Chapter Star again gives nothing');
  assert.equal(store.awardChapterStar(1), false);
  assert.equal(store.stars, 1);
  assert.equal(store.hasChapterStar(1), true);
});

test('ProgressStore: each quiz question gives a star only the first time', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const store = new ProgressStore(options(memoryStorage()));
  assert.equal(store.awardQuizStar('kq_1'), true);
  assert.equal(store.awardQuizStar('kq_1'), false, 'replaying the quiz does not add stars');
  assert.equal(store.awardQuizStar('kq_2'), true);
  assert.equal(store.stars, 2);
});

test('ProgressStore: unknown ids never count', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const store = new ProgressStore(options(memoryStorage()));
  assert.equal(store.awardChapterStar(99), false);
  assert.equal(store.awardQuizStar('made_up'), false);
  assert.equal(store.stars, 0);
});

test('ProgressStore: progress is saved in this browser and survives a reload', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const storage = memoryStorage();
  const first = new ProgressStore(options(storage));
  first.awardChapterStar(2);
  first.awardQuizStar('kq_2');
  const reloaded = new ProgressStore(options(storage));
  assert.equal(reloaded.stars, 2);
  assert.equal(reloaded.hasChapterStar(2), true);
  assert.equal(reloaded.hasQuizStar('kq_2'), true);
});

test('ProgressStore: edited or legacy values cannot inflate the count', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const storage = memoryStorage({
    'adventure-stars': '9999',
    'class4-progress-v1': JSON.stringify({ chapters: [1, 1, 1, 42, 'x'], quiz: ['kq_1', 'fake', 'kq_1'] })
  });
  const store = new ProgressStore(options(storage));
  assert.equal(store.stars, 2, 'only real, unique chapters and questions count');
  assert.equal(storage.getItem('adventure-stars'), null, 'old running total is discarded');
});

test('ProgressStore: reset clears everything back to 0', async () => {
  const { ProgressStore } = await import('../src/components/ProgressStore.js');
  const storage = memoryStorage();
  const store = new ProgressStore(options(storage));
  store.awardChapterStar(1);
  store.awardQuizStar('kq_1');
  store.reset();
  assert.equal(store.stars, 0);
  assert.equal(new ProgressStore(options(storage)).stars, 0);
});
