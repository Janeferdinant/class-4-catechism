"""
Spot-check rendered narration with speech recognition.

Transcribes clips and reports the character error rate (CER) against the script
text, so missing words, cut-off endings or garbled speech stand out.

  <omnivoice-venv>/Scripts/python scripts/audio/verify_narration.py --sample 20
  <omnivoice-venv>/Scripts/python scripts/audio/verify_narration.py --only ch1- --lang eng

English uses faster-whisper. Malayalam uses a Whisper model fine-tuned for
Malayalam (thennal/whisper-medium-ml); standard Whisper cannot transcribe it.
Malayalam CER includes harmless spelling variants (e.g. കുർബാന / കുർബ്ബാന), so
it runs higher than English; a flagged clip means "listen to this one".
"""

import argparse
import json
import os
import random
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
NARRATION_DIR = os.path.join(ROOT, 'assets', 'audio', 'narration')
FLAG_ABOVE = {'eng': 0.15, 'mal': 0.25}


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


def english_transcriber(model_size):
    from faster_whisper import WhisperModel
    model = WhisperModel(model_size, device='cpu', compute_type='int8')
    return lambda path: ' '.join(s.text for s in model.transcribe(path, language='en', beam_size=5)[0]).strip()


def malayalam_transcriber(model_id):
    import torch
    from transformers import pipeline
    cuda = torch.cuda.is_available()
    asr = pipeline('automatic-speech-recognition', model=model_id, device=0 if cuda else -1,
                   torch_dtype=torch.float16 if cuda else torch.float32)
    # Malayalam takes several tokens per letter, so short windows keep each one
    # under Whisper's output limit (long windows silently drop the ending).
    kwargs = {'chunk_length_s': 10, 'stride_length_s': 2,
              'generate_kwargs': {'language': 'malayalam', 'task': 'transcribe'}}
    return lambda path: asr(path, **kwargs)['text'].strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--only', default='', help='clip ids starting with this prefix (e.g. ch1-, quiz-)')
    parser.add_argument('--lang', choices=['mal', 'eng'])
    parser.add_argument('--sample', type=int, default=0, help='random sample size (0 = all matching)')
    parser.add_argument('--model', default='medium', help='faster-whisper model for English')
    parser.add_argument('--mal-model', default='thennal/whisper-medium-ml', help='Hugging Face model for Malayalam')
    parser.add_argument('--threshold', type=float, default=None, help='flag clips above this CER')
    args = parser.parse_args()

    with open(os.path.join(NARRATION_DIR, 'scripts.json'), encoding='utf-8') as f:
        clips = json.load(f)
    clips = [c for c in clips if c['id'].startswith(args.only) and (not args.lang or c['lang'] == args.lang)]
    clips = [c for c in clips if os.path.exists(os.path.join(NARRATION_DIR, c['lang'], f"{c['id']}.mp3"))]
    if args.sample and len(clips) > args.sample:
        random.seed(1)
        clips = random.sample(clips, args.sample)

    transcribers = {}
    if any(c['lang'] == 'eng' for c in clips):
        transcribers['eng'] = english_transcriber(args.model)
    if any(c['lang'] == 'mal' for c in clips):
        transcribers['mal'] = malayalam_transcriber(args.mal_model)

    results = []
    for clip in clips:
        path = os.path.join(NARRATION_DIR, clip['lang'], f"{clip['id']}.mp3")
        heard = transcribers[clip['lang']](path)
        score = cer(clip['text'], heard)
        results.append((clip, score, heard))
        limit = args.threshold if args.threshold is not None else FLAG_ABOVE[clip['lang']]
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
