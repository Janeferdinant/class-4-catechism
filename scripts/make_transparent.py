import os
from PIL import Image, ImageFilter
from collections import deque

def remove_white_background(input_path, output_path, tolerance=25, feather=1.5):
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    # Flood fill mask from the 4 corners and borders
    visited = set()
    bg_mask = Image.new("L", (w, h), 0)
    bg_pixels = bg_mask.load()

    queue = deque()
    # Add all border pixels that are near-white
    for x in range(w):
        for y in [0, h - 1]:
            r, g, b, _ = pixels[x, y]
            if min(r, g, b) > 220:
                queue.append((x, y))
                visited.add((x, y))
    for y in range(h):
        for x in [0, w - 1]:
            if (x, y) not in visited:
                r, g, b, _ = pixels[x, y]
                if min(r, g, b) > 220:
                    queue.append((x, y))
                    visited.add((x, y))

    while queue:
        cx, cy = queue.popleft()
        bg_pixels[cx, cy] = 255

        for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                nr, ng, nb, _ = pixels[nx, ny]
                # Check if it's near-white
                # Calculate distance to pure white or lightness
                if nr >= 255 - tolerance and ng >= 255 - tolerance and nb >= 255 - tolerance:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    # Invert bg_mask to get fg_mask
    fg_mask = bg_mask.point(lambda p: 0 if p == 255 else 255)
    
    if feather > 0:
        fg_mask = fg_mask.filter(ImageFilter.GaussianBlur(feather))

    img.putalpha(fg_mask)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "WEBP", quality=95)

    # Verification: check alpha channel and 4 corners
    out_img = Image.open(output_path)
    assert out_img.mode == "RGBA", "Must be RGBA"
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for pt in corners:
        alpha = out_img.getpixel(pt)[3]
        assert alpha == 0, f"Corner {pt} alpha must be 0, got {alpha}"

    print(f"Successfully created transparent {output_path} (size: {out_img.size})")

if __name__ == "__main__":
    remove_white_background(
        "assets/generated/white_dove_flying.jpg",
        "assets/generated/dove-cutout.webp",
        tolerance=35,
        feather=1.0
    )
    remove_white_background(
        "assets/generated/angel_mascot_celebrate.jpg",
        "assets/generated/angel-cherub-cutout.webp",
        tolerance=30,
        feather=1.0
    )
    remove_white_background(
        "assets/generated/jesus_children_hero.jpg",
        "assets/generated/jesus-children-cutout.webp",
        tolerance=28,
        feather=1.0
    )
