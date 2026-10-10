import os
import sys
from PIL import Image

def verify_file(filepath):
    if not os.path.exists(filepath):
        print(f"FAIL: File does not exist: {filepath}")
        return False
    
    img = Image.open(filepath)
    if img.mode != "RGBA":
        print(f"FAIL: {filepath} mode is {img.mode}, expected RGBA")
        return False
    
    w, h = img.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for pt in corners:
        pixel = img.getpixel(pt)
        alpha = pixel[3] if len(pixel) >= 4 else None
        if alpha != 0:
            print(f"FAIL: {filepath} corner {pt} has alpha {alpha} != 0 (pixel: {pixel})")
            return False
            
    print(f"PASS: {filepath} ({w}x{h}, mode: RGBA, 4 corners transparent)")
    return True

def main():
    files_to_check = [
        "assets/generated/jesus-children-cutout.webp",
        "assets/generated/dove-cutout.webp",
        "assets/generated/angel-cherub-cutout.webp",
        "assets/generated/icons/icon-adventure-map.webp",
        "assets/generated/icons/icon-picture-slides.webp",
        "assets/generated/icons/icon-story-lessons.webp",
        "assets/generated/icons/icon-exam-papers.webp",
        "assets/generated/icons/icon-star-quizzes.webp",
    ]
    
    # Also check all 15 islands
    for i in range(1, 16):
        files_to_check.append(f"assets/generated/islands/island-ch{i:02d}.webp")

    all_passed = True
    print(f"Verifying transparency on {len(files_to_check)} cutout files...\n")
    for f in files_to_check:
        if not verify_file(f):
            all_passed = False

    if not all_passed:
        print("\nERROR: One or more files failed transparency verification!")
        sys.exit(1)
    else:
        print(f"\nSUCCESS: All {len(files_to_check)} cutout files verified with transparent corners!")

if __name__ == "__main__":
    main()
