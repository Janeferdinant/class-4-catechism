# Multi-Agent Catechism Academy (Class 4 Interactive Classroom)

## Overview
The **Multi-Agent Catechism Academy** is an interactive, multi-agent AI educational web application designed for students, teachers, and parents. It transforms the standard Diocese of Mananthavady Class 4 Catechism curriculum into an engaging multimedia learning experience.

This project is used to teach Class 4 Catechism (Chapters 1–15) using a child-centric 5-year-old storytelling pedagogy, solve and cite questions across five historical examination papers (2023–2025), provide interactive 3D WebGL knowledge exploration, and deliver natural bilingual (Malayalam and English) neural voice narration without requiring active cloud API subscriptions.

## Purpose
The main objectives of this project are:
1. **Child-Friendly Theological Pedagogy**: Deliver complex spiritual concepts and sacraments through simple, memorable bedtime stories and moral lessons tailored to the cognitive level of young children.
2. **Comprehensive Exam Preparation & Textbook Citations**: Provide verified solutions for the last five semester examination papers (2023–2025) with exact chapter, page, and doctrinal citations.
3. **Multi-Agent Collaborative Architecture**: Demonstrate specialized agent collaboration (Orchestrator, Storyteller, Exam Solver, 3D Visualizer, Voiceover, and Quiz Master) to assemble real-time multimedia learning experiences.

## Features
- **Multi-Agent Autonomous Orchestration**: An intelligent coordinator delegates user goals across specialized agents for pedagogical storytelling, exam solution retrieval, 3D visualization, and gamification.
- **Natural Neural Bilingual Audio Narration**: 30 pre-generated, broadcast-quality audio tracks using Microsoft Edge Neural voices (`ml-IN-SobhanaNeural` for Malayalam and `en-US-JennyNeural` for English) with instantaneous playback and global stop controls.
- **3D WebGL Knowledge Universe & Slide-out Drawer**: Interactive Three.js particle cosmos mapping relationships between chapters, sacraments, and historical exam questions. Clicking any node smoothly focuses the camera and slides out a contextual details drawer.
- **3D Pixar Motion Graphics with Ken Burns Animation**: Pixar-styled 3D diorama storybook art for all 15 chapters featuring dynamic mouse-tilt parallax, particle simulation, and a toggle to switch between 3D art and original textbook scans.
- **5 Solved Examination Papers with Exact Citations**: Complete solutions for First and Second Semester exams (2023–2025), categorized with difficulty ratings, marking schemes, and reference citations.
- **Gamified Star Quiz Engine**: Interactive chapter-by-chapter quiz with celebratory sound effects synthesized via Web Audio API, confetti animations, positive reinforcement, and gold star badging.
- **Dual Light and Dark Themes**: Child-accessible high-contrast themes engineered with modern glassmorphism, cheerful gradients, and accessible typography.

## Repository Structure
```
multiagent/
│
├── src/                  # Source code
│   ├── agents/           # Multi-agent orchestrator & specialized agent definitions
│   ├── components/       # Interactive UI components (ThreeUniverse, Quiz, Voice, Slides)
│   ├── data/             # Curriculum, exam paper, knowledge graph, and quiz datasets
│   ├── services/         # External integrations (Gemini AI service)
│   ├── styles/           # CSS design systems (main.css, themes.css)
│   └── app.js            # Core client application bootstrap
├── config/               # Configuration files
│   ├── app.config.json   # Application runtime & component configuration
│   └── README.md         # Configuration documentation
├── data/                 # Input/output data
│   ├── input/            # Raw textbook PDFs (Chapters 1-15) and exam paper scans (2023-2025)
│   ├── output/           # Generated evaluation reports, audio, and transcripts
│   └── README.md         # Data directory documentation
├── docs/                 # Technical documentation
│   ├── architecture.md   # Detailed multi-agent system architecture
│   └── superpowers/      # Feature specifications and implementation plans
├── tests/                # Test scripts and test cases (25 unit and integration suites)
├── scripts/              # Utility and automation scripts (audio generation, data update)
├── assets/               # Static assets
│   ├── audio/            # Pre-generated MP3 audio files (Malayalam & English)
│   ├── pixar/            # 3D Pixar-styled chapter storybook illustrations
│   └── textbook/         # Historical textbook scans
│
├── .gitignore            # Git exclusion rules
├── requirements.txt      # Python dependencies for offline document processing
├── package.json          # Node.js configuration, dependencies, and test scripts
├── CHANGELOG.md          # Version history and release notes
└── README.md             # Project documentation
```

