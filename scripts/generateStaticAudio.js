/**
 * Static Audio Pre-Generator
 * Pre-generates high-definition, natural human MP3 audio files for all 15 chapters
 * in both Malayalam and English, saving them to assets/audio/ for static deployment.
 * Requires ZERO API keys!
 */

import fs from 'node:fs';
import path from 'node:path';
import { CHAPTERS_DATA } from '../src/data/chaptersData.js';

const AUDIO_DIR = path.resolve(process.cwd(), 'assets/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function chunkText(text, maxLen = 160) {
  const clean = text.replace(/[*#_~`>]/g, '').replace(/\s+/g, ' ').trim();
  const sentences = clean.split(/([।?!.])/).filter(Boolean);
  const chunks = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if ((current + part).length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [clean.slice(0, maxLen)];
}

async function fetchTTSAudioChunk(text, lang = 'ml') {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) {
    throw new Error(`TTS fetch failed with HTTP ${res.status}`);
  }
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function generateChapterAudio(chapter) {
  console.log(`Generating audio for Chapter ${chapter.number}: ${chapter.titleEng}...`);

  // 1. Malayalam Story Audio
  const malFullText = `അദ്ധ്യായം ${chapter.number}: ${chapter.titleMal}. ${chapter.story5yoMal || chapter.story5yo}. സുവർണ്ണ പാഠം: ${chapter.moralLessonMal || ''}`;
  const malChunks = chunkText(malFullText);
  const malBuffers = [];

  for (const chunk of malChunks) {
    try {
      const buf = await fetchTTSAudioChunk(chunk, 'ml');
      malBuffers.push(buf);
      await new Promise(r => setTimeout(r, 200)); // gentle rate limit spacing
    } catch (e) {
      console.warn(`  Warning fetching Mal chunk: ${e.message}`);
    }
  }

  if (malBuffers.length > 0) {
    const combinedMal = Buffer.concat(malBuffers);
    const malFile = path.join(AUDIO_DIR, `ch${chapter.number}_mal.mp3`);
    fs.writeFileSync(malFile, combinedMal);
    console.log(`  Saved ${malFile} (${combinedMal.length} bytes)`);
  }

  // 2. English Story Audio
  const engFullText = `Chapter ${chapter.number}: ${chapter.titleEng}. ${chapter.story5yo}. Golden rule: ${chapter.moralLesson}`;
  const engChunks = chunkText(engFullText);
  const engBuffers = [];

  for (const chunk of engChunks) {
    try {
      const buf = await fetchTTSAudioChunk(chunk, 'en');
      engBuffers.push(buf);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.warn(`  Warning fetching Eng chunk: ${e.message}`);
    }
  }

  if (engBuffers.length > 0) {
    const combinedEng = Buffer.concat(engBuffers);
    const engFile = path.join(AUDIO_DIR, `ch${chapter.number}_eng.mp3`);
    fs.writeFileSync(engFile, combinedEng);
    console.log(`  Saved ${engFile} (${combinedEng.length} bytes)`);
  }
}

async function run() {
  console.log(`Starting audio generation for ${CHAPTERS_DATA.length} chapters...`);
  for (const ch of CHAPTERS_DATA) {
    await generateChapterAudio(ch);
  }
  console.log('Static audio pre-generation completed successfully!');
}

run().catch(console.error);
