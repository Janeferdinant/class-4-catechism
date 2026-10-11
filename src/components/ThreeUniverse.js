/**
 * ThreeUniverse Component
 * Adventure Map renderer for Class 4 Catechism (Three.js r128).
 *
 * A 2.5D storybook world: the 15 chapter islands are laid out from a screen-space
 * layout table (so the composition matches the mockup at any size), joined by a soft
 * golden light path that recedes toward the heavenly cathedral. Other knowledge-graph
 * nodes (agents, sacraments, exams, clusters) appear as glowing orbs linked by the real
 * graph edges. Every node has a real HTML label button projected over it, so the map is
 * keyboard- and screen-reader-operable, and an HTML fallback renders when WebGL is missing.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { EXAM_PAPERS_DATA } from '../data/examPapersData.js';

/* --------------------------------------------------------------------------
   Layout tables
   u = 0..1 across the canvas, v = 0..1 down the canvas,
   s = island width as a fraction of canvas height.
   Chapter 1 sits large in the foreground; the path winds back and up
   toward the cathedral (upper right of the backdrop).
   -------------------------------------------------------------------------- */
export const WIDE_LAYOUT = [
  { u: 0.52, v: 0.57, s: 0.44 },  // 1  Jesus, the Source of Life
  { u: 0.40, v: 0.82, s: 0.30 },  // 2
  { u: 0.62, v: 0.87, s: 0.30 },  // 3
  { u: 0.82, v: 0.79, s: 0.28 },  // 4
  { u: 0.93, v: 0.50, s: 0.22 },  // 5
  { u: 0.84, v: 0.33, s: 0.18 },  // 6
  { u: 0.72, v: 0.40, s: 0.16 },  // 7
  { u: 0.66, v: 0.24, s: 0.14 },  // 8
  { u: 0.54, v: 0.22, s: 0.13 },  // 9
  { u: 0.43, v: 0.17, s: 0.12 },  // 10
  { u: 0.52, v: 0.08, s: 0.11 },  // 11
  { u: 0.62, v: 0.11, s: 0.11 },  // 12
  { u: 0.74, v: 0.13, s: 0.105 }, // 13
  { u: 0.83, v: 0.08, s: 0.10 },  // 14
  { u: 0.93, v: 0.17, s: 0.14 },  // 15 near the cathedral
];

export const TALL_LAYOUT = [
  { u: 0.50, v: 0.86, s: 0.28 },  // 1
  { u: 0.21, v: 0.73, s: 0.20 },  // 2
  { u: 0.79, v: 0.69, s: 0.20 },  // 3
  { u: 0.31, v: 0.59, s: 0.17 },  // 4
  { u: 0.73, v: 0.54, s: 0.17 },  // 5
  { u: 0.22, v: 0.45, s: 0.15 },  // 6
  { u: 0.70, v: 0.41, s: 0.15 },  // 7
  { u: 0.36, v: 0.34, s: 0.14 },  // 8
  { u: 0.82, v: 0.29, s: 0.14 },  // 9
  { u: 0.16, v: 0.25, s: 0.13 },  // 10
  { u: 0.56, v: 0.22, s: 0.13 },  // 11
  { u: 0.28, v: 0.14, s: 0.12 },  // 12
  { u: 0.80, v: 0.13, s: 0.12 },  // 13
  { u: 0.52, v: 0.08, s: 0.11 },  // 14
  { u: 0.17, v: 0.05, s: 0.12 },  // 15
];

// Chapters that always show their full title; the rest show a number badge
// that expands on hover, focus, or selection (keeps distant labels from colliding).
const FULL_LABEL_CHAPTERS = [1, 2, 3, 4, 5, 15];

const SACRAMENT_CHAPTER = {
  sac_baptism: 4, sac_confirmation: 5, sac_eucharist: 6, sac_reconciliation: 10,
  sac_anointing: 11, sac_orders: 12, sac_matrimony: 13
};
const CLUSTER_CHAPTER = { cluster_initiation: 4, cluster_healing: 10, cluster_service: 12 };

const ORB_COLORS = {
  agent: '#6fd3a8',
  sacrament: '#8ccbff',
  exam: '#f3a17b',
  cluster: '#c9b6ff',
  concept: '#ffd36b'
};

const VIEW_HEIGHT = 100; // world units spanning the canvas height

function chapterNumberOf(node, fallback = 1) {
  return parseInt(String(node.id).replace('ch_', ''), 10) || fallback;
}

/** Place every graph node in normalized (u, v) canvas space for the given layout. */
function layoutNodes(nodes, table) {
  const placed = new Map();
  const others = { agent: [], exam: [] };

  nodes.forEach((node, index) => {
    if (node.category === 'chapter') {
      const chNum = chapterNumberOf(node, index + 1);
      const slot = table[(chNum - 1) % table.length];
      placed.set(node.id, { u: slot.u, v: slot.v, s: slot.s, chapterNumber: chNum });
    } else if (node.category === 'agent' || node.category === 'exam') {
      others[node.category].push(node);
    }
  });

  const chapterSlot = (chNum) => table[(chNum - 1) % table.length];

  nodes.forEach(node => {
    if (node.category === 'sacrament') {
      const slot = chapterSlot(SACRAMENT_CHAPTER[node.id] || 3);
      placed.set(node.id, { u: slot.u + 0.045, v: slot.v - slot.s * 0.42, s: 0.05 });
    } else if (node.category === 'cluster') {
      const slot = chapterSlot(CLUSTER_CHAPTER[node.id] || 3);
      placed.set(node.id, { u: slot.u - 0.05, v: slot.v - slot.s * 0.38, s: 0.05 });
    } else if (node.category === 'concept') {
      const slot = chapterSlot(1);
      placed.set(node.id, { u: slot.u - 0.09, v: slot.v - slot.s * 0.30, s: 0.06 });
    }
  });

  // Agents float in a gentle arc across the upper sky; exams along the lower-left sky.
  const tall = table === TALL_LAYOUT;
  others.agent.forEach((node, i, arr) => {
    const t = arr.length > 1 ? i / (arr.length - 1) : 0.5;
    placed.set(node.id, tall
      ? { u: 0.12 + t * 0.76, v: 0.30 + Math.sin(t * Math.PI) * -0.06, s: 0.05 }
      : { u: 0.38 + t * 0.56, v: 0.47 + Math.sin(t * Math.PI) * -0.10, s: 0.05 });
  });
  others.exam.forEach((node, i, arr) => {
    const t = arr.length > 1 ? i / (arr.length - 1) : 0.5;
    placed.set(node.id, tall
      ? { u: 0.14 + t * 0.72, v: 0.60 + Math.sin(t * Math.PI) * 0.05, s: 0.05 }
      : { u: 0.40 + t * 0.52, v: 0.66 + Math.sin(t * Math.PI) * 0.06, s: 0.05 });
  });

  return placed;
}

