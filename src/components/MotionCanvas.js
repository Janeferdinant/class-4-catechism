/**
 * MotionCanvas Component
 * Provides 2D HUD overlays, audio waveform visualizer for speech synthesis,
 * and particle motion graphics.
 */

export function createWaveformBuffer(size = 32) {
  const buffer = [];
  for (let i = 0; i < size; i++) {
    buffer.push(Math.sin((i / size) * Math.PI) * 0.8 + Math.random() * 0.2);
  }
  return buffer;
}

export class MotionCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.isActive = false;
    this.animId = null;
    this.audioLevel = 0;
    this.phase = 0;
  }

  setAudioActive(active) {
    this.isActive = active;
  }

  start() {
    if (!this.canvas || !this.ctx) return;
    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    render();
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.ctx.clearRect(0, 0, width, height);

    this.phase += 0.05;

    // Draw soundwave when voiceover is active
    if (this.isActive) {
      const bars = 24;
      const barWidth = width / bars;
      this.ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < bars; i++) {
        const h = Math.abs(Math.sin(this.phase + i * 0.3)) * (height * 0.7) + 4;
        const x = i * barWidth + barWidth * 0.15;
        const y = (height - h) / 2;
        this.ctx.fillRect(x, y, barWidth * 0.7, h);
      }
    }
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
