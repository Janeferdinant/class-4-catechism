import test from 'node:test';
import assert from 'node:assert/strict';

test('GeminiAIService key management and prompt construction', async () => {
  const { GeminiAIService } = await import('../src/services/GeminiAIService.js');
  const service = new GeminiAIService();

  // Initial state without key
  assert.equal(service.hasKey(), false);

  // Set API key
  service.setApiKey('AIzaSyTestKey123456');
  assert.equal(service.hasKey(), true);
  assert.equal(service.getApiKey(), 'AIzaSyTestKey123456');

  // Clear key
  service.clearApiKey();
  assert.equal(service.hasKey(), false);

  // Build TTS payload for Malayalam voice
  const ttsPayload = service.buildTTSPayload('ഈശോ നമ്മെ സ്നേഹിക്കുന്നു');
  assert.ok(ttsPayload.input.text.includes('ഈശോ'));
  assert.equal(ttsPayload.voice.languageCode, 'ml-IN');
  assert.equal(ttsPayload.audioConfig.audioEncoding, 'MP3');

  // Build 4K 3D Pixar art prompt for Chapter 1
  const chapterMock = {
    number: 1,
    titleMal: 'ഈശോയുടെ തിരുഹൃദയം',
    titleEng: 'Sacred Heart of Jesus',
    story5yo: 'Jesus loves you with all His heart'
  };
  const artPrompt = service.buildImagen3Prompt(chapterMock);
  assert.ok(artPrompt.includes('3D Pixar'));
  assert.ok(artPrompt.includes('Sacred Heart of Jesus'));
  assert.ok(artPrompt.includes('4K'));

  // Test VoiceoverManager integration
  const { VoiceoverManager } = await import('../src/components/VoiceoverManager.js');
  const vm = new VoiceoverManager();
  assert.equal(typeof vm.setGeminiService, 'function');
  vm.setGeminiService(service);
  assert.equal(vm.geminiService, service);
});

