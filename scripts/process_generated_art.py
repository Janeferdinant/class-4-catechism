"""
Process hand-generated artwork for the Class 4 Catechism redesign.

Drop raw images (PNG, JPG or WebP) into assets/generated/incoming/ using the
file names listed in docs/design/ARTWORK_TO_GENERATE.md, then run:

    python scripts/process_generated_art.py

For every file it finds, the script:
  1. cuts out a solid background (sampled from the corners) when the asset needs
     transparency and the image does not already have it,
  2. trims, pads and resizes to the size the UI expects,
  3. writes the result to the exact path the app already loads (replacing the
     placeholder), and
  4. verifies cutouts have transparent corners.

Files that are not in the incoming folder are skipped, so you can add art a few
pieces at a time and re-run the script.
"""

import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

INCOMING = os.path.join('assets', 'generated', 'incoming')
EXTENSIONS = ('.png', '.webp', '.jpg', '.jpeg')

# name in incoming/ -> (output path, target size, kind)
#   cutout-square : transparent, content centered on a square canvas
#   cutout-fit    : transparent, trimmed, keeps its own aspect ratio (longest side = size)
#   cover         : opaque, scaled to cover the target size and center-cropped
#                   (never enlarged beyond the source resolution)
#   avatar        : opaque, square crop around the head and shoulders
ASSETS = {
    'map-backdrop-light': ('assets/generated/adventure_map_light.jpg', (2560, 1440), 'cover'),
    'map-backdrop-dark': ('assets/generated/adventure_map_dark.jpg', (2560, 1440), 'cover'),
    'jesus-children': ('assets/generated/jesus-children-cutout.webp', 1400, 'cutout-fit'),
    'icon-adventure-map': ('assets/generated/icons/icon-adventure-map.webp', (256, 256), 'cutout-square'),
    'icon-picture-slides': ('assets/generated/icons/icon-picture-slides.webp', (256, 256), 'cutout-square'),
    'icon-story-lessons': ('assets/generated/icons/icon-story-lessons.webp', (256, 256), 'cutout-square'),
    'icon-exam-papers': ('assets/generated/icons/icon-exam-papers.webp', (256, 256), 'cutout-square'),
    'icon-star-quizzes': ('assets/generated/icons/icon-star-quizzes.webp', (256, 256), 'cutout-square'),
    'avatar-galileo': ('assets/generated/avatars/avatar-galileo.webp', (256, 256), 'avatar'),
    'avatar-orchestrator': ('assets/generated/avatars/avatar-orchestrator.webp', (256, 256), 'avatar'),
    'avatar-leo': ('assets/generated/avatars/avatar-leo.webp', (256, 256), 'avatar'),
    'avatar-sophia': ('assets/generated/avatars/avatar-sophia.webp', (256, 256), 'avatar'),
    'avatar-barnaby': ('assets/generated/avatars/avatar-barnaby.webp', (256, 256), 'avatar'),
}
for n in range(1, 16):
    ASSETS[f'island-ch{n:02d}'] = (f'assets/generated/islands/island-ch{n:02d}.webp', (1024, 1024), 'cutout-square')

# While the old Jesus cutout (with painted clouds behind it) is in use, the page
# feathers its edges. A clean cutout should not be feathered.
FEATHER_CLASS_FILES = ['index.html']


def find_incoming(name):
    for ext in EXTENSIONS:
        path = os.path.join(INCOMING, name + ext)
        if os.path.exists(path):
            return path
    return None


def corners_transparent(img):
    w, h = img.size
    return all(img.getpixel(p)[3] == 0 for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])


