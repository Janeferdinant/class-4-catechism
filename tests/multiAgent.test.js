import test from 'node:test';
import assert from 'node:assert/strict';

test('Multi-Agent: Orchestrator dispatch and specialist execution', async () => {
  const { MultiAgentOrchestrator } = await import('../src/agents/orchestrator.js');
  const orchestrator = new MultiAgentOrchestrator();

  assert.ok(orchestrator, 'Orchestrator instance must be created');
  assert.equal(typeof orchestrator.processPrompt, 'function', 'Orchestrator must have processPrompt');
  assert.equal(typeof orchestrator.getTraceLogs, 'function', 'Orchestrator must have getTraceLogs');

  // Test 1: Storyteller dispatch
  const storyResult = await orchestrator.processPrompt({
    intent: 'story',
    chapterNumber: 1,
    query: 'Tell me about Jesus the vine'
  });
  assert.equal(storyResult.agentId, 'agent_storyteller');
  assert.ok(storyResult.content.includes('Grapevine') || storyResult.content.includes('മുന്തിരിച്ചെടി'));
  assert.ok(storyResult.reasoningSteps.length > 0);

  // Test 2: Exam solver dispatch
  const solveResult = await orchestrator.processPrompt({
    intent: 'solve',
    paperId: '2025_s1',
    query: 'What do believers receive?'
  });
  assert.equal(solveResult.agentId, 'agent_solver');
  assert.ok(solveResult.solutions.length > 0);
  assert.ok(solveResult.solutions[0].citation);

  // Test 3: Traces logged
  const traces = orchestrator.getTraceLogs();
  assert.ok(traces.length >= 2, 'Must have at least 2 trace logs');
});
