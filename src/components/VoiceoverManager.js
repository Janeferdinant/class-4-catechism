/**
 * VoiceoverManager
 * Plays the pre-rendered narration clips (generated with OmniVoice by
 * scripts/audio/generate_omnivoice_audio.py and listed in src/data/narrationManifest.js).
 *
 * - One audio element at a time: starting anything stops what was playing.
 * - Plays a single clip or a sequence (e.g. a chapter's story, then its moral).
 * - Narration language can switch while playing: the same item restarts in the
 *   other language.
 * - Speech pace is the element's playback rate with pitch preserved, applied live.
 * - There is no robotic fallback: if a clip is missing, nothing plays and
 *   onUnavailable reports it.
 */

import { NARRATION_MANIFEST } from '../data/narrationManifest.js';

export const MIN_RATE = 0.5;
export const MAX_RATE = 1.5;

export class VoiceoverManager {
  constructor({ manifest = NARRATION_MANIFEST } = {}) {
    this.manifest = manifest || {};
    this.speaking = false;
    this.rate = 1;
    this.pitch = 1; // kept for API compatibility; recorded voices keep their own pitch
    this.language = 'mal';
    this.currentAudioElement = null;
    this.queue = [];      // clip ids being played in order
    this.queueIndex = 0;
    this.queueLang = null;

    // Hooks set by the app
    this.onStartSpeaking = null;
    this.onEndSpeaking = null;
    this.onProgress = null;      // (currentTime, duration)
    this.onUnavailable = null;   // (clipId, lang)
  }

  /* ---------------- Settings ---------------- */

  setRate(rate) {
    const value = Number(rate);
    this.rate = Math.max(MIN_RATE, Math.min(MAX_RATE, Number.isFinite(value) ? value : 1));
    if (this.currentAudioElement) this.currentAudioElement.playbackRate = this.rate;
    return this.rate;
  }

  setPitch(pitch) {
    this.pitch = Math.max(0.6, Math.min(1.8, Number(pitch) || 1));
  }

  setCharacter() {
    // Character voices belonged to the old browser speech engine; narration is
    // now one recorded voice per language.
  }

  /**
   * Change the narration language. If something is playing, the same item
   * continues in the new language (from its start), when that version exists.
   */
  setLanguage(lang) {
    const next = lang === 'eng' ? 'eng' : 'mal';
    const changed = next !== this.language;
    this.language = next;
    if (changed && this.speaking && this.queue.length) {
      const remaining = this.queue.slice(this.queueIndex);
      if (remaining.some(id => this.hasClip(id, next))) {
        this.playSequence(remaining, next);
      }
    }
    return this.language;
  }

  /* ---------------- Lookup ---------------- */

  getClip(id, lang = this.language) {
    return (this.manifest[id] && this.manifest[id][lang]) || null;
  }

  hasClip(id, lang = this.language) {
    return Boolean(this.getClip(id, lang));
  }

  isPlaying() {
    return this.speaking;
  }

  isMalayalamText(text) {
    return typeof text === 'string' && /[ഀ-ൿ]/.test(text);
  }

  /* ---------------- Playback ---------------- */

  /** Play one clip. Returns false if that clip/language has not been rendered. */
  playClip(id, lang = this.language) {
    return this.playSequence([id], lang);
  }

  /** Play clips in order, skipping any that are missing. Returns false if none exist. */
  playSequence(ids, lang = this.language) {
    const list = (Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    const playable = list.filter(id => this.hasClip(id, lang));
    this.stop({ silent: true });
    if (!playable.length) {
      if (this.onUnavailable) this.onUnavailable(list[0], lang);
      if (this.onEndSpeaking) this.onEndSpeaking();
      return false;
    }
    this.queue = playable;
    this.queueIndex = 0;
    this.queueLang = lang;
    this.playQueueItem();
    return true;
  }

  playQueueItem() {
    const id = this.queue[this.queueIndex];
    const clip = this.getClip(id, this.queueLang);
    if (!clip) {
      this.finish();
      return;
    }
    const audio = this.createAudio(clip.src);
    if (!audio) {
      this.finish();
      return;
    }
    audio.onended = () => {
      if (this.currentAudioElement !== audio) return;
      this.queueIndex += 1;
      if (this.queueIndex < this.queue.length) this.playQueueItem();
      else this.finish();
    };
    audio.onerror = () => {
      if (this.currentAudioElement !== audio) return;
      console.warn(`Narration clip failed to load: ${clip.src}`);
      this.finish();
    };
    this.startAudio(audio);
  }

  /** Play an audio file by URL (used for any non-narration sound). */
  playStaticAudio(audioUrl, onComplete, onError) {
    this.stop({ silent: true });
    if (!audioUrl) {
      if (onComplete) onComplete();
      return null;
    }
    const audio = this.createAudio(audioUrl);
    if (!audio) {
      if (onComplete) onComplete();
      return null;
    }
    this.queue = [];
    audio.onended = () => {
      if (this.currentAudioElement !== audio) return;
      this.finish();
      if (onComplete) onComplete();
    };
    audio.onerror = (err) => {
      if (this.currentAudioElement !== audio) return;
      this.finish();
      if (onError) onError(err);
      else if (onComplete) onComplete();
    };
    this.startAudio(audio);
    return audio;
  }

  /**
   * Compatibility: speak(id) plays the clip with that id. Free text is no longer
   * synthesised in the browser, so unknown text plays nothing.
   */
  speak(clipIdOrText, langOrCallback) {
    const lang = typeof langOrCallback === 'string'
      ? (langOrCallback.startsWith('ml') || langOrCallback === 'mal' ? 'mal' : 'eng')
      : this.language;
    if (this.manifest[clipIdOrText]) return this.playClip(clipIdOrText, lang);
    if (this.onUnavailable) this.onUnavailable(null, lang);
    return false;
  }

  speakMalayalam(clipIdOrText) {
    return this.speak(clipIdOrText, 'mal');
  }

  createAudio(src) {
    if (typeof window === 'undefined' || !window.Audio) return null;
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.playbackRate = this.rate;
    // Keep the voice natural when the pace changes
    audio.preservesPitch = true;
    audio.mozPreservesPitch = true;
    audio.webkitPreservesPitch = true;
    audio.ontimeupdate = () => {
      if (this.onProgress && this.currentAudioElement === audio) {
        this.onProgress(audio.currentTime, audio.duration);
      }
    };
    return audio;
  }

  startAudio(audio) {
    this.currentAudioElement = audio;
    this.speaking = true;
    if (this.onStartSpeaking) this.onStartSpeaking();
    const started = audio.play();
    if (started && started.catch) {
      started.catch(err => {
        if (this.currentAudioElement !== audio) return;
        console.warn('Narration playback was blocked:', err && err.message);
        this.finish();
      });
    }
  }

  finish() {
    this.speaking = false;
    this.currentAudioElement = null;
    this.queue = [];
    this.queueIndex = 0;
    if (this.onEndSpeaking) this.onEndSpeaking();
  }

  stop({ silent = false } = {}) {
    const audio = this.currentAudioElement;
    this.currentAudioElement = null;
    if (audio) {
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch (e) {
        // ignore
      }
    }
    this.speaking = false;
    this.queue = [];
    this.queueIndex = 0;
    if (!silent && this.onEndSpeaking) this.onEndSpeaking();
  }
}
