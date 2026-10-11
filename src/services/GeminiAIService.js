/**
 * GeminiAIService
 * Optional client-side integration with Google AI Studio for:
 * 1. On-demand 4K 3D Pixar/DreamWorks storybook image generation via Imagen 3
 * 2. Client-side API key management via localStorage
 * (Narration is pre-rendered with OmniVoice and does not use this service.)
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
