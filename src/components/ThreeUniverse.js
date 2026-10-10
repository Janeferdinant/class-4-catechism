/**
 * ThreeUniverse Component
 * Real-time 3D WebGL Visualization using Three.js.
 * Renders the Central Jesus/Vine Golden Core, Agent Satellites, 15 Chapter Orbits,
 * and 7 Sacrament Constellations with interactive raycasting, smooth camera zoom,
 * and full content drawer resolution.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { EXAM_PAPERS_DATA } from '../data/examPapersData.js';

export function calculate3DNodePositions(nodes = []) {
  return nodes.map((node, index) => {
    let radius = 100;
    let angle = (index / nodes.length) * Math.PI * 2;
    let y = 0;

    if (node.id === 'concept_jesus_life') {
      return { ...node, x: 0, y: 0, z: 0 };
    } else if (node.category === 'agent') {
      radius = 45;
      angle = (index * 1.05);
      y = Math.sin(index) * 15;
    } else if (node.category === 'sacrament') {
      radius = 90;
      angle = (index * 0.9);
      y = Math.cos(index) * 25;
    } else if (node.category === 'chapter') {
      radius = 140;
      angle = ((node.semester === 1 ? index : index + 5) / 15) * Math.PI * 2;
      y = (node.semester === 1 ? -20 : 20) + Math.sin(index) * 10;
    } else if (node.category === 'exam') {
      radius = 180;
      angle = (index / 5) * Math.PI * 2;
      y = -35;
    }

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return { ...node, x, y, z };
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
    // e.g. "ch_1" -> 1
    const chNum = parseInt(node.id.replace('ch_', ''), 10) || 1;
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
      subtitle: `Holy Sacrament of Christ`,
      description: info.desc,
      story: `Jesus created this holy stream of grace so you can always receive His warmth and strength!`,
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
      subtitle: `Class 4 Exam Paper`,
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

export class ThreeUniverse {
  constructor(containerElement, onNodeSelect) {
    this.container = containerElement;
    this.onNodeSelect = onNodeSelect;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodeMeshes = [];
    this.animationFrameId = null;
    this.isRotating = true;
    this.selectedMesh = null;
  }

  init(nodes = [], edges = []) {
    if (!this.container) return;
    if (typeof window === 'undefined' || !window.THREE) {
      console.warn('Three.js not loaded, skipping WebGL init.');
      return;
    }

    const THREE = window.THREE;
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    this.camera.position.set(0, 45, 270);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 2.5, 500);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    // Particle Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 900;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starCoords[i] = (Math.random() - 0.5) * 650;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xa5b4fc, size: 1.6, transparent: true, opacity: 0.7 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(starField);

    // Positioned nodes
    const positionedNodes = calculate3DNodePositions(nodes);
    this.nodePositionMap = new Map();

    positionedNodes.forEach(node => {
      this.nodePositionMap.set(node.id, node);
      const isCentral = node.id === 'concept_jesus_life';
      const sphereRadius = isCentral ? 9 : Math.max(node.size * 0.38, 4);
      const geom = new THREE.SphereGeometry(sphereRadius, 24, 24);
      const col = node.color ? parseInt(node.color.replace('#', '0x'), 16) : 0x38bdf8;
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.25,
        metalness: 0.5,
        emissive: col,
        emissiveIntensity: isCentral ? 0.6 : 0.25
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = node;
      this.scene.add(mesh);
      this.nodeMeshes.push(mesh);
    });

    // Edges
    const lineMat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.4 });
    edges.forEach(edge => {
      const src = this.nodePositionMap.get(edge.source);
      const tgt = this.nodePositionMap.get(edge.target);
      if (src && tgt) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(src.x, src.y, src.z),
          new THREE.Vector3(tgt.x, tgt.y, tgt.z)
        ]);
        const line = new THREE.Line(lineGeom, lineMat);
        this.scene.add(line);
      }
    });

    this.setupInteractions();
    this.animate();
  }

  setupInteractions() {
    if (!this.container) return;
    const raycaster = new window.THREE.Raycaster();
    const mouse = new window.THREE.Vector2();

    this.container.addEventListener('click', (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.nodeMeshes);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData;
        this.selectedMesh = intersects[0].object;
        this.isRotating = false; // Pause auto-rotation on focus

        // Build rich drawer content
        const drawerData = buildNodeDrawerContent(selected);
        if (this.onNodeSelect) this.onNodeSelect(drawerData, selected);
      }
    });

    let isDragging = false;
    let prevX = 0;
    this.container.addEventListener('mousedown', (e) => { isDragging = true; prevX = e.clientX; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    this.container.addEventListener('mousemove', (e) => {
      if (isDragging && this.scene) {
        const delta = e.clientX - prevX;
        this.scene.rotation.y += delta * 0.005;
        prevX = e.clientX;
      }
    });
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.scene && this.isRotating) {
      this.scene.rotation.y += 0.0018;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
