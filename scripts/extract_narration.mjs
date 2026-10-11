/**
 * Export every narration script (src/data/narration.js) to
 * assets/audio/narration/scripts.json for the OmniVoice generator.
 *
 *   node scripts/extract_narration.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildNarrationScripts } from '../src/data/narration.js';

const outDir = path.resolve('assets/audio/narration');
fs.mkdirSync(outDir, { recursive: true });

const clips = buildNarrationScripts().map(c => ({
  ...c,
  hash: crypto.createHash('sha1').update(`${c.lang}\n${c.text}`).digest('hex').slice(0, 12)
}));

const outFile = path.join(outDir, 'scripts.json');
fs.writeFileSync(outFile, JSON.stringify(clips, null, 2) + '\n', 'utf8');

const count = (lang) => clips.filter(c => c.lang === lang).length;
const chars = (lang) => clips.filter(c => c.lang === lang).reduce((n, c) => n + c.text.length, 0);
console.log(`Wrote ${clips.length} clips to ${path.relative(process.cwd(), outFile)}`);
console.log(`  Malayalam: ${count('mal')} clips, ${chars('mal')} characters`);
console.log(`  English:   ${count('eng')} clips, ${chars('eng')} characters`);