/** Convert a normalized placement to world coordinates for a canvas of the given aspect. */
function toWorld(slot, aspect) {
  const viewWidth = VIEW_HEIGHT * aspect;
  return {
    x: (slot.u - 0.5) * viewWidth,
    y: (0.5 - slot.v) * VIEW_HEIGHT,
    z: Math.round(slot.s * 100) // larger (closer) islands draw in front
  };
}

/**
 * Compute world positions for every node (16:9 reference canvas).
 * Exported for tests and for any caller that needs node coordinates.
 */
export function calculate3DNodePositions(nodes = [], aspect = 16 / 9) {
  const table = aspect < 1.1 ? TALL_LAYOUT : WIDE_LAYOUT;
  const placed = layoutNodes(nodes, table);
  return nodes.map((node, index) => {
    const slot = placed.get(node.id) || { u: 0.5, v: 0.5, s: 0.05 };
    const world = toWorld(slot, aspect);
    const extra = node.category === 'chapter' ? { chapterNumber: chapterNumberOf(node, index + 1) } : {};
    return { ...node, ...world, ...extra };
  });
}

export function buildNodeDrawerContent(node) {
  if (!node) return null;

  if (node.id === 'concept_jesus_life') {
    return {
      nodeId: node.id,
      category: 'concept',
      emoji: '🍇',
      title: 'Jesus: The True Vine',
      subtitle: 'ഈശോ ജീവന്റെ ഉറവിടം (John 15:5)',
      description: 'Jesus is the source of all divine grace and supernatural life. We are the branches!',
      story: 'Stay connected to Jesus like a happy twig on a grapevine, and sweet fruits of love will grow!',
      scripture: 'ഞാൻ മുന്തിരിച്ചെടിയും നിങ്ങൾ ശാഖകളുമാണ്. (യോഹന്നാൻ 15:5)',
      targetView: 'classroom',
      targetChapter: 1,
      audioText: 'Jesus says: I am the vine and you are the branches. Stay close to My love!'
    };
  }

  if (node.category === 'chapter') {
    const chNum = chapterNumberOf(node);
    const ch = CHAPTERS_DATA.find(c => c.number === chNum) || CHAPTERS_DATA[0];
    return {
      nodeId: node.id,
      category: 'chapter',
      emoji: '📖',
      chapterNumber: ch.number,
      title: `Chapter ${ch.number}: ${ch.titleMal}`,
      subtitle: ch.titleEng,
      description: ch.summary,
      story: ch.story5yo,
      storyMal: ch.story5yoMal,
      moral: ch.moralLesson,
      moralMal: ch.moralLessonMal,
      scripture: ch.scripture,
      targetView: 'classroom',
      targetChapter: ch.number,
      audioText: `Chapter ${ch.number}: ${ch.titleEng}. ${ch.story5yo} Golden rule: ${ch.moralLesson}`,
      audioTextMal: `അദ്ധ്യായം ${ch.number}: ${ch.titleMal}. ${ch.story5yoMal || ''}. സുവർണ്ണ പാഠം: ${ch.moralLessonMal || ''}`
    };
  }

  if (node.category === 'sacrament') {
    const sacMap = {
      sac_baptism: { name: 'Baptism (മാമ്മോദീസ)', ch: 4, desc: 'Door to Christian life; rebirth as God’s child washing away Original Sin.' },
      sac_confirmation: { name: 'Confirmation (തൈലാഭിഷേകം)', ch: 5, desc: 'Sealed with the 7 gifts and power of the Holy Spirit.' },
      sac_eucharist: { name: 'Holy Qurbana (വി. കുർബാന)', ch: 6, desc: 'The source and summit of life; true Body and Blood of Christ.' },
      sac_reconciliation: { name: 'Reconciliation (അനുരഞ്ജനം)', ch: 10, desc: 'Heavenly eraser that washes away sin when we repent.' },
      sac_anointing: { name: 'Anointing of the Sick (രോഗീലേപനം)', ch: 11, desc: 'Healing, peace, and spiritual comfort for the sick.' },
      sac_orders: { name: 'Holy Orders (തിരുപ്പട്ടം)', ch: 12, desc: 'Apostolic ministry consecrated to guide the flock.' },
      sac_matrimony: { name: 'Matrimony (വിവാഹം)', ch: 13, desc: 'Holy covenant uniting father and mother in lifelong love.' }
    };
    const info = sacMap[node.id] || { name: node.label, ch: 3, desc: 'Channel of divine grace.' };
    return {
      nodeId: node.id,
      category: 'sacrament',
      emoji: '🕊️',
      title: info.name,
      subtitle: 'Holy Sacrament of Christ',
      description: info.desc,
      story: 'Jesus created this holy stream of grace so you can always receive His warmth and strength!',
      targetView: 'classroom',
      targetChapter: info.ch,
      audioText: `${info.name}. ${info.desc}`
    };
  }

  if (node.category === 'exam') {
    const paperIdMap = {
      paper_2023_s1: '2023_s1',
      paper_2023_s2: '2023_s2',
      paper_2024_s1: '2024_s1',
      paper_2025_s1: '2025_s1',
      paper_2025_s2: '2025_s2'
    };
    const targetPaperId = paperIdMap[node.id] || '2025_s1';
    const paper = EXAM_PAPERS_DATA.find(p => p.id === targetPaperId) || EXAM_PAPERS_DATA[0];
    return {
      nodeId: node.id,
      category: 'exam',
      emoji: '📝',
      title: paper.title,
      subtitle: 'Class 4 Exam Paper',
      description: paper.syllabus,
      story: `All ${paper.questions.length} questions from this paper have been solved and cited to Chapters 1–15 with 5yo explanations!`,
      targetView: 'solver',
      targetPaperId,
      audioText: `${paper.title}. Solved with citations and simple explanations.`
    };
  }

  if (node.category === 'agent') {
    return {
      nodeId: node.id,
      category: 'agent',
      emoji: '🤖',
      title: node.label,
      subtitle: 'Galileo Multi-Agent Specialist',
      description: 'Autonomous coordinator maintaining specialized knowledge without context contamination.',
      story: 'I collaborate with the Master Orchestrator to make learning fun, accurate, and full of adventures!',
      targetView: 'universe',
      audioText: `Hello! I am ${node.label}, your Galileo specialist helper.`
    };
  }

  return {
    nodeId: node.id,
    category: node.category || 'general',
    emoji: '✨',
    title: node.label,
    subtitle: 'Knowledge Graph Explorer',
    description: 'Explore relations across chapters, sacraments, and questions.',
    story: 'Click Jump to Lesson to begin learning!',
    targetView: 'classroom',
    targetChapter: 1,
    audioText: node.label
  };
}

