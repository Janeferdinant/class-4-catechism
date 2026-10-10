/**
 * ThreeUniverse Component
 * Real-time 3D WebGL Visualization using Three.js for Class 4 Catechism.
 * Renders 15 floating chapter islands along a glowing golden winding S-curve path,
 * receding towards a heavenly celestial cathedral in the clouds.
 * Features HTML projected label pills, gentle bobbing animation, golden traveling light,
 * camera orbit/pan with pointer events, and node drawer integration.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { EXAM_PAPERS_DATA } from '../data/examPapersData.js';

// Smooth S-curve 3D path coordinates for the 15 chapters receding from foreground to cathedral
export const CHAPTER_PATH = [
  { x:   0, y:  -6, z:   95 }, // Ch 1: Center foreground (Jesus, The Source of Life)
  { x: -60, y: -18, z:   75 }, // Ch 2: Left lower (Jesus Gives Life Through the Church)
  { x:  14, y: -26, z:   60 }, // Ch 3: Bottom center (Sacraments)
  { x:  68, y: -12, z:   42 }, // Ch 4: Right lower (Baptism)
  { x:  80, y:   5, z:   18 }, // Ch 5: Right middle (Confirmation)
  { x:  52, y:  16, z:  -15 }, // Ch 6: Right upper
  { x:  16, y:  20, z:  -42 }, // Ch 7: Center-right mid
  { x: -32, y:  23, z:  -68 }, // Ch 8: Left mid
  { x: -60, y:  26, z:  -95 }, // Ch 9: Left upper
  { x: -34, y:  30, z: -120 }, // Ch 10: Curving right
  { x:   6, y:  33, z: -145 }, // Ch 11: Rising center
  { x:  42, y:  37, z: -168 }, // Ch 12: Rising right
  { x:  55, y:  40, z: -188 }, // Ch 13: Approaching cathedral
  { x:  28, y:  43, z: -205 }, // Ch 14: Cathedral terrace
  { x:   0, y:  46, z: -220 }, // Ch 15: Cathedral summit gate
];

export function calculate3DNodePositions(nodes = []) {
  return nodes.map((node, index) => {
    if (node.category === 'chapter') {
      const chNum = parseInt(node.id.replace('ch_', ''), 10) || (index + 1);
      const pt = CHAPTER_PATH[(chNum - 1) % 15] || CHAPTER_PATH[0];
      return { ...node, x: pt.x, y: pt.y, z: pt.z, chapterNumber: chNum };
    } else if (node.id === 'concept_jesus_life') {
      return { ...node, x: -6, y: -18, z: 86 };
    } else if (node.category === 'sacrament') {
      const sacIdx = ['sac_baptism', 'sac_confirmation', 'sac_eucharist', 'sac_reconciliation', 'sac_anointing', 'sac_orders', 'sac_matrimony'].indexOf(node.id);
      const pairedChapters = [4, 5, 6, 10, 11, 12, 13];
      const chNum = sacIdx >= 0 ? pairedChapters[sacIdx] : 3;
      const pt = CHAPTER_PATH[(chNum - 1) % 15] || CHAPTER_PATH[0];
      return { ...node, x: pt.x + 12, y: pt.y + 7, z: pt.z };
    } else if (node.category === 'exam') {
      const angle = (index / 5) * Math.PI * 2;
      return { ...node, x: Math.cos(angle) * 75, y: -32 + (index * 2), z: 25 + Math.sin(angle) * 45 };
    } else if (node.category === 'agent') {
      return { ...node, x: -75 + (index * 30), y: 52 + Math.sin(index) * 6, z: -90 + (index * 12) };
    } else if (node.category === 'cluster') {
      return { ...node, x: -45 + (index * 45), y: 35, z: -70 };
    }

    const radius = 95;
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
    return { ...node, x: Math.cos(angle) * radius, y: 10, z: Math.sin(angle) * radius };
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

export class ThreeUniverse {
  constructor(containerElement, onNodeSelect) {
    this.container = containerElement;
    this.onNodeSelect = onNodeSelect;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodeMeshes = [];
    this.islandMeshes = [];
    this.pathMesh = null;
    this.travelingLight = null;
    this.pathCurve = null;
    this.labelsOverlay = null;
    this.labelElements = new Map();
    this.animationFrameId = null;
    this.isRotating = false;
    this.selectedMesh = null;
    this.currentFilter = 'chapter';
    this.cameraTarget = {
      pos: { x: 0, y: 36, z: 220 },
      lookAt: { x: 0, y: 18, z: -45 }
    };
    this.currentLookAt = { x: 0, y: 18, z: -45 };
    this.isDragging = false;
    this.pointerX = 0;
    this.pointerY = 0;
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

    // Scene & Perspective Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    this.camera.position.set(this.cameraTarget.pos.x, this.cameraTarget.pos.y, this.cameraTarget.pos.z);
    this.camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

    // High performance transparent WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Warm heavenly lighting
    const ambientLight = new THREE.AmbientLight(0xfff6e6, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(40, 90, 60);
    this.scene.add(sunLight);

    const goldenGlowLight = new THREE.PointLight(0xffc107, 2.0, 450);
    goldenGlowLight.position.set(0, 40, -180);
    this.scene.add(goldenGlowLight);

    // Soft celestial background dust particles
    const dustCount = 350;
    const dustGeom = new THREE.BufferGeometry();
    const dustCoords = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustCoords[i] = (Math.random() - 0.5) * 450;
      dustCoords[i + 1] = Math.random() * 120 - 30;
      dustCoords[i + 2] = (Math.random() - 0.5) * 450 - 50;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustCoords, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe599,
      size: 1.8,
      transparent: true,
      opacity: 0.65
    });
    this.dustParticles = new THREE.Points(dustGeom, dustMat);
    this.scene.add(this.dustParticles);

    // Position all nodes
    const positionedNodes = calculate3DNodePositions(nodes);
    this.nodePositionMap = new Map();
    positionedNodes.forEach(n => this.nodePositionMap.set(n.id, n));

    // Build the 15 Floating Chapter Islands and Golden Winding Path
    this.buildChapterIslandsAndPath(positionedNodes);

    // Build non-chapter node markers (sacraments, exams, agents, concepts)
    this.buildAuxiliaryNodes(positionedNodes);

    // Setup HTML Label Overlay
    this.setupLabelsOverlay(positionedNodes);

    // Setup pointer events and raycasting
    this.setupInteractions();

    // Set initial filter to chapters
    this.filterCategory('chapter');

    // Start render loop
    this.animate();
  }

  buildChapterIslandsAndPath(positionedNodes) {
    const THREE = window.THREE;
    const textureLoader = new THREE.TextureLoader();

    // Extract sorted chapter nodes 1..15
    const chapterNodes = positionedNodes
      .filter(n => n.category === 'chapter')
      .sort((a, b) => {
        const numA = parseInt(a.id.replace('ch_', ''), 10) || 0;
        const numB = parseInt(b.id.replace('ch_', ''), 10) || 0;
        return numA - numB;
      });

    // 1. Build Golden Winding Ribbon Path
    if (chapterNodes.length > 1) {
      const pathPoints = chapterNodes.map(node => new THREE.Vector3(node.x, node.y - 1.2, node.z));
      this.pathCurve = new THREE.CatmullRomCurve3(pathPoints);
      this.pathCurve.curveType = 'centripetal';
      this.pathCurve.tension = 0.5;

      const tubeGeom = new THREE.TubeGeometry(this.pathCurve, 140, 1.4, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.65
      });
      this.pathMesh = new THREE.Mesh(tubeGeom, tubeMat);
      this.pathMesh.renderOrder = 1;
      this.scene.add(this.pathMesh);

      // Traveling light particle along the path
      const lightGeom = new THREE.SphereGeometry(2.6, 14, 14);
      const lightMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff3a8,
        emissiveIntensity: 1.8,
        roughness: 0.1
      });
      this.travelingLight = new THREE.Mesh(lightGeom, lightMat);
      this.scene.add(this.travelingLight);
    }

    // 2. Build 15 Floating Chapter Islands
    chapterNodes.forEach((node, idx) => {
      const chNum = parseInt(node.id.replace('ch_', ''), 10) || (idx + 1);
      const numStr = String(chNum).padStart(2, '0');
      const texturePath = `assets/generated/islands/island-ch${numStr}.webp`;

      // Scale islands smoothly: Chapter 1 is largest in foreground, Ch 15 smaller in depth
      const depthFactor = Math.max(0, Math.min(1, (node.z + 215) / 300));
      const width = 26 + (depthFactor * 26); // 26 to 52
      const height = width * 0.85;

      const texture = textureLoader.load(texturePath);
      const islandMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.03,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const islandGeom = new THREE.PlaneGeometry(width, height);
      const islandMesh = new THREE.Mesh(islandGeom, islandMat);
      islandMesh.position.set(node.x, node.y, node.z);
      islandMesh.userData = {
        ...node,
        baseY: node.y,
        width,
        height,
        chNum
      };
      islandMesh.renderOrder = Math.round(300 - node.z);

      // Glowing golden shrine/beacon at top of island
      const beaconGeom = new THREE.SphereGeometry(1.6 * (0.6 + 0.4 * depthFactor), 12, 12);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xfff176,
        emissive: 0xffb300,
        emissiveIntensity: 1.4,
        roughness: 0.2
      });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(0, height * 0.38, 0.8);
      islandMesh.add(beacon);

      this.scene.add(islandMesh);
      this.nodeMeshes.push(islandMesh);
      this.islandMeshes.push(islandMesh);
    });
  }

  buildAuxiliaryNodes(positionedNodes) {
    const THREE = window.THREE;
    const auxNodes = positionedNodes.filter(n => n.category !== 'chapter');

    auxNodes.forEach(node => {
      let radius = 6;
      let col = 0x38bdf8;
      let emissiveCol = 0x0284c7;

      if (node.id === 'concept_jesus_life') {
        radius = 9;
        col = 0xffb703;
        emissiveCol = 0xf59e0b;
      } else if (node.category === 'sacrament') {
        radius = 5.5;
        col = 0x60a5fa;
        emissiveCol = 0x2563eb;
      } else if (node.category === 'exam') {
        radius = 5;
        col = 0xf43f5e;
        emissiveCol = 0xbe123c;
      } else if (node.category === 'agent') {
        radius = 5.5;
        col = 0x10b981;
        emissiveCol = 0x059669;
      }

      const geom = new THREE.SphereGeometry(radius, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: emissiveCol,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.4
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = { ...node, baseY: node.y };
      mesh.visible = false; // Hidden when filter is 'chapter'
      this.scene.add(mesh);
      this.nodeMeshes.push(mesh);
    });
  }

  setupLabelsOverlay(positionedNodes) {
    if (!this.container) return;
    let overlay = document.getElementById('three-labels-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'three-labels-overlay';
      overlay.className = 'three-labels-overlay';
      this.container.appendChild(overlay);
    }
    overlay.innerHTML = '';
    this.labelsOverlay = overlay;
    this.labelElements.clear();

    const chapterNodes = positionedNodes.filter(n => n.category === 'chapter');
    chapterNodes.forEach((node) => {
      const chNum = parseInt(node.id.replace('ch_', ''), 10) || 1;
      const chData = CHAPTERS_DATA.find(c => c.number === chNum);
      const titleEng = chData ? chData.titleEng : node.label;

      const isLandmark = [1, 2, 3, 4, 5, 15].includes(chNum);
      const pill = document.createElement('button');
      pill.className = `island-label-pill${isLandmark ? '' : ' compact'}`;
      pill.id = `island-label-${chNum}`;
      pill.setAttribute('data-id', node.id);
      pill.setAttribute('type', 'button');
      pill.setAttribute('tabindex', '0');

      pill.innerHTML = `
        <span class="pill-number">${chNum}${isLandmark ? '.' : ''}</span>
        <span class="pill-title">${titleEng}</span>
      `;

      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectNode(node);
      });

      overlay.appendChild(pill);
      this.labelElements.set(node.id, pill);
    });
  }

  setupInteractions() {
    if (!this.container) return;
    const THREE = window.THREE;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Click handler for 3D islands
    this.container.addEventListener('click', (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const visibleMeshes = this.nodeMeshes.filter(m => m.visible);
      const intersects = raycaster.intersectObjects(visibleMeshes);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData;
        this.selectNode(selected);
      }
    });

    // Touch and mouse pointer drag interactions
    let prevX = 0;
    let prevY = 0;

    this.container.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointerup', () => { this.isDragging = false; });
    window.addEventListener('pointercancel', () => { this.isDragging = false; });

    this.container.addEventListener('pointermove', (e) => {
      if (this.isDragging && this.camera) {
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;

        this.cameraTarget.pos.x -= deltaX * 0.12;
        this.cameraTarget.pos.y += deltaY * 0.10;
        // Clamp bounds so scene stays centered
        this.cameraTarget.pos.x = Math.max(-80, Math.min(80, this.cameraTarget.pos.x));
        this.cameraTarget.pos.y = Math.max(10, Math.min(75, this.cameraTarget.pos.y));

        prevX = e.clientX;
        prevY = e.clientY;
      }
    });

    // Subtle pointer parallax when not dragging
    this.container.addEventListener('mousemove', (e) => {
      if (!this.isDragging) {
        const rect = this.container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        this.pointerX = normX * 12;
        this.pointerY = normY * 8;
      }
    });
  }

  selectNode(node) {
    if (!node) return;
    const rawNode = this.nodePositionMap.get(node.id) || node;
    const mesh = this.nodeMeshes.find(m => m.userData.id === node.id);

    // Update active state on label pills
    this.labelElements.forEach((pill, id) => {
      pill.classList.toggle('active', id === node.id);
    });

    if (mesh) {
      this.selectedMesh = mesh;
      // Fly camera gently toward the selected island
      this.cameraTarget.pos.x = mesh.position.x * 0.5;
      this.cameraTarget.pos.y = Math.max(20, mesh.position.y + 16);
      this.cameraTarget.pos.z = Math.min(200, mesh.position.z + 85);

      this.cameraTarget.lookAt.x = mesh.position.x;
      this.cameraTarget.lookAt.y = mesh.position.y;
      this.cameraTarget.lookAt.z = mesh.position.z;
    }

    const drawerData = buildNodeDrawerContent(rawNode);
    if (this.onNodeSelect) {
      this.onNodeSelect(drawerData, rawNode);
    }
  }

  focusChapter(chapterNum = 1) {
    const chId = `ch_${chapterNum}`;
    const targetNode = this.nodePositionMap.get(chId);
    if (targetNode) {
      this.selectNode(targetNode);
    }
  }

  filterCategory(category = 'chapter') {
    this.currentFilter = category;

    // Toggle node visibility
    this.nodeMeshes.forEach(mesh => {
      if (category === 'all') {
        mesh.visible = true;
      } else if (category === 'chapter') {
        mesh.visible = mesh.userData.category === 'chapter';
      } else {
        mesh.visible = mesh.userData.category === category || mesh.userData.id === 'concept_jesus_life';
      }
    });

    // Path visibility
    if (this.pathMesh) {
      this.pathMesh.visible = category === 'chapter' || category === 'all';
    }
    if (this.travelingLight) {
      this.travelingLight.visible = category === 'chapter' || category === 'all';
    }

    // Label visibility
    this.labelElements.forEach((pill, id) => {
      const node = this.nodePositionMap.get(id);
      if (category === 'all' || category === 'chapter') {
        pill.style.display = 'flex';
      } else {
        pill.style.display = (node && node.category === category) ? 'flex' : 'none';
      }
    });
  }

  updateLabelsPositions() {
    if (!this.labelsOverlay || !this.camera || !this.container) return;
    const THREE = window.THREE;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const tempVec = new THREE.Vector3();

    this.islandMeshes.forEach(mesh => {
      const pill = this.labelElements.get(mesh.userData.id);
      if (!pill || pill.style.display === 'none') return;

      // Position pill hovering directly above the island's top
      const topOffset = (mesh.userData.height || 30) * 0.44 + 4.0;
      tempVec.set(mesh.position.x, mesh.position.y + topOffset, mesh.position.z);
      tempVec.project(this.camera);

      // Check if behind camera
      if (tempVec.z > 1.0) {
        pill.style.opacity = '0';
        pill.style.pointerEvents = 'none';
        return;
      }

      const px = (tempVec.x * 0.5 + 0.5) * width;
      const py = (-tempVec.y * 0.5 + 0.5) * height;

      // Distance scale
      const dist = this.camera.position.distanceTo(mesh.position);
      const scale = Math.max(0.72, Math.min(1.05, 140 / dist));

      pill.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -100%) scale(${scale.toFixed(3)})`;
      pill.style.opacity = '1';
      pill.style.pointerEvents = 'auto';
    });
  }

  resize(width, height) {
    if (!this.renderer || !this.camera) return;
    const w = width || (this.container ? this.container.clientWidth : 800) || 800;
    const h = height || (this.container ? this.container.clientHeight : 500) || 500;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.updateLabelsPositions();
  }

  attachToContainer(newContainer) {
    if (!newContainer) return;
    this.container = newContainer;
    if (this.renderer && this.renderer.domElement) {
      if (this.renderer.domElement.parentElement !== newContainer) {
        newContainer.innerHTML = '';
        newContainer.appendChild(this.renderer.domElement);
      }
      this.resize(newContainer.clientWidth, newContainer.clientHeight);
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.0016;

    // Gentle island bobbing animation (2-3px offset per §8)
    this.islandMeshes.forEach((mesh, idx) => {
      const bob = Math.sin(time + (idx * 0.75)) * 1.6;
      mesh.position.y = mesh.userData.baseY + bob;
    });

    // Traveling light on the golden path
    if (this.travelingLight && this.pathCurve && this.travelingLight.visible) {
      const t = (Date.now() * 0.00012) % 1.0;
      const pos = this.pathCurve.getPointAt(t);
      if (pos) this.travelingLight.position.copy(pos);
    }

    // Smooth camera easing towards target
    if (this.camera) {
      const targetX = this.cameraTarget.pos.x + this.pointerX;
      const targetY = this.cameraTarget.pos.y + this.pointerY;
      const targetZ = this.cameraTarget.pos.z;

      this.camera.position.x += (targetX - this.camera.position.x) * 0.04;
      this.camera.position.y += (targetY - this.camera.position.y) * 0.04;
      this.camera.position.z += (targetZ - this.camera.position.z) * 0.04;

      this.currentLookAt.x += (this.cameraTarget.lookAt.x - this.currentLookAt.x) * 0.04;
      this.currentLookAt.y += (this.cameraTarget.lookAt.y - this.currentLookAt.y) * 0.04;
      this.currentLookAt.z += (this.cameraTarget.lookAt.z - this.currentLookAt.z) * 0.04;

      this.camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);
    }

    // Render WebGL frame
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // Update projected HTML label positions
    this.updateLabelsPositions();
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    if (this.labelsOverlay) {
      this.labelsOverlay.remove();
    }
  }
}
