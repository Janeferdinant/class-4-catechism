/**
 * GeminiAIService
 * Client-side integration with Google AI Studio Gemini API for:
 * 1. Studio-grade natural neural Malayalam TTS audio synthesis
 * 2. On-demand 4K 3D Pixar/DreamWorks storybook image generation via Imagen 3
 * 3. Secure client-side API key management via localStorage
 */

export class GeminiAIService {
  constructor() {
    this.storageKey = 'gemini_api_key';
    this.apiKey = this.loadStoredKey();
  }

  loadStoredKey() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(this.storageKey) || '';
    }
    return '';
  }

  hasKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getApiKey() {
    return this.apiKey || '';
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (typeof window !== 'undefined' && window.localStorage) {
      if (this.apiKey) {
        window.localStorage.setItem(this.storageKey, this.apiKey);
      } else {
        window.localStorage.removeItem(this.storageKey);
      }
    }
    return this.apiKey;
  }

  clearApiKey() {
    this.apiKey = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Constructs the payload for Google Cloud / AI Studio TTS synthesis
   * with natural human storytelling parameters (gentle speaking rate, warm pitch)
   */
  buildTTSPayload(text) {
    return {
      input: { text: text || '' },
      voice: {
        languageCode: 'ml-IN',
        name: 'ml-IN-Wavenet-A',
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 1.05,
        speakingRate: 0.95,
        volumeGainDb: 1.0
      }
    };
  }

  /**
   * Generates natural Malayalam speech audio using Google Cloud / Gemini AI Studio TTS API
   * Returns a playable HTML5 Audio object or throws error on failure.
   */
  async synthesizeMalayalamVoice(text) {
    if (!this.hasKey()) {
      throw new Error('Google AI Studio Gemini API Key is not configured.');
    }

    const payload = this.buildTTSPayload(text);
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `TTS API error (${response.status})`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error('No audio content returned by TTS endpoint.');
    }

    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
    return new Audio(audioUrl);
  }

  /**
   * Builds an ultra-high-definition 4K 3D Pixar / DreamWorks art generation prompt
   */
  buildImagen3Prompt(chapter) {
    const titleEng = chapter.titleEng || `Chapter ${chapter.number}`;
    const storyBrief = chapter.story5yo || '';

    return `Ultra 4K masterpiece in whimsical 3D Pixar DreamWorks animation style, heartwarming children's Bible catechism scene illustrating "${titleEng}". Context: ${storyBrief}. Beautiful expressive stylized characters, soft volumetric golden heavenly lighting, magical particles and glowing sparkles in atmosphere, vibrant cheerful colors, octane render 3D diorama, intricate textures, family friendly, masterpiece digital art.`;
  }

  /**
   * Generates 4K 3D Pixar style artwork for a chapter via Google AI Studio Imagen 3
   */
  async generate3DPixarArt(chapter) {
    if (!this.hasKey()) {
      throw new Error('Google AI Studio Gemini API Key is not configured.');
    }

    const promptText = this.buildImagen3Prompt(chapter);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: promptText }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '1:1',
          outputMimeType: 'image/jpeg'
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Imagen 3 API error (${response.status})`);
    }

    const data = await response.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) {
      throw new Error('No image returned by Imagen 3 API.');
    }

    return `data:image/jpeg;base64,${b64}`;
  }
}
