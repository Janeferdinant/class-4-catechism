/**
 * Narration scripts: the exact text read aloud for every narrated item, in
 * Malayalam ('mal') and English ('eng'), keyed by a stable clip id.
 *
 * This module is the single source for both:
 *   - scripts/extract_narration.mjs, which exports these scripts so
 *     scripts/generate_omnivoice_audio.py can render them with OmniVoice, and
 *   - the site, which plays the matching pre-rendered clip by id.
 * Keeping one source guarantees the audio always matches the words on screen.
 */

import { CHAPTERS_DATA } from './chaptersData.js';
import { EXAM_PAPERS_DATA } from './examPapersData.js';
import { KID_QUIZ_QUESTIONS } from './quizQuestionsData.js';
import { GRAPH_DATA } from './knowledgeGraphData.js';
import { buildNodeDrawerContent } from '../components/ThreeUniverse.js';

export const NARRATION_LANGS = ['mal', 'eng'];

const MALAYALAM = /[ഀ-ൿ]/;
const LETTERS_MAL = ['എ', 'ബി', 'സി', 'ഡി'];
const LETTERS_ENG = ['A', 'B', 'C', 'D'];

/** Remove emoji, markdown symbols and blanks, and collapse whitespace. */
function tidy(text) {
  return String(text || '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[*#~`>]/g, '')
    .replace(/\s*=\s*/g, ' – ') // "Pesaha = Passover" is read as a pair, not "equals"
    .replace(/\s*_{2,}\s*/g, ' … ') // a blank in a question becomes a short pause
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

const MAL_UNITS = ['പൂജ്യം', 'ഒന്ന്', 'രണ്ട്', 'മൂന്ന്', 'നാല്', 'അഞ്ച്', 'ആറ്', 'ഏഴ്', 'എട്ട്', 'ഒമ്പത്',
  'പത്ത്', 'പതിനൊന്ന്', 'പന്ത്രണ്ട്', 'പതിമൂന്ന്', 'പതിനാല്', 'പതിനഞ്ച്', 'പതിനാറ്', 'പതിനേഴ്', 'പതിനെട്ട്', 'പത്തൊമ്പത്'];
const MAL_TENS = ['', '', 'ഇരുപത്', 'മുപ്പത്', 'നാൽപ്പത്', 'അമ്പത്', 'അറുപത്', 'എഴുപത്', 'എൺപത്', 'തൊണ്ണൂറ്'];
const MAL_TENS_JOIN = ['', '', 'ഇരുപത്തി', 'മുപ്പത്തി', 'നാൽപ്പത്തി', 'അമ്പത്തി', 'അറുപത്തി', 'എഴുപത്തി', 'എൺപത്തി', 'തൊണ്ണൂറ്റി'];

/** 0-99 as Malayalam words (larger numbers are read digit by digit). */
function malNumber(n) {
  if (n < 20) return MAL_UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? MAL_TENS[t] : `${MAL_TENS_JOIN[t]}${MAL_UNITS[u]}`;
  }
  return String(n).split('').map(d => MAL_UNITS[Number(d)]).join(' ');
}

/**
 * Digits inside Malayalam narration are spoken as Malayalam words, so the voice
 * doesn't switch to English for "1" or "15:5" (a verse reference reads as
 * "പതിനഞ്ച്, അഞ്ച്").
 */
function malDigits(text) {
  return String(text || '')
    .replace(/(\d+)\s*[:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?/g, (m, a, b, c) =>
      `${malNumber(Number(a))}, ${malNumber(Number(b))}${c ? ` മുതൽ ${malNumber(Number(c))} വരെ` : ''}`)
    .replace(/\d+/g, d => malNumber(Number(d)));
}

/** Drop bracketed glosses in the other script, e.g. "ദൈവികജീവൻ (Divine Life)". */
function malOnly(text) {
  return tidy(malDigits(String(text || '').replace(/\(([^()]*)\)/g, (m, inner) => (MALAYALAM.test(inner) ? m : ''))));
}

function engOnly(text) {
  return tidy(String(text || '').replace(/\(([^()]*)\)/g, (m, inner) => (MALAYALAM.test(inner) ? '' : m)));
}

/** "🍇 ദൈവികജീവൻ (Divine Life)" -> { mal: "ദൈവികജീവൻ", eng: "Divine Life" } */
function splitOption(option) {
  const raw = tidy(option);
  const gloss = raw.match(/\(([^()]*)\)\s*$/);
  if (MALAYALAM.test(raw) && gloss && !MALAYALAM.test(gloss[1])) {
    return { mal: tidy(raw.slice(0, gloss.index)), eng: tidy(gloss[1]) };
  }
  return { mal: raw, eng: raw };
}

export const clipIds = {
  chapter: (n, part) => `ch${n}-${part}`,
  exam: (questionId) => `exam-${questionId}`,
  examSimple: (questionId) => `exam-${questionId}-simple`,
  quiz: (questionId) => `quiz-${questionId}`,
  quizHint: (questionId) => `quiz-${questionId}-hint`,
  node: (nodeId) => `node-${nodeId}`
};

/* ---------------- Per-item scripts ---------------- */

export function chapterScripts(ch) {
  const n = ch.number;
  const concepts = Array.isArray(ch.keyConcepts) ? ch.keyConcepts : [];
  return [
    {
      id: clipIds.chapter(n, 'story'),
      mal: malOnly(`അദ്ധ്യായം ${n}. ${ch.titleMal}. ${ch.story5yoMal || ''}`),
      eng: engOnly(`Chapter ${n}. ${ch.titleEng}. ${ch.story5yo || ''}`)
    },
    {
      id: clipIds.chapter(n, 'moral'),
      mal: ch.moralLessonMal ? malOnly(`സുവർണ്ണ പാഠം. ${ch.moralLessonMal}`) : null,
      eng: ch.moralLesson ? engOnly(`Moral lesson. ${ch.moralLesson}`) : null
    },
    {
      id: clipIds.chapter(n, 'scripture'),
      mal: ch.scripture ? malOnly(`തിരുവചനം. ${ch.scripture}`) : null,
      eng: ch.scriptureEng ? engOnly(`Scripture. ${ch.scriptureEng}`) : null
    },
    {
      id: clipIds.chapter(n, 'concepts'),
      mal: concepts.length ? malOnly(`പ്രധാന ആശയങ്ങൾ. ${concepts.map(c => c.termMal).filter(Boolean).join('. ')}.`) : null,
      eng: concepts.length
        ? engOnly(`Key concepts. ${concepts.map(c => `${c.termEng}: ${c.desc || ''}`).join(' ')}`)
        : null
    }
  ];
}

export function examScripts(question) {
  return [
    {
      id: clipIds.exam(question.id),
      mal: question.qMal ? malOnly(`${question.qMal} ഉത്തരം: ${question.answerMal || ''}`) : null,
      eng: question.qEng ? engOnly(`${question.qEng} Answer: ${question.answerEng || ''}`) : null
    },
    {
      id: clipIds.examSimple(question.id),
      mal: null,
      eng: question.eli5 ? engOnly(`Simply put: ${question.eli5}`) : null
    }
  ];
}

export function quizScripts(q) {
  const options = (q.options || []).map(splitOption);
  return [
    {
      id: clipIds.quiz(q.id),
      mal: q.questionMal
        ? malOnly(`${q.questionMal} ${options.map((o, i) => `${LETTERS_MAL[i]}: ${o.mal}.`).join(' ')}`)
        : null,
      eng: q.questionEng
        ? engOnly(`${q.questionEng} ${options.map((o, i) => `${LETTERS_ENG[i]}: ${o.eng}.`).join(' ')}`)
        : null
    },
    {
      id: clipIds.quizHint(q.id),
      mal: null,
      eng: q.eli5Hint ? engOnly(`Here is a clue. ${q.eli5Hint}`) : null
    }
  ];
}

/**
 * Map nodes that are not chapters (chapter nodes reuse the chapter clips).
 * The English text is the details panel's own audio text, so the voice always
 * matches what the panel shows. Malayalam uses the panel's Malayalam text where
 * it has any: scripture, or for a sacrament its Malayalam name and the chapter
 * that teaches it. Nodes with no Malayalam text get no Malayalam clip.
 */
export function nodeScripts(node) {
  if (!node || node.category === 'chapter') return [];
  const drawer = buildNodeDrawerContent(node);
  if (!drawer) return [];
  const malName = (String(drawer.title).match(/\(([^()]*[ഀ-ൿ][^()]*)\)/) || [])[1];
  const chapter = CHAPTERS_DATA.find(c => c.number === drawer.targetChapter);
  const sacramentMal = drawer.category === 'sacrament' && malName && chapter
    ? `${malName}. അദ്ധ്യായം ${chapter.number}: ${chapter.titleMal}.`
    : null;
  const malSource = drawer.audioTextMal
    || (drawer.scripture && MALAYALAM.test(drawer.scripture) ? drawer.scripture : null)
    || sacramentMal
    || null;
  return [{
    id: clipIds.node(node.id),
    mal: malSource ? malOnly(malSource) : null,
    eng: drawer.audioText ? engOnly(drawer.audioText) : null
  }];
}

/* ---------------- Everything, flattened ---------------- */

/** Every clip as { id, lang, text }, for the audio generator. */
export function buildNarrationScripts() {
  const items = [
    ...CHAPTERS_DATA.flatMap(chapterScripts),
    ...EXAM_PAPERS_DATA.flatMap(p => p.questions.flatMap(examScripts)),
    ...KID_QUIZ_QUESTIONS.flatMap(quizScripts),
    ...GRAPH_DATA.nodes.flatMap(nodeScripts)
  ];
  const clips = [];
  for (const item of items) {
    for (const lang of NARRATION_LANGS) {
      const text = item[lang];
      if (text && text.replace(/[\s.,:]/g, '').length > 0) clips.push({ id: item.id, lang, text });
    }
  }
  return clips;
}

/** Clip ids played for a map node (chapters play their story then moral). */
export function nodeClipSequence(node) {
  if (!node) return [];
  if (node.category === 'chapter') {
    const n = parseInt(String(node.id).replace('ch_', ''), 10) || 1;
    return [clipIds.chapter(n, 'story'), clipIds.chapter(n, 'moral')];
  }
  return nodeScripts(node).map(s => s.id);
}