## Directory Description
| Directory/File | Description |
| :--- | :--- |
| `src/` | Main application source code, UI components, data stores, and agent logic |
| `config/` | Application configuration files and theme/agent definitions |
| `data/` | Input source documents (textbook & exam PDFs) and generated data |
| `docs/` | Detailed technical documentation, architecture specs, and implementation plans |
| `tests/` | Automated test suites (25 unit & integration tests) |
| `scripts/` | Utility scripts for neural TTS audio generation and data normalization |
| `assets/` | Static multimedia assets (30 pre-generated MP3s, 3D Pixar art, textbook scans) |
| `requirements.txt` | Python dependencies for document processing and utility scripts |
| `package.json` | Node.js manifest, dependencies, and script definitions |
| `CHANGELOG.md` | Detailed project version release history |
| `README.md` | Project overview, architecture, setup instructions, and guidelines |

## Requirements

### Software
- **Node.js** — Version 18.x, 20.x, or 24.x (Tested on v24.19.0)
- **Modern Web Browser** — Chrome 110+, Edge 110+, Firefox 110+, or Safari 16+ (WebGL & Web Audio enabled)
- **Python** (Optional utility scripts) — Version 3.10+
- **Git** — Version 2.30+

### Operating System
- Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+, Debian 11+)

### Runtime
- **Node.js**
- **Version**: 20.x or higher (Tested on Node.js v24.19.0)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/example/multiagent-catechism-academy.git
cd multiagent-catechism-academy
```

### 2. Create the Development Environment
For Python utility scripts (optional):
```bash
python -m venv .venv
```
Windows:
```powershell
.venv\Scripts\Activate.ps1
```
macOS / Linux:
```bash
source .venv/bin/activate
```

### 3. Install Dependencies
Install Node.js dependencies:
```bash
npm install
```

If utilizing Python utility scripts:
```bash
pip install -r requirements.txt
```

### 4. Configure the Application
Copy or review configuration parameters in `config/app.config.json`. All static audio and visual assets are pre-generated and bundled locally, so no external API keys or cloud service accounts are required to run the classroom out of the box.

## Configuration

Configuration files are located in:
`config/`

### Configuration Parameters
| Parameter | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `application.port` | Local HTTP server port | No | `8080` |
| `ui.defaultTheme` | Default user interface theme (`dark` or `light`) | Yes | `dark` |
| `ui.defaultLanguage` | Default narration and story language (`malayalam` or `english`) | Yes | `malayalam` |
| `ui.soundEffectsEnabled` | Enable Web Audio synthesizer sound effects | No | `true` |
| `audio.ttsProvider` | Primary voiceover provider | Yes | `msedge-neural` |
| `audio.malayalamVoice` | Neural Malayalam voice model identifier | Yes | `ml-IN-SobhanaNeural` |
| `audio.englishVoice` | Neural English voice model identifier | Yes | `en-US-JennyNeural` |
| `visuals.defaultView` | Default picture slide display (`pixar` or `textbook`) | Yes | `pixar` |

### Environment Variables
| Variable | Description | Required |
| :--- | :--- | :--- |
| `PORT` | Custom port to bind HTTP server | No |
| `GEMINI_API_KEY` | Optional Google AI Studio key for live AI questions | No |
| `DEFAULT_THEME` | Override default theme (`dark` / `light`) | No |

> **Security**: Do not commit passwords, API keys, access tokens, certificates, or other credentials to the repository. The application uses client-side session configuration and pre-generated static assets to ensure zero credential leakage.

## Usage

### Basic Usage
Start the local HTTP web server:
```bash
npm start
```

### Example
```bash
npx -y http-server -p 8080 -c-1
```
Open your web browser and navigate to:
```
http://localhost:8080
```

### Typical Workflow
1. **Launch & Choose Language**: Open `http://localhost:8080`, select **Malayalam (മലയാളം)** or **English**, and pick your preferred theme (Dark / Light).
2. **Interactive Storytelling**: Navigate through Chapters 1 to 15. Read the 5-year-old story cards and listen to the natural neural voiceover by pressing **Play Story Audio**.
3. **Explore 3D Pixar Motion Graphics**: Inspect the chapter illustrations in 3D mode. Hover or tilt the screen to see 3D perspective depth, and toggle between 3D Pixar Art and original textbook scans.
4. **Discover the 3D Universe**: Click **3D Universe** in the navigation bar. Orbit the WebGL knowledge graph, click on any node (Chapters, Sacraments, Exams), and explore the slide-out drawer details.
5. **Exam Solutions & Star Quiz**: Switch to **Solved Exams** to inspect cited answers for the 2023–2025 semester exams, or launch the **Star Quiz** to earn gold stars and celebrate with confetti!

