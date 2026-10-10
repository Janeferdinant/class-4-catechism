/**
 * VoiceoverManager Component
 * Resilient speech synthesis with character voice presets,
 * deadlock prevention for browser engines, and audio visualizer hooks.
 */

export class VoiceoverManager {
  constructor() {
    this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    this.speaking = false;
    this.rate = 0.95;
    this.pitch = 1.25;
    this.character = 'leo';
    this.voices = [];
    this.onStartSpeaking = null;
    this.onEndSpeaking = null;
    this.currentUtterance = null;
    this.geminiService = null;
    this.currentAudioElement = null;

    if (this.synth) {
      this.loadVoices();
      if ('onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  setGeminiService(geminiService) {
    this.geminiService = geminiService;
  }

  playStaticAudio(audioUrl, onComplete, onError) {
    this.stop();
    if (!audioUrl) {
      if (onComplete) onComplete();
      return;
    }

    if (typeof window !== 'undefined' && window.Audio) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudioElement = audio;
        this.speaking = true;
        if (this.onStartSpeaking) this.onStartSpeaking();

        audio.onended = () => {
          this.speaking = false;
          this.currentAudioElement = null;
          if (this.onEndSpeaking) this.onEndSpeaking();
          if (onComplete) onComplete();
        };

        audio.onerror = (err) => {
          console.warn('Static audio playback error:', err);
          this.speaking = false;
          this.currentAudioElement = null;
          if (this.onEndSpeaking) this.onEndSpeaking();
          if (onError) onError(err);
          else if (onComplete) onComplete();
        };

        audio.play().catch(e => {
          console.warn('Static audio play prevented:', e);
          this.speaking = false;
          this.currentAudioElement = null;
          if (this.onEndSpeaking) this.onEndSpeaking();
          if (onError) onError(e);
          else if (onComplete) onComplete();
        });
        return audio;
      } catch (e) {
        console.error('Audio initialization error:', e);
        if (onError) onError(e);
        else if (onComplete) onComplete();
      }
    } else {
      if (onComplete) onComplete();
    }
  }

  loadVoices() {

    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  isPlaying() {
    return this.speaking;
  }

  setRate(rate) {
    this.rate = Math.max(0.6, Math.min(1.8, rate));
  }

  setPitch(pitch) {
    this.pitch = Math.max(0.6, Math.min(1.8, pitch));
  }

  setCharacter(charName) {
    this.character = charName;
    if (charName === 'leo') {
      this.pitch = 1.25;
      this.rate = 0.95;
    } else if (charName === 'bella') {
      this.pitch = 1.15;
      this.rate = 0.90;
    } else if (charName === 'sammy') {
      this.pitch = 1.30;
      this.rate = 0.95;
    } else if (charName === 'teacher') {
      this.pitch = 1.0;
      this.rate = 1.0;
    }
  }

  isMalayalamText(text) {
    if (!text || typeof text !== 'string') return false;
    return /[\u0D00-\u0D7F]/.test(text);
  }

  getBestVoice(lang = 'auto') {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    if (lang === 'ml' || lang === 'ml-IN') {
      // 1. Look for native Malayalam voices (e.g. Google മലയാളം, Microsoft Valluvar, etc.)
      const mlVoice = this.voices.find(v => v.lang.startsWith('ml') || v.lang.toLowerCase().includes('malayalam'));
      if (mlVoice) return mlVoice;

      // 2. Look for Indian voices that render Indic phonemes cleanly
      const inVoice = this.voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('hi') || v.lang.includes('IN'));
      if (inVoice) return inVoice;
    }

    // Default: Prefer warm natural English voices
    const natural = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Samantha')));
    if (natural) return natural;
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  speakMalayalam(text, onComplete) {
    return this.speak(text, 'ml', onComplete);
  }

  speak(text, langOrCallback, onComplete) {
    this.stop();
    if (!text || typeof text !== 'string') return;

    let targetLang = 'auto';
    let callback = onComplete;

    if (typeof langOrCallback === 'function') {
      callback = langOrCallback;
    } else if (typeof langOrCallback === 'string') {
      targetLang = langOrCallback;
    }

    const isMal = targetLang === 'ml' || targetLang === 'ml-IN' || this.isMalayalamText(text);

    // Clean up text of markdown and excessive symbols for smooth kid speech
    const cleanText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. If Gemini AI Service is active with a key, stream natural neural Malayalam audio!
    if (this.geminiService && this.geminiService.hasKey() && isMal) {
      this.speaking = true;
      if (this.onStartSpeaking) this.onStartSpeaking();

      this.geminiService.synthesizeMalayalamVoice(cleanText)
        .then(audio => {
          this.currentAudioElement = audio;
          audio.onended = () => {
            this.speaking = false;
            this.currentAudioElement = null;
            if (this.onEndSpeaking) this.onEndSpeaking();
            if (callback) callback();
          };
          audio.onerror = () => {
            this.currentAudioElement = null;
            this.speakFallback(cleanText, isMal, callback);
          };
          return audio.play();
        })
        .catch(err => {
          console.warn('Gemini natural voice synthesis fallback:', err);
          this.speakFallback(cleanText, isMal, callback);
        });
      return;
    }

    this.speakFallback(cleanText, isMal, callback);
  }

  speakFallback(cleanText, isMal, callback) {
    if (!this.synth) {
      this.speaking = false;
      if (callback) callback();
      return;
    }

    try {
      const utterance = new window.SpeechSynthesisUtterance(cleanText);
      utterance.rate = isMal ? Math.min(this.rate, 0.88) : this.rate; // Clear, relaxed pacing for Malayalam
      utterance.pitch = isMal ? 1.05 : this.pitch;
      utterance.lang = isMal ? 'ml-IN' : 'en-US';

      const voice = this.getBestVoice(isMal ? 'ml' : 'en');
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        this.speaking = true;
        if (this.onStartSpeaking) this.onStartSpeaking();
      };

      utterance.onend = () => {
        this.speaking = false;
        this.currentUtterance = null;
        if (this.onEndSpeaking) this.onEndSpeaking();
        if (callback) callback();
      };

      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis utterance event:', err);
        this.speaking = false;
        this.currentUtterance = null;
        if (this.onEndSpeaking) this.onEndSpeaking();
        if (callback) callback();
      };

      this.currentUtterance = utterance;

      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis fallback error:', e);
      this.speaking = false;
      if (callback) callback();
    }
  }

  stop() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudioElement = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.speaking = false;
    this.currentUtterance = null;
    if (this.onEndSpeaking) this.onEndSpeaking();
  }
}

