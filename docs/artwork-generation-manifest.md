# Artwork Generation Manifest — Class 4 Catechism

This manifest tracks all assets required for the UI/UX redesign per `docs/design/REDESIGN_PROMPT.md` §7, documenting which assets have been generated and transparency-verified, and which assets remain blocked by the image generation tool quota (`429 Too Many Requests: quota reset in ~4 hours`).

---

## 1. Generated & Verified Assets (Alpha = 0 Corners Confirmed)

| Filename | Status | Mode / Dimensions | Source / Description |
|---|---|---|---|
| `assets/generated/jesus-children-cutout.webp` | **Generated & Verified** | RGBA, 1024×1024 | 3D Pixar-style Jesus with smiling children and lambs, transparent background |
| `assets/generated/dove-cutout.webp` | **Generated & Verified** | RGBA, 1024×1024 | Floating holy white dove with soft golden glow, transparent background |
| `assets/generated/angel-cherub-cutout.webp` | **Generated & Verified** | RGBA, 1024×1024 | Cheerful 3D child angel mascot with halo and wings ("Correct! ✨"), transparent background |
| `assets/generated/icons/icon-adventure-map.webp` | **Generated & Verified** | RGBA, 256×256 | Glossy 3D floating heavenly island with golden chapel and path, transparent background |
| `assets/generated/icons/icon-picture-slides.webp` | **Generated & Verified** | RGBA, 256×256 | Glossy 3D blue slide frame with heavenly landscape, transparent background |
| `assets/generated/icons/icon-story-lessons.webp` | **Generated & Verified** | RGBA, 256×256 | Glossy 3D open holy Bible with gold pages and cross ribbon bookmark, transparent background |
| `assets/generated/icons/icon-exam-papers.webp` | **Generated & Verified** | RGBA, 256×256 | Glossy 3D red exam document folder with gold checkmark and pencil, transparent background |
| `assets/generated/icons/icon-star-quizzes.webp` | **Generated & Verified** | RGBA, 256×256 | Glossy 3D sparkling golden star achievement badge, transparent background |
| `assets/generated/avatars/avatar-galileo.webp` | **Generated & Verified** | RGB, 256×256 | 3D portrait of Galileo celestial astronomer guide in star robe with telescope |
| `assets/generated/avatars/avatar-orchestrator.webp` | **Generated & Verified** | RGB, 256×256 | 3D portrait of youthful maestro coordinator boy guide with dark hair and blue vest |
| `assets/generated/islands/island-ch01.webp` | **Generated & Verified** | RGBA, 800×800 | 3D floating heavenly island with golden chapel, waterfalls, grass, and trees |
| `assets/generated/adventure_map_light.jpg` | **Generated & Verified** | RGB, 1024×1024 | Sunlit heavenly morning sky backdrop |
| `assets/generated/adventure_map_dark.jpg` | **Generated & Verified** | RGB, 1024×1024 | Deep celestial night sky backdrop |

---

## 2. Blocked Assets (Ready for Generation Once Model Quota Resets)

The image generation tool reported: `429 Too Many Requests: You have exhausted your capacity on this model. Your quota will reset after ~4 hours.`
The prompts, target dimensions, and destination paths below are ready for execution:

### 2.1 Agent Avatars (256×256, Pixar 3D Avatar Style)
1. **`assets/generated/avatars/avatar-leo.webp`**
   - **Prompt:** `Cartoon friendly 3D portrait of adorable little lion cub story guide with golden fur, fluffy mane, and joyful eyes, Pixar character avatar style, centered, solid white background`
   - **Target Dimensions:** 256×256, 1:1 aspect ratio
   - **Intended Screen:** Multi-Agent Learning Console & Mobile Agent Panel
   - **Temporary Fallback:** High-fidelity stylized SVG avatar (`avatar-leo.svg` / converted WebP)

2. **`assets/generated/avatars/avatar-sophia.webp`**
   - **Prompt:** `Cartoon friendly 3D portrait of intelligent young girl exam solver scholar with brown hair and glasses, bright kind smile, Pixar avatar style, centered, solid white background`
   - **Target Dimensions:** 256×256, 1:1 aspect ratio
   - **Intended Screen:** Multi-Agent Learning Console & Mobile Agent Panel
   - **Temporary Fallback:** High-fidelity stylized SVG avatar (`avatar-sophia.svg` / converted WebP)

3. **`assets/generated/avatars/avatar-barnaby.webp`**
   - **Prompt:** `Cartoon friendly 3D portrait of cute cheerful boy quiz guide with brown wavy hair and orange bowtie, enthusiastic smile, Pixar avatar style, centered, solid white background`
   - **Target Dimensions:** 256×256, 1:1 aspect ratio
   - **Intended Screen:** Multi-Agent Learning Console & Mobile Agent Panel
   - **Temporary Fallback:** High-fidelity stylized SVG avatar (`avatar-barnaby.svg` / converted WebP)

### 2.2 Chapter Island Sprites (800×800, Transparent Cutout)
Each island represents one chapter landmark along the glowing golden winding path:
- **`assets/generated/islands/island-ch02.webp`**: Church / Cathedral island (`Jesus Gives Life Through the Church`)
- **`assets/generated/islands/island-ch03.webp`**: Tabernacle / Sacraments altar island (`Sacraments: Channels Giving Life`)
- **`assets/generated/islands/island-ch04.webp`**: Baptismal font with clear living water and white lilies (`Baptism: Rebirth in Jesus`)
- **`assets/generated/islands/island-ch05.webp`**: Holy Spirit flame and anointing chrism vessel (`Confirmation: Anointing in the Spirit`)
- **`assets/generated/islands/island-ch06.webp`**: Golden chalice and wheat ears (`Holy Qurbana: The Life-Giving Sacrifice`)
- **`assets/generated/islands/island-ch07.webp`**: Eucharistic host and bread of life altar (`Holy Qurbana: The Bread of Life`)
- **`assets/generated/islands/island-ch08.webp`**: First holy communion altar and candles (`To Receive Jesus`)
- **`assets/generated/islands/island-ch09.webp`**: Welcoming open golden gate of mercy (`Let Us Be Reconciled`)
- **`assets/generated/islands/island-ch10.webp`**: Confessional chapel with purple stole (`Sacrament of Reconciliation`)
- **`assets/generated/islands/island-ch11.webp`**: Golden olive oil healing vessel and warm lamp (`Anointing of the Sick`)
- **`assets/generated/islands/island-ch12.webp`**: Priestly stole, paten, and laying of hands altar (`Holy Orders / Priesthood`)
- **`assets/generated/islands/island-ch13.webp`**: Golden entwined wedding rings and cross floral arch (`Holy Matrimony`)
- **`assets/generated/islands/island-ch14.webp`**: Golden rosary, holy water vessel, and crucifix (`Sacramentals`)
- **`assets/generated/islands/island-ch15.webp`**: Praying hands and radiant open Gospel near celestial cathedral (`The Lord's Prayer & Christian Prayer Life`)

*Temporary Fallback:* Generated island sprite variations based on `island-ch01.webp` with distinct landmark overlays and chapter lighting.

### 2.3 Mobile Hero Banners
- **`assets/generated/mobile-hero-light.webp`**: Portrait 1080×1350, sunlit morning cathedral floating in clouds with space for mobile typography.
- **`assets/generated/mobile-hero-dark.webp`**: Portrait 1080×1350, celestial night cathedral under crescent moon with space for mobile typography.
