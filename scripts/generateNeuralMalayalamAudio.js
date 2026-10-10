import fs from 'node:fs';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { CHAPTERS_DATA } from '../src/data/chaptersData.js';

const AUDIO_DIR = path.resolve(process.cwd(), 'assets/audio');
const TEMP_DIR = path.resolve(process.cwd(), 'temp_audio_scratch');

if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function generateChapterAudio(chapter) {
  console.log(`\n🎙️ Generating Natural Neural Audio for Chapter ${chapter.number}: ${chapter.titleEng}...`);

  // 1. Natural Neural Malayalam Audio via SobhanaNeural
  const ttsMal = new MsEdgeTTS();
  await ttsMal.setMetadata('ml-IN-SobhanaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  
  const textMal = `അദ്ധ്യായം ${chapter.number}. ${chapter.titleMal}. ${chapter.story5yoMal || chapter.story5yo}. സുവർണ്ണ പാഠം: ${chapter.moralLessonMal || ''}`;
  
  const tempMalFolder = path.join(TEMP_DIR, `ch${chapter.number}_mal`);
  if (!fs.existsSync(tempMalFolder)) fs.mkdirSync(tempMalFolder, { recursive: true });

  try {
    const res = await ttsMal.toFile(tempMalFolder, textMal);
    const generatedFile = path.resolve(tempMalFolder, 'audio.mp3');
    const destMalFile = path.join(AUDIO_DIR, `ch${chapter.number}_mal.mp3`);
    if (fs.existsSync(generatedFile)) {
      fs.copyFileSync(generatedFile, destMalFile);
      const sz = fs.statSync(destMalFile).size;
      console.log(`  ✅ [Malayalam - SobhanaNeural] Saved ch${chapter.number}_mal.mp3 (${sz} bytes)`);
    }
  } catch (err) {
    console.error(`  ❌ Failed Malayalam Ch ${chapter.number}:`, err.message);
  }

  // 2. Natural Neural English Story Audio via JennyNeural
  const ttsEng = new MsEdgeTTS();
  await ttsEng.setMetadata('en-US-JennyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const textEng = `Chapter ${chapter.number}. ${chapter.titleEng}. ${chapter.story5yo}. Today's golden rule: ${chapter.moralLesson}`;

  const tempEngFolder = path.join(TEMP_DIR, `ch${chapter.number}_eng`);
  if (!fs.existsSync(tempEngFolder)) fs.mkdirSync(tempEngFolder, { recursive: true });

  try {
    const resEng = await ttsEng.toFile(tempEngFolder, textEng);
    const generatedEngFile = path.resolve(tempEngFolder, 'audio.mp3');
    const destEngFile = path.join(AUDIO_DIR, `ch${chapter.number}_eng.mp3`);
    if (fs.existsSync(generatedEngFile)) {
      fs.copyFileSync(generatedEngFile, destEngFile);
      const szEng = fs.statSync(destEngFile).size;
      console.log(`  ✅ [English - JennyNeural] Saved ch${chapter.number}_eng.mp3 (${szEng} bytes)`);
    }
  } catch (err) {
    console.error(`  ❌ Failed English Ch ${chapter.number}:`, err.message);
  }
}

async function run() {
  console.log(`🚀 Starting Neural Audio Generation for all ${CHAPTERS_DATA.length} Chapters...`);
  for (const ch of CHAPTERS_DATA) {
    await generateChapterAudio(ch);
  }
  // Cleanup temp dir
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('\n🎉 ALL 15 CHAPTERS NEURAL AUDIO GENERATION COMPLETE!');
}

run().catch(console.error);
