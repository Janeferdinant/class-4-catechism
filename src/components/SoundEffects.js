/**
 * SoundEffects Component
 * Web Audio API synthesizer for child-friendly auditory feedback.
 * Provides cheerful chimes, soft pops, star sparkles, and celebration sounds.
 */

export class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context fallback
    }
  }

  playPop() {
    // Soft wooden pop
    this.playTone(480, 'sine', 0.08, 0.12);
  }

  playChime() {
    // Cheerful two-tone chime: G5 -> C6
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    this.playTone(784, 'sine', 0.25, 0.15);
    setTimeout(() => {
      this.playTone(1046, 'triangle', 0.35, 0.15);
    }, 120);
  }

  playSparkle() {
    // Magical 4-note ascending sparkle: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.3, 0.12);
      }, idx * 80);
    });
  }

  playCheer() {
    // Celebration harmonic chord: C5 + E5 + G5
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
      this.playTone(freq, 'triangle', 0.6, 0.1);
    });
  }
}