def remove_solid_background(img, tolerance):
    """Make a solid background transparent, keeping soft shadows and glows.

    1. Flood-fill the background from the four corners.
    2. Generators paint soft shadows and glows *onto* the background, so those
       pixels are a mix of the art and the background color. Starting from the
       background, grow into neighbouring pixels whose color leans the same way
       as the background color (e.g. magenta), and un-mix them: a dark magenta
       shadow becomes a translucent black shadow, a pink glow becomes translucent
       white light. Only pixels connected to the background are touched, so
       pink or purple details inside the artwork are left alone.
    """
    img = img.convert('RGBA')
    if corners_transparent(img):
        return img, 'kept existing transparency'

    w, h = img.size
    corner_pts = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    key = np.median(np.array([img.getpixel(p)[:3] for p in corner_pts], dtype=float), axis=0)

    work = img.copy()
    for corner in corner_pts:
        if work.getpixel(corner)[3] != 0:
            ImageDraw.floodfill(work, corner, (0, 0, 0, 0), thresh=tolerance)
    background = np.asarray(work.getchannel('A')) == 0

    rgb = np.asarray(img.convert('RGB'), dtype=float)
    # Enclosed gaps (e.g. the hole in a clipboard clip) show pure background color
    # but are not connected to the corners; clear those too.
    background |= np.abs(rgb - key).sum(axis=2) < tolerance * 0.5
    key_chroma = key - key.min()
    key_len2 = float(np.dot(key_chroma, key_chroma)) or 1.0
    chroma = rgb - rgb.min(axis=2, keepdims=True)
    chroma_len = np.sqrt((chroma ** 2).sum(axis=2)) + 1e-6
    cosine = (chroma @ key_chroma) / (chroma_len * np.sqrt(key_len2))
    spill = np.clip((chroma @ key_chroma) / key_len2, 0.0, 1.0)  # 0 = no background, 1 = pure background
    candidate = (cosine > 0.97) & (spill > 0.06)

    # Grow from the background through background-tinted pixels (4-connected).
    region = background.copy()
    for _ in range(600):
        grown = region.copy()
        grown[1:, :] |= region[:-1, :]
        grown[:-1, :] |= region[1:, :]
        grown[:, 1:] |= region[:, :-1]
        grown[:, :-1] |= region[:, 1:]
        grown &= candidate | background
        if np.array_equal(grown, region):
            break
        region = grown

    # Anti-aliased silhouette edges (e.g. hair against the background) are blends
    # of the art color and the background color. In the thin ring that touches the
    # background, un-mix with a looser hue test so those edges lose their halo.
    ring = background.copy()
    for _ in range(4):
        grown = ring.copy()
        grown[1:, :] |= ring[:-1, :]
        grown[:-1, :] |= ring[1:, :]
        grown[:, 1:] |= ring[:, :-1]
        grown[:, :-1] |= ring[:, 1:]
        ring = grown
    # 0.8 keeps skin and plain hair (which score ~0.66) out, while catching
    # background-blended edge pixels (~0.9+).
    region |= ring & (cosine > 0.8) & (spill > 0.04)
    tinted = region & ~background

    alpha = np.full((h, w), 255.0)
    alpha[background] = 0.0
    out = rgb.copy()
    a = np.clip(1.0 - spill[tinted], 0.0, 1.0)
    safe = np.maximum(a, 1e-3)[:, None]
    out[tinted] = np.clip((rgb[tinted] - (1.0 - a)[:, None] * key) / safe, 0, 255)
    alpha[tinted] = a * 255.0

    result = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8), 'RGBA')
    softened = result.getchannel('A').filter(ImageFilter.GaussianBlur(0.6))
    result.putalpha(softened)
    return result, f'removed solid background (tolerance {tolerance}; un-mixed {int(tinted.sum())} shadow/glow px)'


def trim(img, pad_ratio):
    bbox = img.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
    if not bbox:
        return img
    img = img.crop(bbox)
    pad = int(max(img.size) * pad_ratio)
    canvas = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    return canvas


def to_square(img, size):
    side = max(img.size)
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return canvas.resize(size, Image.LANCZOS)


def cover(img, size):
    tw, th = size
    # Keep the target aspect ratio but never upscale past the source pixels.
    shrink = min(1.0, img.width / tw, img.height / th)
    if shrink < 1.0:
        tw, th = round(tw * shrink), round(th * shrink)
    scale = max(tw / img.width, th / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (resized.width - tw) // 2
    top = (resized.height - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def avatar_crop(img, size):
    """Square crop centered on the face of a head-and-shoulders portrait."""
    side = round(min(img.size) * 0.8)
    left = (img.width - side) // 2
    top = round(img.height * 0.02)
    return img.crop((left, top, left + side, top + side)).resize(size, Image.LANCZOS)


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if path.endswith('.jpg'):
        img.convert('RGB').save(path, 'JPEG', quality=86, optimize=True, progressive=True)
    else:
        img.save(path, 'WEBP', quality=88, method=6)


def drop_feather_class():
    for path in FEATHER_CLASS_FILES:
        text = open(path, encoding='utf-8').read()
        if ' feather-edges' in text:
            open(path, 'w', encoding='utf-8', newline='').write(text.replace(' feather-edges', ''))
            print(f'  updated {path}: removed temporary edge feathering from the hero figure')


def main():
    tolerance = int(sys.argv[1]) if len(sys.argv) > 1 else 60
    if not os.path.isdir(INCOMING):
        print(f'Nothing to do: {INCOMING} does not exist yet.')
        return 0

    processed, failed = 0, 0
    for name, (out_path, size, kind) in ASSETS.items():
        src = find_incoming(name)
        if not src:
            continue
        img = Image.open(src)
        note = ''
        if kind.startswith('cutout'):
            img, note = remove_solid_background(img, tolerance)
            if kind == 'cutout-square':
                img = to_square(trim(img, 0.06), size)
            else:
                img = trim(img, 0.02)
                img.thumbnail((size, size), Image.LANCZOS)
        elif kind == 'avatar':
            img = avatar_crop(img.convert('RGB'), size)
        else:
            img = cover(img.convert('RGB'), size)

        save(img, out_path)
        processed += 1
        if kind.startswith('cutout'):
            check = Image.open(out_path).convert('RGBA')
            if corners_transparent(check):
                print(f'PASS  {name:22s} -> {out_path} {check.size} ({note})')
            else:
                failed += 1
                print(f'FAIL  {name:22s} -> {out_path}: corners are not transparent. '
                      f'Regenerate on a flat solid background, or re-run with a higher tolerance, '
                      f'e.g. python scripts/process_generated_art.py 90')
        else:
            print(f'OK    {name:22s} -> {out_path} {img.size}')
        if name == 'jesus-children':
            drop_feather_class()

    missing = [n for n in ASSETS if not find_incoming(n)]
    print(f'\nProcessed {processed} file(s); {failed} failed. Still waiting for {len(missing)}: '
          + (', '.join(missing) if missing else 'none'))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