/* --------------------------------------------------------------------------
   Procedural textures (soft glows drawn once on a canvas)
   -------------------------------------------------------------------------- */
function makeCanvasTexture(size, draw) {
  const THREE = window.THREE;
  const canvas = document.createElement('canvas');
  canvas.width = size.w;
  canvas.height = size.h;
  draw(canvas.getContext('2d'), size.w, size.h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function radialGlowTexture(inner, outer) {
  return makeCanvasTexture({ w: 128, h: 128 }, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.25, inner);
    g.addColorStop(0.55, outer);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

function ringTexture() {
  return makeCanvasTexture({ w: 128, h: 128 }, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.30, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,232,168,0)');
    g.addColorStop(0.55, 'rgba(255,232,168,0.95)');
    g.addColorStop(1, 'rgba(255,232,168,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

function glintTexture() {
  // Four-point sparkle used for the glints that pop on the islands.
  return makeCanvasTexture({ w: 128, h: 128 }, (ctx, w, h) => {
    ctx.globalCompositeOperation = 'lighter';
    for (const [rw, rh] of [[w / 2, h * 0.05], [w * 0.05, h / 2]]) {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, 'rgba(255,248,220,1)');
      g.addColorStop(1, 'rgba(255,248,220,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const core = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.14);
    core.addColorStop(0, 'rgba(255,255,255,1)');
    core.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, w, h);
  });
}

function pathRibbonTexture() {
  // Gradient across the ribbon's width: transparent edge -> gold -> warm white core.
  return makeCanvasTexture({ w: 4, h: 64 }, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,200,90,0)');
    g.addColorStop(0.28, 'rgba(255,200,90,0.45)');
    g.addColorStop(0.5, 'rgba(255,246,214,1)');
    g.addColorStop(0.72, 'rgba(255,200,90,0.45)');
    g.addColorStop(1, 'rgba(255,200,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Measure the opaque bounds of a loaded texture image (normalized 0..1). */
function measureAlphaBounds(image) {
  try {
    const n = 64;
    const canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = n;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, n, n);
    const data = ctx.getImageData(0, 0, n, n).data;
    let minX = n, minY = n, maxX = -1, maxY = -1;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (data[(y * n + x) * 4 + 3] > 40) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return null;
    return { left: minX / n, top: minY / n, right: (maxX + 1) / n, bottom: (maxY + 1) / n };
  } catch (e) {
    return null;
  }
}

const DEFAULT_ISLAND_BOUNDS = { left: 0.12, top: 0.15, right: 0.85, bottom: 0.95 };

export class ThreeUniverse {
  constructor(containerElement, onNodeSelect) {
    this.container = containerElement;
    this.onNodeSelect = onNodeSelect;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodes = [];
    this.edges = [];
    this.nodeMeshes = [];      // raycast targets (island hit planes + orbs)
    this.islandMeshes = [];    // island sprite planes
    this.orbSprites = [];
    this.labelsOverlay = null;
    this.labelElements = new Map();
    this.animationFrameId = null;
    this.isRotating = false;
    this.selectedId = null;
    this.hoveredId = null;
    this.currentFilter = 'chapter';
    this.theme = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
    this.aspect = 16 / 9;
    this.layoutTable = WIDE_LAYOUT;
    this.pan = { x: 0, y: 0, zoom: 1 };
    this.panTarget = { x: 0, y: 0, zoom: 1 };
    this.pointer = { x: 0, y: 0 };
    this.effects = [];
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }

  init(nodes = [], edges = []) {
    if (!this.container) return;
    this.nodes = nodes;
    this.edges = edges;
    this.setupLabelsOverlay();

    if (typeof window === 'undefined' || !window.THREE) {
      console.warn('Three.js not loaded; rendering the HTML island fallback.');
      this.renderHtmlFallback();
      return;
    }

    const THREE = window.THREE;
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      console.warn('WebGL unavailable; rendering the HTML island fallback.', err);
      this.renderHtmlFallback();
      return;
    }

    const { width, height } = this.containerSize();
    this.aspect = width / height;
    this.layoutTable = this.aspect < 1.1 ? TALL_LAYOUT : WIDE_LAYOUT;

    this.scene = new THREE.Scene();
    const halfW = (VIEW_HEIGHT * this.aspect) / 2;
    this.camera = new THREE.OrthographicCamera(-halfW, halfW, VIEW_HEIGHT / 2, -VIEW_HEIGHT / 2, -1000, 1000);
    this.camera.position.set(0, 0, 500);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.5 : 2));
    this.renderer.setSize(width, height);
    this.mountCanvas();

    this.textures = {
      glow: radialGlowTexture('rgba(255,250,230,1)', 'rgba(255,196,84,0.35)'),
      lantern: radialGlowTexture('rgba(255,236,170,1)', 'rgba(255,170,60,0.4)'),
      ring: ringTexture(),
      glint: glintTexture(),
      ribbon: pathRibbonTexture(),
      orbs: {}
    };
    Object.entries(ORB_COLORS).forEach(([cat, color]) => {
      this.textures.orbs[cat] = radialGlowTexture('rgba(255,255,255,1)', this.hexToRgba(color, 0.55));
    });

    this.buildIslands();
    this.buildIslandGlints();
    this.buildOrbs();
    this.buildPath();
    this.buildEdges();
    this.applyLayout();
    this.setTheme(this.theme);
    this.setupInteractions();
    this.observeResize();
    this.filterCategory('chapter');
    this.animate();
  }

  /* ---------------- Construction ---------------- */

  hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  containerSize() {
    const width = (this.container && this.container.clientWidth) || 800;
    const height = (this.container && this.container.clientHeight) || 500;
    return { width, height };
  }

  mountCanvas() {
    const canvas = this.renderer.domElement;
    canvas.classList.add('three-universe-canvas');
    if (canvas.parentElement !== this.container) {
      this.container.appendChild(canvas);
    }
    if (this.labelsOverlay && this.labelsOverlay.parentElement !== this.container) {
      this.container.appendChild(this.labelsOverlay);
    }
  }

  chapterNodes() {
    return this.nodes
      .filter(n => n.category === 'chapter')
      .sort((a, b) => chapterNumberOf(a) - chapterNumberOf(b));
  }

  buildIslands() {
    const THREE = window.THREE;
    const loader = new THREE.TextureLoader();

    this.chapterNodes().forEach((node) => {
      const chNum = chapterNumberOf(node);
      const numStr = String(chNum).padStart(2, '0');

      const material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, depthTest: false });
      const sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      sprite.userData = { ...node, chNum, bounds: { ...DEFAULT_ISLAND_BOUNDS }, phase: chNum * 0.83 };
      // Stay hidden until the artwork has loaded, so a missing file never shows a blank square.
      sprite.visible = false;

      loader.load(`assets/generated/islands/island-ch${numStr}.webp`, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
        sprite.visible = true;
        const bounds = measureAlphaBounds(texture.image);
        if (bounds) {
          sprite.userData.bounds = bounds;
          this.applyLayout();
        }
      }, undefined, () => {
        console.warn(`Island artwork for chapter ${chNum} could not be loaded; its label still works.`);
      });

      // Night lantern: a small warm glow near the island's top edge.
      const lantern = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.textures.lantern, transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending, opacity: 0
      }));
      sprite.add(lantern);
      sprite.userData.lantern = lantern;

      // Invisible hit plane matching the visible island (not the transparent square).
      const hit = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData = sprite.userData;
      sprite.add(hit);
      sprite.userData.hit = hit;

      this.scene.add(sprite);
      this.islandMeshes.push(sprite);
      this.nodeMeshes.push(hit);
    });
  }

  /** Pool of sparkle sprites that pop at random spots on the islands. */
  buildIslandGlints() {
    const THREE = window.THREE;
    this.glintsEnabled = true;
    this.glints = Array.from({ length: 7 }, () => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.textures.glint, transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending, opacity: 0
      }));
      sprite.renderOrder = 70;
      sprite.visible = false;
      this.scene.add(sprite);
      return { sprite, start: performance.now() / 1000 + Math.random() * 3, life: 1.5, island: null, ox: 0, oy: 0 };
    });
  }

  updateIslandGlints(t) {
    if (!this.glints) return;
    this.glints.forEach(g => {
      const k = (t - g.start) / g.life;
      if (k > 1 || !g.island) {
        // Respawn on a random island, somewhere on its upper (visible) surface.
        const island = this.islandMeshes[Math.floor(Math.random() * this.islandMeshes.length)];
        const b = island.userData.bounds || DEFAULT_ISLAND_BOUNDS;
        g.island = island;
        g.ox = (b.left + 0.15 * (b.right - b.left)) + Math.random() * 0.7 * (b.right - b.left) - 0.5;
        g.oy = 0.5 - (b.top + (0.05 + Math.random() * 0.35) * (b.bottom - b.top));
        g.start = t + 0.2 + Math.random() * 2;
        g.life = 1.1 + Math.random() * 0.8;
        g.sprite.visible = false;
        return;
      }
      if (k < 0 || !this.glintsEnabled || this.reducedMotion) {
        g.sprite.visible = false;
        return;
      }
      const d = g.island.userData;
      const pulse = Math.sin(k * Math.PI);
      const mirror = d.chNum % 2 === 0 ? -1 : 1;
      const size = Math.max(1.5, d.size * 0.17) * pulse;
      g.sprite.visible = true;
      g.sprite.position.set(g.island.position.x + g.ox * mirror * d.size, g.island.position.y + g.oy * d.size, 0);
      g.sprite.scale.set(size, size, 1);
      g.sprite.material.rotation = k * 0.9;
      g.sprite.material.opacity = pulse;
    });
  }

  buildOrbs() {
    const THREE = window.THREE;
    this.nodes.filter(n => n.category !== 'chapter').forEach(node => {
      const map = this.textures.orbs[node.category] || this.textures.orbs.concept;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map, transparent: true, depthWrite: false, depthTest: false, opacity: 0.95
      }));
      sprite.userData = { ...node, phase: Math.random() * Math.PI * 2 };
      sprite.visible = false;
      this.scene.add(sprite);
      this.orbSprites.push(sprite);
      this.nodeMeshes.push(sprite);
    });
  }

  buildPath() {
    const THREE = window.THREE;
    this.pathMaterial = new THREE.MeshBasicMaterial({
      map: this.textures.ribbon, transparent: true, depthWrite: false, depthTest: false,
      color: 0xffffff, opacity: 0.9
    });
    this.pathMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.pathMaterial);
    this.pathMesh.renderOrder = 1;
    this.scene.add(this.pathMesh);

    this.travelingLight = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures.glow, transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending
    }));
    this.travelingLight.renderOrder = 2;
    this.scene.add(this.travelingLight);

    // Comet tail that follows the traveling light along the path
    this.trailHistory = [];
    this.trail = Array.from({ length: 18 }, () => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.textures.glow, transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending, opacity: 0
      }));
      sprite.renderOrder = 2;
      sprite.visible = false;
      this.scene.add(sprite);
      return sprite;
    });
  }

  updateTrail() {
    if (!this.trail) return;
    const active = this.travelingLight && this.travelingLight.visible && !this.reducedMotion;
    if (active) {
      this.trailHistory.unshift(this.travelingLight.position.clone());
      if (this.trailHistory.length > this.trail.length * 2) this.trailHistory.pop();
    }
    this.trail.forEach((sprite, i) => {
      const point = this.trailHistory[i * 2];
      if (!active || !point) {
        sprite.visible = false;
        return;
      }
      const f = 1 - i / this.trail.length;
      sprite.visible = true;
      sprite.position.copy(point);
      sprite.scale.set(3.4 * (0.35 + 0.65 * f), 3.4 * (0.35 + 0.65 * f), 1);
      sprite.material.opacity = Math.pow(f, 1.6) * 0.75;
    });
  }

  buildEdges() {
    const THREE = window.THREE;
    this.edgeMaterial = new THREE.LineBasicMaterial({ color: 0xf2c66d, transparent: true, opacity: 0.35, depthTest: false });
    this.edgeLines = new THREE.LineSegments(new THREE.BufferGeometry(), this.edgeMaterial);
    this.edgeLines.renderOrder = 1;
    this.scene.add(this.edgeLines);
  }

  /** Rebuild the golden ribbon through the island positions (front to back). */
  rebuildPathGeometry() {
    const THREE = window.THREE;
    const islands = [...this.islandMeshes].sort((a, b) => a.userData.chNum - b.userData.chNum);
    if (islands.length < 2) return;

    const points = islands.map(m => new THREE.Vector3(
      m.userData.baseX,
      m.userData.baseY - m.userData.size * 0.12,
      0
    ));
    const widths = islands.map(m => m.userData.size * 0.085);
    this.pathCurve = new THREE.CatmullRomCurve3(points, false, 'centripetal');

    const samples = 220;
    const positions = new Float32Array((samples + 1) * 2 * 3);
    const uvs = new Float32Array((samples + 1) * 2 * 2);
    const indices = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = this.pathCurve.getPointAt(t);
      const tan = this.pathCurve.getTangentAt(t);
      const nx = -tan.y, ny = tan.x;
      const seg = t * (widths.length - 1);
      const k = Math.min(widths.length - 2, Math.floor(seg));
      const w = widths[k] + (widths[k + 1] - widths[k]) * (seg - k);
      const o = i * 6;
      positions[o] = p.x + nx * w; positions[o + 1] = p.y + ny * w; positions[o + 2] = 0;
      positions[o + 3] = p.x - nx * w; positions[o + 4] = p.y - ny * w; positions[o + 5] = 0;
      const uo = i * 4;
      uvs[uo] = t; uvs[uo + 1] = 0; uvs[uo + 2] = t; uvs[uo + 3] = 1;
      if (i < samples) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    this.pathMesh.geometry.dispose();
    this.pathMesh.geometry = geom;
  }

  rebuildEdgeGeometry() {
    const THREE = window.THREE;
    const pos = new Map();
    this.islandMeshes.forEach(m => pos.set(m.userData.id, { x: m.userData.baseX, y: m.userData.baseY }));
    this.orbSprites.forEach(s => pos.set(s.userData.id, { x: s.userData.baseX, y: s.userData.baseY, visible: s.visible }));

    const coords = [];
    this.edges.forEach(e => {
      const a = pos.get(e.source);
      const b = pos.get(e.target);
      if (!a || !b) return;
      const aOrb = this.orbSprites.find(s => s.userData.id === e.source);
      const bOrb = this.orbSprites.find(s => s.userData.id === e.target);
      // Draw only edges that touch a visible orb; chapter-to-chapter links are the golden path.
      if (!((aOrb && aOrb.visible) || (bOrb && bOrb.visible))) return;
      if ((aOrb && !aOrb.visible) || (bOrb && !bOrb.visible)) return;
      coords.push(a.x, a.y, 0, b.x, b.y, 0);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(coords), 3));
    this.edgeLines.geometry.dispose();
    this.edgeLines.geometry = geom;
  }

  /** Position every island, orb, and hit area for the current canvas aspect. */
  applyLayout() {
    if (!this.scene) return;
    const placed = layoutNodes(this.nodes, this.layoutTable);

    this.islandMeshes.forEach(mesh => {
      const slot = placed.get(mesh.userData.id);
      if (!slot) return;
      const world = toWorld(slot, this.aspect);
      const size = slot.s * VIEW_HEIGHT;
      const b = mesh.userData.bounds || DEFAULT_ISLAND_BOUNDS;
      Object.assign(mesh.userData, { baseX: world.x, baseY: world.y, size });

      // Alternate mirroring keeps a repeated sprite from reading as a copy.
      const mirror = mesh.userData.chNum % 2 === 0 ? -1 : 1;
      mesh.scale.set(size * mirror, size, 1);
      mesh.position.set(world.x, world.y, 0);
      mesh.renderOrder = 10 + world.z;

      const hit = mesh.userData.hit;
      hit.scale.set((b.right - b.left) * 0.9, (b.bottom - b.top) * 0.75, 1);
      hit.position.set(((b.left + b.right) / 2 - 0.5), 0.5 - (b.top + (b.bottom - b.top) * 0.42), 0);

      const lantern = mesh.userData.lantern;
      lantern.position.set(0.12, 0.5 - b.top - 0.06, 0);
      lantern.scale.set(0.22, 0.22, 1);
    });

    this.orbSprites.forEach(sprite => {
      const slot = placed.get(sprite.userData.id);
      if (!slot) return;
      const world = toWorld(slot, this.aspect);
      const size = slot.s * VIEW_HEIGHT;
      Object.assign(sprite.userData, { baseX: world.x, baseY: world.y, size });
      sprite.scale.set(size, size, 1);
      sprite.position.set(world.x, world.y, 0);
      sprite.renderOrder = 60;
    });

    this.rebuildPathGeometry();
    this.rebuildEdgeGeometry();
  }

  /* ---------------- Labels ---------------- */

  setupLabelsOverlay() {
    // The overlay lives inside the container so it follows the canvas between
    // the desktop stage and the mobile map box.
    const legacy = document.getElementById('three-labels-overlay');
    if (legacy && legacy.parentElement !== this.container) legacy.remove();

    const overlay = document.createElement('div');
    overlay.id = 'three-labels-overlay';
    overlay.className = 'three-labels-overlay';
    overlay.setAttribute('role', 'group');
    overlay.setAttribute('aria-label', 'Adventure Map destinations');
    this.container.appendChild(overlay);
    this.labelsOverlay = overlay;
    this.labelElements.clear();

    this.chapterNodes().forEach(node => {
      const chNum = chapterNumberOf(node);
      const chData = CHAPTERS_DATA.find(c => c.number === chNum);
      const titleEng = chData ? chData.titleEng : node.label;
      const full = FULL_LABEL_CHAPTERS.includes(chNum);
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `island-label-pill${full ? '' : ' compact'}`;
      pill.id = `island-label-${chNum}`;
      pill.dataset.id = node.id;
      pill.setAttribute('aria-label', `Chapter ${chNum}: ${titleEng}`);
      pill.innerHTML = `<span class="pill-number">${chNum}.</span><span class="pill-title">${titleEng}</span>`;
      this.bindLabel(pill, node);
      overlay.appendChild(pill);
      this.labelElements.set(node.id, pill);
    });

    this.nodes.filter(n => n.category !== 'chapter').forEach(node => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `orb-label-pill orb-${node.category}`;
      pill.dataset.id = node.id;
      pill.textContent = node.label.replace(/\s*\(.*\)$/, '');
      pill.setAttribute('aria-label', node.label);
      pill.style.display = 'none';
      this.bindLabel(pill, node);
      overlay.appendChild(pill);
      this.labelElements.set(node.id, pill);
    });
  }

  bindLabel(pill, node) {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectNode(node);
    });
    pill.addEventListener('mouseenter', () => this.setHovered(node.id));
    pill.addEventListener('mouseleave', () => this.setHovered(null));
    pill.addEventListener('focus', () => this.setHovered(node.id));
    pill.addEventListener('blur', () => this.setHovered(null));
  }

  updateLabelsPositions() {
    if (!this.labelsOverlay || !this.camera || !this.container) return;
    const THREE = window.THREE;
    const { width, height } = this.containerSize();
    if (!width || !height) return;
    const v = new THREE.Vector3();

    const place = (pill, x, y) => {
      v.set(x, y, 0).project(this.camera);
      const px = (v.x * 0.5 + 0.5) * width;
      const py = (-v.y * 0.5 + 0.5) * height;
      pill.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -100%)`;
    };

    this.islandMeshes.forEach(mesh => {
      const pill = this.labelElements.get(mesh.userData.id);
      if (!pill || pill.style.display === 'none') return;
      const b = mesh.userData.bounds || DEFAULT_ISLAND_BOUNDS;
      const top = mesh.position.y + (0.5 - b.top) * mesh.scale.y;
      place(pill, mesh.position.x, top + 0.6);
    });

    this.orbSprites.forEach(sprite => {
      const pill = this.labelElements.get(sprite.userData.id);
      if (!pill || !sprite.visible) return;
      place(pill, sprite.position.x, sprite.position.y + sprite.userData.size * 0.42);
    });
  }

  /* ---------------- Interaction ---------------- */

  setupInteractions() {
    const THREE = window.THREE;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downX = 0, downY = 0, dragging = false, moved = false;

    const pick = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, this.camera);
      // Raycasting ignores .visible, so filter hidden orbs out first (island hit planes are always live).
      const targets = this.nodeMeshes.filter(m => m.userData.category === 'chapter' || m.visible);
      const hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return null;
      // Prefer the front-most island (largest renderOrder).
      hits.sort((a, b) => this.orderOf(b.object) - this.orderOf(a.object));
      return hits[0].object.userData;
    };

    this.onPointerDown = (e) => {
      dragging = true;
      moved = false;
      downX = e.clientX;
      downY = e.clientY;
    };
    this.onPointerUp = (e) => {
      if (dragging && !moved && e.target && this.container.contains(e.target) && !e.target.closest('button')) {
        const node = pick(e.clientX, e.clientY);
        if (node) this.selectNode(node);
      }
      dragging = false;
    };
    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width - 0.5);
      this.pointer.y = ((e.clientY - rect.top) / rect.height - 0.5);
      if (dragging) {
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        if (moved) {
          const unitsPerPx = VIEW_HEIGHT / rect.height / this.pan.zoom;
          this.panTarget.x = this.clampPanX(this.panTarget.x - e.movementX * unitsPerPx);
          this.panTarget.y = this.clampPanY(this.panTarget.y + e.movementY * unitsPerPx);
        }
        return;
      }
      if (e.pointerType === 'mouse') {
        const node = pick(e.clientX, e.clientY);
        this.setHovered(node ? node.id : null);
        this.container.style.cursor = node ? 'pointer' : 'grab';
      }
    };

    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    this.container.addEventListener('mouseleave', () => {
      this.pointer.x = 0;
      this.pointer.y = 0;
      this.setHovered(null);
    });
  }

  orderOf(object) {
    return (object.parent && object.parent.type !== 'Scene' ? object.parent.renderOrder : object.renderOrder) || 0;
  }

  clampPanX(x) {
    const limit = VIEW_HEIGHT * this.aspect * 0.12;
    return Math.max(-limit, Math.min(limit, x));
  }

  clampPanY(y) {
    return Math.max(-10, Math.min(10, y));
  }

  setHovered(id) {
    if (this.hoveredId === id) return;
    this.hoveredId = id;
    this.labelElements.forEach((pill, pid) => pill.classList.toggle('hovered', pid === id));
  }

  selectNode(node) {
    if (!node) return;
    const raw = this.nodes.find(n => n.id === node.id) || node;
    this.selectedId = raw.id;
    this.labelElements.forEach((pill, id) => {
      pill.classList.toggle('active', id === raw.id);
      pill.setAttribute('aria-pressed', String(id === raw.id));
    });

    const target = this.islandMeshes.find(m => m.userData.id === raw.id) || this.orbSprites.find(s => s.userData.id === raw.id);
    if (target && this.scene) {
      this.spawnHalo(target.userData.baseX, target.userData.baseY, target.userData.size);
      // Ease the view a little toward the selection without losing the composition.
      this.panTarget.x = this.clampPanX(target.userData.baseX * 0.18);
      this.panTarget.y = this.clampPanY(target.userData.baseY * 0.12);
      this.panTarget.zoom = 1.06;
    }

    if (this.onNodeSelect) {
      this.onNodeSelect(buildNodeDrawerContent(raw), raw);
    }
  }

  /** Return to the full composition (called when the details panel closes). */
  resetView() {
    this.selectedId = null;
    this.panTarget = { x: 0, y: 0, zoom: 1 };
    this.labelElements.forEach(pill => {
      pill.classList.remove('active');
      pill.setAttribute('aria-pressed', 'false');
    });
  }

  /** Screen position of a node, in CSS pixels relative to the container (or null). */
  screenPositionOf(id) {
    if (!this.camera || !window.THREE) return null;
    const target = this.islandMeshes.find(m => m.userData.id === id) || this.orbSprites.find(s => s.userData.id === id);
    if (!target) return null;
    const { width, height } = this.containerSize();
    const v = new window.THREE.Vector3(target.position.x, target.position.y, 0).project(this.camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height };
  }

  focusChapter(chapterNum = 1) {
    const node = this.nodes.find(n => n.id === `ch_${chapterNum}`);
    if (node) this.selectNode(node);
  }

  spawnHalo(x, y, size) {
    if (!this.scene || this.reducedMotion) return;
    const THREE = window.THREE;
    const ring = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures.ring, transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending
    }));
    ring.position.set(x, y, 0);
    ring.renderOrder = 80;
    this.scene.add(ring);
    this.effects.push({ type: 'halo', sprite: ring, start: performance.now(), duration: 520, size: size * 0.9 });

    for (let i = 0; i < 12; i++) {
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.textures.glow, transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending
      }));
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      spark.position.set(x, y, 0);
      spark.renderOrder = 81;
      this.scene.add(spark);
      this.effects.push({
        type: 'spark', sprite: spark, start: performance.now(), duration: 650 + Math.random() * 250,
        vx: Math.cos(angle) * size * 0.55, vy: Math.sin(angle) * size * 0.45, x, y
      });
    }
  }

  updateEffects(now) {
    this.effects = this.effects.filter(fx => {
      const t = (now - fx.start) / fx.duration;
      if (t >= 1) {
        this.scene.remove(fx.sprite);
        fx.sprite.material.dispose();
        return false;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      if (fx.type === 'halo') {
        const s = fx.size * (0.5 + ease * 0.9);
        fx.sprite.scale.set(s, s, 1);
        fx.sprite.material.opacity = 1 - t;
      } else {
        fx.sprite.position.set(fx.x + fx.vx * ease, fx.y + fx.vy * ease, 0);
        const s = 2.2 * (1 - t * 0.6);
        fx.sprite.scale.set(s, s, 1);
        fx.sprite.material.opacity = 1 - t;
      }
      return true;
    });
  }

  /* ---------------- Filters & theme ---------------- */

  filterCategory(category = 'chapter') {
    this.currentFilter = category;
    const showOrb = (cat) => category === 'all' || category === cat ||
      (category === 'sacrament' && cat === 'cluster');

    this.orbSprites.forEach(sprite => {
      const cat = sprite.userData.category;
      sprite.visible = cat === 'concept' ? category !== 'chapter' : showOrb(cat);
    });

    // Islands stay visible; they dim when another category is in focus.
    const dim = category !== 'chapter' && category !== 'all';
    this.islandMeshes.forEach(mesh => {
      if (mesh.material) mesh.material.opacity = dim ? 0.45 : 1;
    });
    if (this.pathMaterial) this.pathMaterial.opacity = dim ? 0.3 : (this.theme === 'light' ? 0.85 : 0.9);
    if (this.travelingLight) this.travelingLight.visible = !dim;
    this.glintsEnabled = !dim;

    this.labelElements.forEach((pill, id) => {
      const node = this.nodes.find(n => n.id === id);
      if (!node) return;
      if (node.category === 'chapter') {
        pill.style.display = 'inline-flex';
        pill.classList.toggle('dimmed', dim);
      } else {
        const sprite = this.orbSprites.find(s => s.userData.id === id);
        pill.style.display = sprite && sprite.visible ? 'inline-flex' : 'none';
        pill.classList.toggle('quiet', category === 'all');
      }
    });

    if (this.scene) this.rebuildEdgeGeometry();
    if (!this.scene) this.renderHtmlFallback();
  }

  setTheme(theme) {
    this.theme = theme === 'light' ? 'light' : 'dark';
    if (!this.scene) return;
    const THREE = window.THREE;
    const night = this.theme === 'dark';
    this.islandMeshes.forEach(mesh => {
      // Islands take on a cool moonlit tint at night; lanterns glow.
      mesh.material.color.set(night ? 0xc8d3f2 : 0xffffff);
      mesh.userData.lantern.material.opacity = night ? 0.9 : 0;
    });
    this.pathMaterial.blending = night ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.pathMaterial.color.set(night ? 0xffd27a : 0xffc04d);
    this.pathMaterial.needsUpdate = true;
    this.edgeMaterial.color.set(night ? 0xf2c66d : 0xc98a1e);
    (this.trail || []).forEach(sprite => {
      sprite.material.blending = night ? THREE.AdditiveBlending : THREE.NormalBlending;
      sprite.material.color.set(night ? 0xffffff : 0xffc75a);
      sprite.material.needsUpdate = true;
    });
    (this.glints || []).forEach(g => {
      g.sprite.material.color.set(night ? 0xfff2cf : 0xffffff);
    });
    this.filterCategory(this.currentFilter);
  }

  /* ---------------- Sizing & lifecycle ---------------- */

  observeResize() {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', () => this.resize());
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  resize(width, height) {
    if (!this.renderer || !this.camera) return;
    const size = this.containerSize();
    const w = width || size.width;
    const h = height || size.height;
    if (!w || !h) return;
    this.aspect = w / h;
    const table = this.aspect < 1.1 ? TALL_LAYOUT : WIDE_LAYOUT;
    this.layoutTable = table;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 600 ? 1.5 : 2));
    this.renderer.setSize(w, h);
    if (this.labelsOverlay) this.labelsOverlay.classList.toggle('narrow', w < 560);
    this.applyLayout();
    this.updateCamera();
    this.updateLabelsPositions();
  }

  attachToContainer(newContainer) {
    if (!newContainer) return;
    if (this.resizeObserver && this.container) this.resizeObserver.unobserve(this.container);
    if (this.container && this.onPointerDown) {
      this.container.removeEventListener('pointerdown', this.onPointerDown);
      this.container.removeEventListener('pointermove', this.onPointerMove);
    }
    this.container = newContainer;
    if (this.renderer) {
      this.mountCanvas();
      if (this.onPointerDown) {
        this.container.addEventListener('pointerdown', this.onPointerDown);
        this.container.addEventListener('pointermove', this.onPointerMove);
      }
      if (this.resizeObserver) this.resizeObserver.observe(this.container);
      this.resize(newContainer.clientWidth, newContainer.clientHeight);
    } else if (this.labelsOverlay) {
      this.container.appendChild(this.labelsOverlay);
      this.renderHtmlFallback();
    }
  }

  updateCamera() {
    const halfW = (VIEW_HEIGHT * this.aspect) / 2 / this.pan.zoom;
    const halfH = VIEW_HEIGHT / 2 / this.pan.zoom;
    const px = this.pan.x + (this.reducedMotion ? 0 : this.pointer.x * 1.6);
    const py = this.pan.y - (this.reducedMotion ? 0 : this.pointer.y * 1.0);
    this.camera.left = -halfW + px;
    this.camera.right = halfW + px;
    this.camera.top = halfH + py;
    this.camera.bottom = -halfH + py;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.container) return;
    // Skip work while the map is hidden (another view, or the tab is in the background).
    if (document.hidden || this.container.clientWidth === 0 || this.container.clientHeight === 0) return;

    const now = performance.now();
    const t = now / 1000;
    const still = this.reducedMotion;

    this.islandMeshes.forEach(mesh => {
      const d = mesh.userData;
      const bob = still ? 0 : Math.sin(t * 0.9 + d.phase) * 0.55;
      const lift = (this.hoveredId === d.id || this.selectedId === d.id) ? 1.06 : 1;
      const mirror = d.chNum % 2 === 0 ? -1 : 1;
      const current = Math.abs(mesh.scale.y) / d.size;
      const s = current + (lift - current) * 0.2;
      mesh.scale.set(d.size * s * mirror, d.size * s, 1);
      mesh.position.set(d.baseX, d.baseY + bob, 0);
      if (this.theme === 'dark' && d.lantern) {
        d.lantern.material.opacity = 0.75 + Math.sin(t * 2.3 + d.phase) * 0.15;
      }
    });

    this.orbSprites.forEach(sprite => {
      if (!sprite.visible) return;
      const d = sprite.userData;
      const bob = still ? 0 : Math.sin(t * 1.2 + d.phase) * 0.4;
      const pulse = (this.hoveredId === d.id || this.selectedId === d.id) ? 1.25 : 1;
      sprite.position.set(d.baseX, d.baseY + bob, 0);
      sprite.scale.set(d.size * pulse, d.size * pulse, 1);
    });

    if (this.travelingLight && this.pathCurve && this.travelingLight.visible) {
      const p = this.pathCurve.getPointAt(still ? 0 : (t * 0.035) % 1);
      this.travelingLight.position.set(p.x, p.y, 0);
      const s = 4.2 + Math.sin(t * 3) * 0.6;
      this.travelingLight.scale.set(s, s, 1);
    }

    this.updateTrail();
    this.updateIslandGlints(t);

    this.pan.x += (this.panTarget.x - this.pan.x) * 0.08;
    this.pan.y += (this.panTarget.y - this.pan.y) * 0.08;
    this.pan.zoom += (this.panTarget.zoom - this.pan.zoom) * 0.08;
    this.updateCamera();
    this.updateEffects(now);

    this.renderer.render(this.scene, this.camera);
    this.updateLabelsPositions();
  }

  /** HTML fallback when WebGL is unavailable: the same islands as positioned buttons. */
  renderHtmlFallback() {
    if (!this.labelsOverlay) return;
    this.labelsOverlay.classList.add('html-fallback');
    const { width, height } = this.containerSize();
    const table = width / height < 1.1 ? TALL_LAYOUT : WIDE_LAYOUT;
    const placed = layoutNodes(this.nodes, table);
    this.labelElements.forEach((pill, id) => {
      const slot = placed.get(id);
      if (!slot || pill.style.display === 'none') return;
      pill.style.left = `${slot.u * 100}%`;
      pill.style.top = `${(slot.v - slot.s * 0.3) * 100}%`;
      pill.style.transform = 'translate(-50%, -100%)';
    });
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    if (this.scene) {
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement) this.renderer.domElement.remove();
    }
    if (this.labelsOverlay) this.labelsOverlay.remove();
  }
}