## Input Data
The application requires the following input data:
| Input | Format | Description | Required |
| :--- | :--- | :--- | :--- |
| Textbook Chapters 1–15 | PDF | Diocese of Mananthavady Class 4 textbook scans located in `data/input/` | Yes |
| Past Exam Papers (2023–2025) | PDF | 5 historical semester question papers located in `data/input/` | Yes |
| Multi-Agent Specification | PDF | Architecture design guidelines (`multi  agent.pdf`) located in `data/input/` | Yes |
| Gemini API Key | String | Optional key entered in UI for live conversational queries | No |

### Input Requirements
1. Textbook PDFs must cover Chapters 1 through 15 of Class 4 Catechism.
2. Question papers must preserve original Malayalam question text for accurate citation matching.
3. Audio playback requires browser support for standard MPEG audio codecs (MP3).

## Output
The application generates the following outputs:
| Output | Format | Description |
| :--- | :--- | :--- |
| Interactive Web Classroom | HTML5 / CSS3 / WebGL | Responsive, kid-friendly animated classroom UI |
| Neural Voiceover Narration | Audio (MP3) | Broadcast-quality Malayalam and English story voiceovers |
| Solved Exam Answer Cards | Structured HTML | Categorized questions with solutions and textbook references |
| Quiz Badges & Star Progress | Browser LocalStorage | Gamified star scores, progress tracking, and celebratory effects |

## Workflow
```
Input (Textbooks & Question Papers)
  │
  ▼
Validation (Data integrity & schema verification)
  │
  ▼
Processing (Multi-agent decomposition: stories, solutions, 3D nodes)
  │
  ▼
Output Generation (Pre-generated neural audio, 3D WebGL scenes, quizzes)
  │
  ▼
Validation (Automated unit tests & audio checks)
  │
  ▼
Final Output (Interactive Classroom web application)
```

## Integrations
This project integrates with the following systems:
| System | Purpose | Interface |
| :--- | :--- | :--- |
| Three.js WebGL Engine | 3D knowledge graph universe rendering & camera orbit | Browser ES6 Module / CDN |
| Microsoft Edge Neural TTS | Offline generation of natural Malayalam (`SobhanaNeural`) audio | Node.js script (`scripts/generateNeuralMalayalamAudio.js`) |
| Google Gemini AI API | Optional dynamic agent explanations and personalized Q&A | REST API via `GeminiAIService.js` |
| Web Audio API | Sound effects generation (chimes, clicks, celebratory fanfares) | Native Browser AudioContext |

