import test from 'node:test';
import assert from 'node:assert/strict';

test('ThreeUniverse & Motion Canvas component logic', async () => {
  const { calculate3DNodePositions } = await import('../src/components/ThreeUniverse.js');
  const { GRAPH_DATA } = await import('../src/data/knowledgeGraphData.js');

  assert.equal(typeof calculate3DNodePositions, 'function', 'calculate3DNodePositions must be exported');
  const positionedNodes = calculate3DNodePositions(GRAPH_DATA.nodes);
  assert.equal(positionedNodes.length, GRAPH_DATA.nodes.length);

  positionedNodes.forEach(node => {
    assert.ok(typeof node.x === 'number');
    assert.ok(typeof node.y === 'number');
    assert.ok(typeof node.z === 'number');
  });

  const { createWaveformBuffer } = await import('../src/components/MotionCanvas.js');
  assert.equal(typeof createWaveformBuffer, 'function');
  const wave = createWaveformBuffer(32);
  assert.equal(wave.length, 32);
});
