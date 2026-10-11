/**
 * MotionGraphicsEngine
 * Motion graphics for Class 4 Catechism:
 * 1. Interactive 3D card tilt (mouse parallax)
 * 2. Layered celestial atmosphere, tuned separately for the two themes
 *    Night: twinkling star field with bright glints, gentle constellations,
 *           drifting nebula glow, celestial dust, fireflies, shooting stars.
 *    Day:   swaying sun rays, drifting cloud wisps, rising gold dust,
 *           sparkle glints, soft light orbs.
 *    An optional foreground canvas adds sparse, larger motes over the map.
 * 3. Small sparkle overlays for slide and story artwork.
 *
 * Every surface uses one requestAnimationFrame loop, time-based motion (frame-rate
 * independent), pre-rendered glow sprites (no per-particle canvas blur), device-pixel-
 * ratio sizing, ResizeObserver, pausing when hidden, and a static frame under
 * prefers-reduced-motion.
 */

const TAU = Math.PI * 2;
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* ---------------- Pre-rendered sprites (drawn once, reused) ---------------- */
const spriteCache = new Map();

function makeSprite(key, size, draw) {
  if (spriteCache.has(key)) return spriteCache.get(key);
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  draw(c.getContext('2d'), size);
  spriteCache.set(key, c);
  return c;
}

function glowSprite(color) {
  return makeSprite(`glow:${color}`, 64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, color);
    g.addColorStop(0.45, color.replace(/[\d.]+\)$/, '0.25)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function glintSprite(color) {
  return makeSprite(`glint:${color}`, 64, (ctx, s) => {
    const c = s / 2;
    ctx.globalCompositeOperation = 'lighter';
    for (const [w, h] of [[s, s * 0.09], [s * 0.09, s]]) {
      const g = ctx.createRadialGradient(c, c, 0, c, c, s / 2);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(c, c, w / 2, h / 2, 0, 0, TAU);
      ctx.fill();
    }
    const core = ctx.createRadialGradient(c, c, 0, c, c, s * 0.16);
    core.addColorStop(0, 'rgba(255,255,255,1)');
    core.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, s, s);
  });
}

function bokehSprite(color) {
  return makeSprite(`bokeh:${color}`, 64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.05, s / 2, s / 2, s / 2);
    g.addColorStop(0, color);
    g.addColorStop(0.75, color.replace(/[\d.]+\)$/, '0.55)'));
    g.addColorStop(0.92, color.replace(/[\d.]+\)$/, '0.8)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function puffSprite() {
  return makeSprite('puff', 128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,253,246,0.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function drawSprite(ctx, sprite, x, y, size, alpha) {
  if (!sprite || alpha <= 0.004) return;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
}

/* ---------------- Canvas surface: DPR sizing + resize tracking ---------------- */
function createSurface(canvas, onResize) {
  const ctx = canvas.getContext('2d');
  const surface = { canvas, ctx, width: 0, height: 0, dpr: 1 };
  const measure = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2);
    if (w === surface.width && h === surface.height && dpr === surface.dpr) return true;
    const oldW = surface.width;
    const oldH = surface.height;
    surface.width = w;
    surface.height = h;
    surface.dpr = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize(oldW, oldH);
    return true;
  };
  surface.measure = measure;
  if (typeof ResizeObserver !== 'undefined') {
    surface.observer = new ResizeObserver(() => measure());
    surface.observer.observe(canvas);
  }
  return surface;
}

export class MotionGraphicsEngine {
  constructor() {
    this.animationFrames = new Map();
    this.atmosphereSystems = new Set();
    this.prefersReducedMotion = false;

    if (typeof window !== 'undefined' && window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = motionQuery.matches;
      motionQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
      });