### External Dependencies
- Google Gemini API (`https://generativelanguage.googleapis.com`)
- Three.js library (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`)
- Canvas Confetti (`https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js`)

## Development

### Development Environment
Recommended development environment:
- **IDE**: Visual Studio Code, Cursor, or Antigravity IDE
- **Runtime**: Node.js v20.x or v24.x
- **Version**: 1.2.0
- **Git**: Git 2.30+

### Coding Standards
- Follow standard ES6+ JavaScript modular architecture.
- Use meaningful variable, class, and function names.
- Keep components focused on a single responsibility (`Single Responsibility Principle`).
- Add graceful fallbacks for missing browser capabilities (e.g. SpeechSynthesis fallback if MP3s fail).
- Add tests for new functionality under `tests/`.
- Update documentation and changelogs when behavior changes.

## Git Workflow

### Branches
```
main
 │
 ├── feature/<feature-name>
 ├── bugfix/<bug-name>
 └── release/<version>
```

### Commit Messages
Use descriptive commit messages.
Examples:
- `feat: add neural Malayalam audio voiceover`
- `feat: implement interactive 3D WebGL knowledge drawer`
- `fix: resolve quiz scoring and audio stop button`
- `docs: update architecture documentation and changelog`

### Pull Requests
Before submitting a pull request:
- [x] Code has been tested.
- [x] Automated tests pass (`npm test`).
- [x] Documentation has been updated.
- [x] No credentials or sensitive information are included.
- [x] Changes have been reviewed.
- [x] Commit history is clean.

## Testing

### Run Automated Tests
```bash
npm test
```
Or run directly via Node.js test runner:
```bash
node --test tests/*.test.js
```

Example for Python utility testing:
```bash
pytest
```

### Manual Testing
1. **Audio Verification**: Click **Play Story Audio** for Malayalam and English across chapters, and click **Stop Audio** to ensure immediate halt.
2. **3D Universe Verification**: Click into **3D Universe**, rotate the cosmos, click on nodes (e.g., Chapter 7 or Sacrament), and verify that the drawer slides out with accurate details.
3. **Quiz Verification**: Start chapter quizzes, select right and wrong options, and observe sounds, confetti, and star tallying.
4. **Theme Toggle**: Switch between Dark and Light mode and check contrast across all components.

### Test Requirements
1. All 15 chapters must contain complete English and Malayalam text and moral lessons.
2. All 5 exam papers must have solutions verified against chapter citations.
3. Pre-generated audio files (`ch1_mal.mp3` through `ch15_mal.mp3` and `ch1_eng.mp3` through `ch15_eng.mp3`) must exist and have non-zero size.

## Logging
Logs are stored in:
- Client-side: Browser Developer Console (`F12` -> `Console`)
- Server-side: Local HTTP server terminal output

Log levels:
- **DEBUG** — Detailed diagnostic information (node orbit calculations, particle counts)
- **INFO** — Normal application operation (audio loaded, chapter switched, quiz started)
- **WARNING** — Potential issue that does not stop execution (audio fallback triggered)
- **ERROR** — Operation failed (failed to load specific asset)
- **CRITICAL** — Critical failure (browser does not support canvas or WebGL)

## Error Handling
Common errors and solutions are documented below.

### WebGL Context Unavailable
- **Cause**: Browser hardware acceleration disabled or outdated graphics driver.
- **Solution**: The application automatically degrades to a 2D canvas fallback animation (`MotionCanvas.js`). Enable hardware acceleration in browser settings (`chrome://settings/system`).

### Audio Playback Blocked by Browser
- **Cause**: Browser autoplay restrictions requiring user interaction before playing audio.
- **Solution**: Audio playback is strictly triggered on explicit user click of the **Play Story Audio** button, adhering to autoplay policies.

### Gemini API Key Invalid or Missing
- **Cause**: User entered an invalid key or left it empty when testing live AI features.
- **Solution**: The application displays a gentle inline notification and seamlessly uses pre-generated static content without failing.

## Known Issues / Limitations
1. On very low-end mobile devices, 3D WebGL particle counts may cause minor frame drops.
2. Web Speech API synthesis quality depends on OS language packages if offline MP3s are disabled.

## Troubleshooting

### Problem: Malayalam audio does not play
- **Symptoms**: Clicking the audio button does not produce sound.
- **Possible Cause**: Audio muted, browser volume zero, or MP3 file blocked by browser security settings.
- **Solution**: Ensure your speaker is unmuted and the local server is running (`npm start`) so assets are served over HTTP rather than `file://`.

### Problem: 3D Universe shows a blank canvas
- **Symptoms**: Particle graph is not visible.
- **Possible Cause**: WebGL disabled or Three.js CDN blocked.
- **Solution**: Check browser developer console for network errors and verify WebGL is enabled at `chrome://gpu`.

## Security
The following information must not be committed to the repository:
- Passwords
- API keys (Google AI Studio, ElevenLabs, OpenAI)
- Access tokens
- Private keys
- Certificates containing private information
- Database credentials
- Personal student or teacher information
- Other confidential information

Use environment variables, client-side session memory, or approved secret-management systems where applicable.

## Versioning
The project follows:
[Semantic Versioning 2.0.0](https://semver.org/)

Current version:
**1.2.0**

See [CHANGELOG.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/multiagent/CHANGELOG.md) for the complete change history.

## Documentation
Additional documentation is available in:
`docs/`

Important documents:
- [architecture.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/multiagent/docs/architecture.md) — Detailed Multi-Agent architecture specification
- [app.config.json](file:///c:/Users/Asus/Documents/Antigravity-Projects/multiagent/config/app.config.json) — Master application configuration
- [CHANGELOG.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/multiagent/CHANGELOG.md) — Release notes and changelog history

## Known Dependencies
| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| `msedge-tts` | `^2.0.9` | Broadcast-grade natural neural text-to-speech audio synthesis |
| Three.js | `r128` | 3D WebGL interactive universe and particle node graph |
| Canvas-Confetti | `1.9.4` | Gamified celebratory particle explosions for quizzes |

## Maintenance
- **Project Owner**: Diocese of Mananthavady Catechetical Commission & EdTech Lab
- **Maintainer**: Antigravity Multi-Agent Engineering Team
- **Contact**: `edtech@catechism-academy.org` / Internal EdTech Support Channel

## Change History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **1.0.0** | 2026-10-10 | Multi-Agent Team | Initial release with 15 chapters, 5 solved exam papers, and quiz engine |
| **1.1.0** | 2026-10-10 | Multi-Agent Team | Added clickable 3D nodes, stop audio controls, and bilingual Malayalam support |
| **1.2.0** | 2026-10-10 | Multi-Agent Team | Pre-generated natural neural voiceover, 3D Pixar motion graphics, and folder organization |

## License / Usage
This repository is proprietary and intended for internal educational and catechism instruction use only. Redistribution or external commercial use is not permitted without explicit authorization from the Diocese of Mananthavady Catechetical Commission.
