/**
 * MotionGraphicsEngine
 * Delivers ultra-responsive 3D motion graphics and multi-layer particle atmosphere:
 * 1. Interactive 3D Card Tilt (mouse & touch parallax physics)
 * 2. Multi-layer Celestial Particle Atmosphere (Light & Dark Themes)
 *    - Layer 1: Distant atmosphere (drifting clouds & sunbeams in Light, nebula & moon glow in Dark)
 *    - Layer 2: Ambient particles (champagne gold dust in Light, 150+ independently twinkling stars in Dark)
 *    - Layer 3: Foreground sparkles & milestone celebration bursts
 *    - Layer 4: Graceful shooting stars with glowing motion trails (Dark)
 * 3. Reduced-motion accessibility, visibility-based pausing, and full lifecycle cleanup.
 */

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

      // Global visibility listener to pause loops when backgrounded
      document.addEventListener('visibilitychange', () => {
        const isHidden = document.hidden;
        for (const sys of this.atmosphereSystems) {
          if (isHidden) {
            sys.pause();
          } else {
            sys.resume();
          }
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
   * Generates a batch of heavenly golden particles for the canvas overlay
   */
  createParticleBatch(count = 25, width = 600, height = 400) {
    const particles = [];
    const colors = [
      'rgba(245, 158, 11, 0.7)',  // Warm Amber
      'rgba(251, 191, 36, 0.85)', // Radiant Gold
      'rgba(255, 255, 255, 0.9)',  // Pure Starlight
      'rgba(236, 72, 153, 0.65)'  // Pixar Pink Glow
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
   * Attaches live animated golden particle canvas over an image container
   */
  attachParticleCanvas(container) {
    if (!container || typeof window === 'undefined') return;

    const existing = container.querySelector('.motion-particle-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.className = 'motion-particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;
    canvas.width = width;
    canvas.height = height;

    const particles = this.createParticleBatch(30, width, height);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      this.tickParticles(particles, width, height);

      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const frameId = requestAnimationFrame(animate);
      this.animationFrames.set(container, frameId);
    };

    animate();
  }

  /**
   * Attaches high-fidelity multi-layer celestial atmospheric particle system
   * tuned for both Light (heavenly morning) and Dark (celestial night) modes.
   */
  attachAtmosphericSystem(canvas, initialTheme = 'dark') {
    if (!canvas || typeof window === 'undefined') return null;

    const ctx = canvas.getContext('2d');
    let theme = initialTheme;
    let isRunning = true;
    let animationId = null;

    let width = canvas.clientWidth || 800;
    let height = canvas.clientHeight || 500;
    canvas.width = width;
    canvas.height = height;

    // Layer 1: Drifting Clouds (Light mode) & Ambient Haze
    const clouds = [];
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.6),
        radius: Math.random() * 80 + 70,
        speed: (Math.random() * 0.15 + 0.05),
        alpha: Math.random() * 0.15 + 0.08
      });
    }

    // Layer 2: Independently Twinkling Stars (Dark mode)
    const stars = [];
    const starCount = Math.min(Math.floor((width * height) / 3500), 160);
    const starPalettes = [
      '#ffffff', '#f2f6ff', '#8ccbff', '#ffe8a8', '#e8c778'
    ];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        color: starPalettes[Math.floor(Math.random() * starPalettes.length)],
        baseAlpha: Math.random() * 0.4 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // Layer 2 (Light mode): Ambient Floating Gold Dust
    const lightDust = [];
    const dustCount = Math.min(Math.floor((width * height) / 8000), 45);
    const lightDustPalettes = [
      'rgba(245, 158, 11, 0.75)',
      'rgba(217, 182, 111, 0.85)',
      'rgba(255, 255, 255, 0.95)',
      'rgba(56, 189, 248, 0.65)'
    ];
    for (let i = 0; i < dustCount; i++) {
      lightDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        color: lightDustPalettes[Math.floor(Math.random() * lightDustPalettes.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Layer 3: Interactive Foregrounds & Bursts
    const bursts = [];

    // Layer 4: Shooting Stars (Dark mode)
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    const spawnShootingStar = () => {
      if (theme !== 'dark') return;
      shootingStars.push({
        x: Math.random() * (width * 0.7) + (width * 0.1),
        y: Math.random() * (height * 0.3),
        length: Math.random() * 80 + 60,
        speed: Math.random() * 7 + 9,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 degrees diagonal
        alpha: 1.0,
        decay: 0.02
      });
    };

    let sunbeamPhase = 0;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      const isReduced = this.prefersReducedMotion;

      if (theme === 'dark') {
        // --- DARK THEME ATMOSPHERE ---
        // 1. Twinkling Stars
        for (const s of stars) {
          if (!isReduced) {
            s.twinklePhase += s.twinkleSpeed;
          }
          const alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.35;
          ctx.save();
          ctx.globalAlpha = Math.max(0.1, Math.min(1.0, alpha));
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = s.radius > 1.4 ? 6 : 0;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 2. Shooting Stars
        const now = Date.now();
        if (!isReduced && now - lastShootingStarTime > 4500 && Math.random() < 0.4) {
          spawnShootingStar();
          lastShootingStarTime = now;
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const star = shootingStars[i];
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;
          star.alpha -= star.decay;

          if (star.alpha <= 0 || star.x > width || star.y > height) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = star.x - Math.cos(star.angle) * star.length;
          const tailY = star.y - Math.sin(star.angle) * star.length;

          const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          grad.addColorStop(0, 'rgba(140, 203, 255, 0)');
          grad.addColorStop(0.7, `rgba(232, 199, 120, ${star.alpha * 0.8})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${star.alpha})`);

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();

          // Star head spark
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.shadowColor = '#ffe8a8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // --- LIGHT THEME (HEAVENLY MORNING) ---
        // 1. Soft Sunbeams & Glow
        if (!isReduced) sunbeamPhase += 0.008;
        const beamIntensity = 0.12 + Math.sin(sunbeamPhase) * 0.05;
        const sunX = width * 0.45;
        const sunY = height * 0.35;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.7);
        sunGrad.addColorStop(0, `rgba(255, 246, 214, ${beamIntensity * 1.5})`);
        sunGrad.addColorStop(0.5, `rgba(217, 182, 111, ${beamIntensity * 0.6})`);
        sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // 2. Drifting Soft Clouds
        for (const c of clouds) {
          if (!isReduced) {
            c.x += c.speed;
            if (c.x - c.radius > width) c.x = -c.radius;
          }
          const cloudGrad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
          cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 1.2})`);
          cloudGrad.addColorStop(0.6, `rgba(255, 252, 244, ${c.alpha * 0.6})`);
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.save();
          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 3. Golden Dust Particles
        for (const p of lightDust) {
          if (!isReduced) {
            p.x += p.vx;
            p.y += p.vy;
            p.pulsePhase += p.pulseSpeed;
            if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
          }
          const alpha = 0.3 + Math.sin(p.pulsePhase) * 0.35;
          ctx.save();
          ctx.globalAlpha = Math.max(0.1, Math.min(1.0, alpha));
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Layer 3: Dynamic Bursts (e.g. node clicks, star earn)
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.08; // subtle gravity
        b.alpha -= b.decay;
        b.radius = Math.max(0.2, b.radius * 0.98);

        if (b.alpha <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const systemInstance = {
      setTheme: (newTheme) => {
        theme = newTheme;
      },
      spawnBurst: (x, y, count = 25, color = null) => {
        const burstColors = theme === 'dark' 
          ? ['#ffe8a8', '#e8c778', '#8ccbff', '#ffffff'] 
          : ['#f59e0b', '#d9b66f', '#38bdf8', '#ffffff'];

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 1.5;
          bursts.push({
            x: x !== undefined ? x : width / 2,
            y: y !== undefined ? y : height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            radius: Math.random() * 3 + 1.2,
            color: color || burstColors[Math.floor(Math.random() * burstColors.length)],
            alpha: 1.0,
            decay: Math.random() * 0.025 + 0.015
          });
        }
      },
      resize: (newW, newH) => {
        width = newW || canvas.clientWidth || 800;
        height = newH || canvas.clientHeight || 500;
        canvas.width = width;
        canvas.height = height;
      },
      pause: () => {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
      },
      resume: () => {
        if (!isRunning) {
          isRunning = true;
          render();
        }
      },
      destroy: () => {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
        this.atmosphereSystems.delete(systemInstance);
      }
    };

    this.atmosphereSystems.add(systemInstance);
    return systemInstance;
  }
}