      // Pause every atmosphere loop while the tab is in the background
      document.addEventListener('visibilitychange', () => {
        for (const sys of this.atmosphereSystems) {
          if (document.hidden) sys.pause();
          else sys.resume();
        }
      });
    }
  }

  /**
   * Calculates 3D rotation angles based on cursor position relative to element bounds
   */
  calculateTilt(x, y, rect, maxTilt = 15) {
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return { rotateX: 0, rotateY: 0 };
    }
    const relativeX = (x - rect.left) / rect.width;
    const relativeY = (y - rect.top) / rect.height;

    const rotateX = (relativeY - 0.5) * -maxTilt * 2;
    const rotateY = (relativeX - 0.5) * maxTilt * 2;

    return {
      rotateX: Object.is(rotateX, -0) ? 0 : rotateX,
      rotateY: Object.is(rotateY, -0) ? 0 : rotateY
    };
  }

  /**
   * Generates a batch of soft golden particles (used by the artwork sparkle overlay)
   */
  createParticleBatch(count = 25, width = 600, height = 400) {
    const particles = [];
    const colors = [
      'rgba(245, 190, 90, 0.9)',   // warm gold
      'rgba(255, 228, 160, 0.95)', // pale gold
      'rgba(255, 255, 255, 0.95)', // starlight
      'rgba(170, 215, 255, 0.85)'  // sky blue
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2), // gentle upward float
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    return particles;
  }

  /**
   * Advances particle simulation by 1 frame
   */
  tickParticles(particles, width, height) {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulsePhase += p.pulseSpeed;
      p.alpha = 0.4 + Math.sin(p.pulsePhase) * 0.4;

      // Wrap around bounds
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    }
  }

  /**
   * Attaches interactive 3D physics tilt to a container
   */
  attach3DTilt(element, maxTilt = 14) {
    if (!element || typeof window === 'undefined') return;

    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'transform 0.15s ease-out';

    const onMouseMove = (e) => {
      if (this.prefersReducedMotion) return;
      const rect = element.getBoundingClientRect();
      const { rotateX, rotateY } = this.calculateTilt(e.clientX, e.clientY, rect, maxTilt);
      element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
    };

    const onMouseLeave = () => {
      element.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const onMouseEnter = () => {
      element.style.transition = 'transform 0.15s ease-out';
    };

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mouseenter', onMouseEnter);
  }

  /**
   * Sparse sparkle overlay for slide and story artwork. Re-attaching to the same
   * container replaces the previous overlay and stops its loop.
   */
  attachParticleCanvas(container) {
    if (!container || typeof window === 'undefined') return;

    const previous = this.animationFrames.get(container);
    if (previous) cancelAnimationFrame(previous);
    const existing = container.querySelector('.motion-particle-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.className = 'motion-particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '2'
    });
    container.appendChild(canvas);

    let particles = [];
    const surface = createSurface(canvas, () => {
      const count = clamp(Math.round((surface.width * surface.height) / 22000), 8, 22);
      particles = this.createParticleBatch(count, surface.width, surface.height);
    });

    const animate = () => {
      if (!canvas.isConnected) {
        this.animationFrames.delete(container);
        if (surface.observer) surface.observer.disconnect();
        return;
      }
      this.animationFrames.set(container, requestAnimationFrame(animate));
      if (!surface.measure() || document.hidden) return;
      const { ctx, width, height } = surface;
      ctx.clearRect(0, 0, width, height);
      if (!this.prefersReducedMotion) this.tickParticles(particles, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        drawSprite(ctx, glowSprite(p.color), p.x, p.y, p.radius * 7, p.alpha * 0.8);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };
    animate();
  }

  /**
   * Layered celestial atmosphere for a canvas (the Adventure Map backdrop, the mobile
   * welcome card, the mobile map). Optional foreground canvas gets sparse, larger motes.
   *
   * options.foreground  second canvas drawn over the map (under labels)
   * options.density     particle density multiplier (1 = desktop map)
   * options.sun         {x, y} sun/cathedral position as fractions (light theme rays)
   */
  attachAtmosphericSystem(canvas, initialTheme = 'dark', options = {}) {
    if (!canvas || typeof window === 'undefined') return null;
    const engine = this;
    const density = options.density || 1;
    const sun = options.sun || { x: 0.66, y: 0.2 };
    let theme = initialTheme === 'light' ? 'light' : 'dark';
    let running = true;
    let frameId = null;
    let lastTime = performance.now();
    let elapsed = 0;

    // Particle pools (rebuilt on resize and theme change)
    let stars = [], constellations = [], nebulae = [], dust = [], fireflies = [], shooting = [];
    let rays = [], clouds = [], motes = [], glints = [], orbs = [];
    let fgMotes = [], fgGlints = [], bursts = [];
    let nextShootingAt = 2;
    let nextConstellationAt = 3;

    const back = createSurface(canvas, () => build());
    const front = options.foreground ? createSurface(options.foreground, () => buildForeground()) : null;

    const area = () => back.width * back.height;
    const count = (perPx, min, max) => clamp(Math.round((area() / perPx) * density), min, max);

    function newGlint(w, h, palette, sizeRange) {
      return {
        x: rand(0, w), y: rand(0, h * 0.92), size: rand(...sizeRange),
        color: pick(palette), start: elapsed + rand(0, 3), life: rand(1.2, 2.4), spin: rand(-0.6, 0.6)
      };
    }

    function build() {
      const w = back.width, h = back.height;
      if (!w || !h) return;
      if (theme === 'dark') {
        const starColors = ['rgba(255,255,255,1)', 'rgba(242,246,255,1)', 'rgba(170,215,255,1)', 'rgba(255,232,168,1)'];
        stars = Array.from({ length: count(3400, 80, 420) }, () => {
          const bright = Math.random() < 0.1;
          return {
            x: rand(0, w), y: rand(0, h * 0.95), r: bright ? rand(1.8, 3) : rand(0.5, 1.6),
            bright, color: pick(starColors), base: rand(0.4, 0.9),
            period: rand(2.2, 7.5), phase: rand(0, TAU)
          };
        });
        // A few constellations: chains of 4-5 nearby stars that glow in turn
        constellations = [];
        const anchors = stars.filter(s => s.y < h * 0.55);
        for (let k = 0; k < 4 && anchors.length > 8; k++) {
          const seed = pick(anchors);
          const near = anchors
            .filter(s => s !== seed && Math.hypot(s.x - seed.x, s.y - seed.y) < Math.min(w, h) * 0.22)
            .sort((a, b) => Math.hypot(a.x - seed.x, a.y - seed.y) - Math.hypot(b.x - seed.x, b.y - seed.y))
            .slice(0, 4);
          if (near.length >= 3) constellations.push({ points: [seed, ...near], start: -99 });
        }
        nebulae = [
          { x: w * 0.22, y: h * 0.3, r: w * 0.32, color: [90, 130, 255], a: 0.07, vx: 3, phase: 0 },
          { x: w * 0.7, y: h * 0.18, r: w * 0.28, color: [160, 110, 230], a: 0.05, vx: -2, phase: 2 },
          { x: w * 0.55, y: h * 0.7, r: w * 0.36, color: [255, 200, 120], a: 0.035, vx: 2.5, phase: 4 }
        ];
        dust = Array.from({ length: count(8000, 40, 170) }, () => ({
          x: rand(0, w), y: rand(0, h), r: rand(0.8, 2.2),
          color: pick(['rgba(190,220,255,0.9)', 'rgba(255,232,168,0.9)', 'rgba(255,255,255,0.9)']),
          vx: rand(-14, 14), vy: rand(-8, 8), base: rand(0.25, 0.65), phase: rand(0, TAU), period: rand(3, 8)
        }));
        fireflies = Array.from({ length: count(26000, 14, 48) }, () => ({
          x: rand(0, w), y: rand(h * 0.35, h), r: rand(2.6, 4.6),
          angle: rand(0, TAU), speed: rand(6, 16), turn: rand(-0.8, 0.8), phase: rand(0, TAU), period: rand(1.8, 4)
        }));
        shooting = [];
        rays = []; clouds = []; motes = []; glints = []; orbs = [];
      } else {
        rays = Array.from({ length: 8 }, (_, i) => ({
          angle: (i / 8) * Math.PI * 0.9 + Math.PI * 0.05 + rand(-0.08, 0.08),
          width: rand(0.05, 0.11), length: rand(0.7, 1.1), sway: rand(0.015, 0.04),
          phase: rand(0, TAU), period: rand(9, 16), alpha: rand(0.05, 0.1)
        }));
        clouds = Array.from({ length: 7 }, (_, i) => ({
          x: rand(-0.2, 1) * w, y: (0.08 + (i / 7) * 0.7) * h + rand(-20, 20),
          scale: rand(0.7, 1.4), speed: rand(3, 10), alpha: rand(0.1, 0.22),
          puffs: Array.from({ length: 4 }, () => ({ dx: rand(-70, 70), dy: rand(-16, 16), r: rand(45, 85) }))
        }));
        motes = Array.from({ length: count(5500, 60, 240) }, () => ({
          x: rand(0, w), y: rand(0, h), r: rand(0.9, 2.8),
          color: pick(['rgba(232,160,40,0.95)', 'rgba(245,180,60,0.95)', 'rgba(214,140,30,0.9)', 'rgba(255,255,255,1)', 'rgba(110,170,235,0.85)']),
          vx: rand(-6, 6), vy: rand(-18, -6), sway: rand(6, 18), phase: rand(0, TAU), period: rand(2.5, 6)
        }));
        glints = Array.from({ length: count(24000, 18, 56) }, () =>
          newGlint(w, h, ['rgba(245,180,60,1)', 'rgba(255,214,120,1)', 'rgba(255,255,255,1)'], [14, 30]));
        orbs = Array.from({ length: count(70000, 8, 18) }, () => ({
          x: rand(0, w), y: rand(0, h), r: rand(10, 26), vx: rand(-5, 5), vy: rand(-6, -1),
          base: rand(0.05, 0.12), phase: rand(0, TAU), period: rand(5, 10)
        }));
        stars = []; constellations = []; nebulae = []; dust = []; fireflies = []; shooting = [];
      }
    }

    function buildForeground() {
      if (!front || !front.width) return;
      const w = front.width, h = front.height;
      const fgCount = clamp(Math.round((w * h / 18000) * density), 14, 64);
      const night = theme === 'dark';
      fgMotes = Array.from({ length: fgCount }, () => ({
        x: rand(0, w), y: rand(0, h), r: rand(1.8, 4),
        color: night
          ? pick(['rgba(255,214,120,0.95)', 'rgba(255,240,200,0.95)', 'rgba(170,215,255,0.9)'])
          : pick(['rgba(232,160,40,0.95)', 'rgba(245,190,70,0.95)', 'rgba(255,255,255,1)']),
        angle: rand(0, TAU), speed: rand(5, 14), turn: rand(-0.6, 0.6), phase: rand(0, TAU), period: rand(2, 5)
      }));
      fgGlints = Array.from({ length: clamp(Math.round(fgCount / 3), 5, 20) }, () =>
        newGlint(w, h, night ? ['rgba(255,240,200,1)', 'rgba(200,225,255,1)'] : ['rgba(245,180,60,1)', 'rgba(255,255,255,1)'], [14, 30]));
    }

    function spawnShootingStar(w, h) {
      const dir = Math.random() < 0.6 ? 1 : -1; // 1 = travels right, -1 = travels left
      shooting.push({
        x: dir > 0 ? rand(w * 0.05, w * 0.6) : rand(w * 0.4, w * 0.95),
        y: rand(h * 0.02, h * 0.35), dir, angle: rand(0.35, 0.7), speed: rand(700, 1100),
        length: rand(110, 210), life: rand(0.55, 0.95), age: 0
      });
    }

    /* ---------------- Drawing ---------------- */
    function drawNight(dt, still) {
      const { ctx, width: w, height: h } = back;

      ctx.globalCompositeOperation = 'lighter';
      for (const n of nebulae) {
        if (!still) {
          n.x += n.vx * dt;
          if (n.x - n.r > w) n.x = -n.r;
          if (n.x + n.r < 0) n.x = w + n.r;
        }
        const breathe = n.a * (0.75 + 0.25 * Math.sin(elapsed / 6 + n.phase));
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `rgba(${n.color.join(',')},${breathe})`);
        g.addColorStop(1, `rgba(${n.color.join(',')},0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      }

      for (const s of stars) {
        const tw = still ? 0.5 : 0.5 + 0.5 * Math.sin((elapsed / s.period) * TAU + s.phase);
        const a = s.base * (0.35 + 0.65 * tw);
        if (s.bright) {
          drawSprite(ctx, glintSprite(s.color), s.x, s.y, s.r * 9 * (0.75 + 0.25 * tw), a + 0.2);
        } else {
          drawSprite(ctx, glowSprite(s.color), s.x, s.y, s.r * 6, a);
        }
      }

      // Constellations: draw one at a time; lines fade in, hold, fade out
      if (!still && elapsed > nextConstellationAt && constellations.length) {
        pick(constellations).start = elapsed;
        nextConstellationAt = elapsed + rand(6, 11);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const c of constellations) {
        const t = elapsed - c.start;
        if (t < 0 || t > 5) continue;
        const fade = t < 1.5 ? t / 1.5 : t > 3.5 ? (5 - t) / 1.5 : 1;
        ctx.globalAlpha = 0.35 * fade;
        ctx.strokeStyle = 'rgba(180,212,255,1)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        c.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'lighter';
      for (const d of dust) {
        if (!still) {
          d.x += d.vx * dt + Math.sin(elapsed / d.period + d.phase) * 4 * dt;
          d.y += d.vy * dt;
          if (d.x < -5) d.x = w + 5; else if (d.x > w + 5) d.x = -5;
          if (d.y < -5) d.y = h + 5; else if (d.y > h + 5) d.y = -5;
        }
        const a = d.base * (0.6 + 0.4 * Math.sin((elapsed / d.period) * TAU + d.phase));
        drawSprite(ctx, glowSprite(d.color), d.x, d.y, d.r * 5, a);
      }

      for (const f of fireflies) {
        if (!still) {
          f.angle += f.turn * dt + Math.sin(elapsed * 0.7 + f.phase) * 0.6 * dt;
          f.x += Math.cos(f.angle) * f.speed * dt;
          f.y += Math.sin(f.angle) * f.speed * dt;
          if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
          if (f.y < h * 0.3) f.angle = Math.abs(f.angle);
          if (f.y > h + 10) f.y = h * 0.4;
        }
        const pulse = 0.5 + 0.5 * Math.sin((elapsed / f.period) * TAU + f.phase);
        drawSprite(ctx, glowSprite('rgba(255,206,110,0.95)'), f.x, f.y, f.r * 8, 0.35 + 0.65 * pulse);
      }

      if (!still && elapsed > nextShootingAt) {
        spawnShootingStar(w, h);
        if (Math.random() < 0.22) spawnShootingStar(w, h);
        nextShootingAt = elapsed + rand(2.5, 6);
      }
      ctx.globalCompositeOperation = 'source-over';
      shooting = shooting.filter(s => {
        s.age += dt;
        if (s.age > s.life) return false;
        const cos = Math.cos(s.angle), sin = Math.sin(s.angle);
        s.x += s.dir * cos * s.speed * dt;
        s.y += sin * s.speed * dt;
        const fade = Math.sin((s.age / s.life) * Math.PI);
        const tailX = s.x - s.dir * cos * s.length;
        const tailY = s.y - sin * s.length;
        const g = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        g.addColorStop(0, 'rgba(140,203,255,0)');
        g.addColorStop(0.7, `rgba(255,232,168,${0.55 * fade})`);
        g.addColorStop(1, `rgba(255,255,255,${0.95 * fade})`);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        drawSprite(ctx, glowSprite('rgba(255,240,200,1)'), s.x, s.y, 16, fade);
        ctx.globalCompositeOperation = 'source-over';
        return true;
      });
    }

    function drawGlints(ctx, list, w, h, palette, sizeRange, still) {
      for (const g of list) {
        let t = (elapsed - g.start) / g.life;
        if (t > 1) {
          Object.assign(g, newGlint(w, h, palette, sizeRange), { start: elapsed + rand(0.2, 2.5) });
          continue;
        }
        if (t < 0) continue;
        if (still) t = 0.5;
        const k = Math.sin(t * Math.PI);
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.spin * t);
        drawSprite(ctx, glintSprite(g.color), 0, 0, g.size * (0.4 + 0.6 * k), k * 0.95);
        ctx.restore();
      }
    }

    function drawDay(dt, still) {
      const { ctx, width: w, height: h } = back;
      const sx = w * sun.x, sy = h * sun.y;

      // Sun rays fanning down from the cathedral
      ctx.globalCompositeOperation = 'screen';
      for (const r of rays) {
        const a = r.angle + (still ? 0 : Math.sin(elapsed / r.period * TAU + r.phase) * r.sway);
        const len = Math.max(w, h) * r.length;
        const breathe = r.alpha * (0.7 + 0.3 * Math.sin(elapsed / r.period * TAU * 0.7 + r.phase));
        const ex = sx + Math.cos(a) * len, ey = sy + Math.sin(a) * len;
        const half = r.width * len;
        const nx = -Math.sin(a) * half, ny = Math.cos(a) * half;
        const g = ctx.createLinearGradient(sx, sy, ex, ey);
        g.addColorStop(0, `rgba(255,244,214,${breathe * 1.6})`);
        g.addColorStop(0.6, `rgba(255,236,190,${breathe * 0.6})`);
        g.addColorStop(1, 'rgba(255,236,190,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex + nx, ey + ny);
        ctx.lineTo(ex - nx, ey - ny);
        ctx.closePath();
        ctx.fill();
      }
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(w, h) * 0.45);
      halo.addColorStop(0, `rgba(255,246,214,${0.28 + (still ? 0 : 0.06 * Math.sin(elapsed / 4))})`);
      halo.addColorStop(1, 'rgba(255,246,214,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Drifting cloud wisps
      ctx.globalCompositeOperation = 'source-over';
      const puff = puffSprite();
      for (const c of clouds) {
        if (!still) {
          c.x += c.speed * dt;
          if (c.x - 160 * c.scale > w) c.x = -160 * c.scale;
        }
        for (const p of c.puffs) {
          drawSprite(ctx, puff, c.x + p.dx * c.scale, c.y + p.dy * c.scale, p.r * 2 * c.scale, c.alpha);
        }
      }

      // Soft light orbs
      ctx.globalCompositeOperation = 'screen';
      for (const o of orbs) {
        if (!still) {
          o.x += o.vx * dt;
          o.y += o.vy * dt;
          if (o.y < -30) { o.y = h + 30; o.x = rand(0, w); }
          if (o.x < -30) o.x = w + 30; else if (o.x > w + 30) o.x = -30;
        }
        const a = o.base * (0.6 + 0.4 * Math.sin((elapsed / o.period) * TAU + o.phase));
        drawSprite(ctx, bokehSprite('rgba(255,248,230,0.9)'), o.x, o.y, o.r * 2, a);
      }

      // Rising gold dust (normal blending so it reads against the bright sky)
      ctx.globalCompositeOperation = 'source-over';
      for (const m of motes) {
        if (!still) {
          m.x += (m.vx + Math.sin(elapsed / m.period * TAU + m.phase) * m.sway) * dt;
          m.y += m.vy * dt;
          if (m.y < -6) { m.y = h + 6; m.x = rand(0, w); }
          if (m.x < -6) m.x = w + 6; else if (m.x > w + 6) m.x = -6;
        }
        const a = 0.5 + 0.4 * Math.sin((elapsed / m.period) * TAU + m.phase);
        drawSprite(ctx, glowSprite(m.color), m.x, m.y, m.r * 5, a);
      }

      drawGlints(ctx, glints, w, h, ['rgba(245,180,60,1)', 'rgba(255,214,120,1)', 'rgba(255,255,255,1)'], [14, 30], still);
    }

    function drawForeground(dt, still) {
      if (!front || !front.measure()) return;
      const { ctx, width: w, height: h } = front;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = theme === 'dark' ? 'lighter' : 'source-over';
      for (const f of fgMotes) {
        if (!still) {
          f.angle += f.turn * dt + Math.sin(elapsed * 0.5 + f.phase) * 0.5 * dt;
          f.x += Math.cos(f.angle) * f.speed * dt;
          f.y += Math.sin(f.angle) * f.speed * dt - 3 * dt;
          if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
          if (f.y < -10) f.y = h + 10; else if (f.y > h + 10) f.y = -10;
        }
        const pulse = 0.5 + 0.5 * Math.sin((elapsed / f.period) * TAU + f.phase);
        drawSprite(ctx, glowSprite(f.color), f.x, f.y, f.r * 6, 0.3 + 0.6 * pulse);
      }
      if (theme === 'dark') ctx.globalCompositeOperation = 'lighter';
      const palette = theme === 'dark' ? ['rgba(255,240,200,1)', 'rgba(200,225,255,1)'] : ['rgba(245,180,60,1)', 'rgba(255,255,255,1)'];
      drawGlints(ctx, fgGlints, w, h, palette, [14, 30], still);
      drawBursts(ctx, dt);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    function drawBursts(ctx, dt) {
      bursts = bursts.filter(b => {
        b.age += dt;
        if (b.age > b.life) return false;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vy += 60 * dt;
        b.vx *= 1 - 1.5 * dt;
        const k = 1 - b.age / b.life;
        drawSprite(ctx, b.glint ? glintSprite(b.color) : glowSprite(b.color), b.x, b.y, b.size * (0.5 + 0.5 * k), k);
        return true;
      });
    }

    function frame(now) {
      if (!running) return;
      frameId = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - lastTime) / 1000); // clamp long gaps (tab switches)
      lastTime = now;
      if (!back.measure()) return; // view hidden (zero size): skip drawing
      const still = engine.prefersReducedMotion;
      if (!still) elapsed += dt;

      const { ctx, width: w, height: h } = back;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      if (theme === 'dark') drawNight(dt, still);
      else drawDay(dt, still);
      if (!front) {
        ctx.globalCompositeOperation = 'lighter';
        drawBursts(ctx, dt);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      drawForeground(dt, still);
    }

    back.measure();
    if (front) front.measure();
    build();
    buildForeground();
    frameId = requestAnimationFrame(frame);

    const systemInstance = {
      setTheme: (newTheme) => {
        theme = newTheme === 'light' ? 'light' : 'dark';
        build();
        buildForeground();
      },
      spawnBurst: (x, y, burstCount = 18, color = null) => {
        const target = front && front.width ? front : back;
        const colors = theme === 'dark'
          ? ['rgba(255,232,168,1)', 'rgba(232,199,120,1)', 'rgba(170,215,255,1)', 'rgba(255,255,255,1)']
          : ['rgba(245,190,90,1)', 'rgba(255,228,160,1)', 'rgba(255,255,255,1)', 'rgba(170,215,255,1)'];
        const isMobile = target.width < 700;
        const n = isMobile ? Math.round(burstCount * 0.6) : burstCount;
        for (let i = 0; i < n; i++) {
          const angle = rand(0, TAU);
          const speed = rand(60, 220);
          bursts.push({
            x: x !== undefined ? x : target.width / 2,
            y: y !== undefined ? y : target.height / 2,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 80,
            size: rand(8, 18), glint: Math.random() < 0.35,
            color: color || pick(colors), age: 0, life: rand(0.7, 1.3)
          });
        }
      },
      resize: () => {
        back.measure();
        if (front) front.measure();
      },
      pause: () => {
        running = false;
        if (frameId) cancelAnimationFrame(frameId);
      },
      resume: () => {
        if (!running) {
          running = true;
          lastTime = performance.now();
          frameId = requestAnimationFrame(frame);
        }
      },
      destroy: () => {
        running = false;
        if (frameId) cancelAnimationFrame(frameId);
        if (back.observer) back.observer.disconnect();
        if (front && front.observer) front.observer.disconnect();
        this.atmosphereSystems.delete(systemInstance);
      }
    };

    this.atmosphereSystems.add(systemInstance);
    return systemInstance;
  }
}
