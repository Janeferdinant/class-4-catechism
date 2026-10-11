"""
Spot-check rendered narration with speech recognition (faster-whisper).

Transcribes clips and reports the character error rate (CER) against the script
text, so missing words, cut-off endings or garbled speech stand out.

  <omnivoice-venv>/Scripts/python scripts/verify_narration.py --sample 20
  <omnivoice-venv>/Scripts/python scripts/verify_narration.py --only ch1- --lang eng

English results are a reliable check. Whisper's Malayalam is much weaker, so a
high Malayalam CER means "listen to this one", not necessarily "this is wrong".
"""

import argparse
import json
import os
import random
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NARRATION_DIR = os.path.join(ROOT, 'assets', 'audio', 'narration')


def normalise(text):
    text = unicodedata.normalize('NFC', text.lower())
    text = re.sub(r'[^\wഀ-ൿ]+', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def cer(reference, hypothesis):
    ref, hyp = normalise(reference), normalise(hypothesis)
    if not ref:
        return 0.0
    prev = list(range(len(hyp) + 1))
    for i, rc in enumerate(ref, 1):
        cur = [i] + [0] * len(hyp)
        for j, hc in enumerate(hyp, 1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (rc != hc))
        prev = cur
    return prev[-1] / len(ref)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--only', default='')
    parser.add_argument('--lang', choices=['mal', 'eng'])
    parser.add_argument('--sample', type=int, default=0, help='random sample size (0 = all matching)')
    parser.add_argument('--model', default='medium')
    parser.add_argument('--threshold', type=float, default=None, help='flag clips above this CER')
    args = parser.parse_args()

    from faster_whisper import WhisperModel

    with open(os.path.join(NARRATION_DIR, 'scripts.json'), encoding='utf-8') as f:
        clips = json.load(f)
    clips = [c for c in clips if c['id'].startswith(args.only) and (not args.lang or c['lang'] == args.lang)]
    clips = [c for c in clips if os.path.exists(os.path.join(NARRATION_DIR, c['lang'], f"{c['id']}.mp3"))]
    if args.sample and len(clips) > args.sample:
        random.seed(1)
        clips = random.sample(clips, args.sample)

    model = WhisperModel(args.model, device='cpu', compute_type='int8')
    results = []
    for clip in clips:
        path = os.path.join(NARRATION_DIR, clip['lang'], f"{clip['id']}.mp3")
        segments, _ = model.transcribe(path, language='ml' if clip['lang'] == 'mal' else 'en', beam_size=5)
        heard = ' '.join(s.text for s in segments).strip()
        score = cer(clip['text'], heard)
        results.append((clip, score, heard))
        limit = args.threshold if args.threshold is not None else (0.45 if clip['lang'] == 'mal' else 0.15)
        flag = '  <-- listen' if score > limit else ''
        print(f"{clip['lang']}/{clip['id']:<28} CER {score:5.1%}{flag}")
        if flag:
            print(f"    script: {clip['text'][:160]}")
            print(f"    heard:  {heard[:160]}")

    for lang in ('eng', 'mal'):
        scores = [s for c, s, _ in results if c['lang'] == lang]
        if scores:
            print(f'{lang}: {len(scores)} clips, mean CER {sum(scores) / len(scores):.1%}, worst {max(scores):.1%}')


if __name__ == '__main__':
    main()
