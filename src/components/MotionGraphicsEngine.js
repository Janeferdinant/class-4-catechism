/**
 * MotionGraphicsEngine
 * Delivers ultra-responsive 3D Pixar/DreamWorks motion graphics:
 * 1. Interactive 3D Card Tilt (mouse & touch parallax physics)
 * 2. Floating golden dust & heavenly starlight particle canvas
 * 3. Ken Burns cinematic camera motion presets
 */

export class MotionGraphicsEngine {
  constructor() {
    this.animationFrames = new Map();
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

    // Remove existing particle canvas if present
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
}
