import test from 'node:test';
import assert from 'node:assert/strict';

test('Drawer content builder for all 3D node categories', async () => {
  const { buildNodeDrawerContent } = await import('../src/components/ThreeUniverse.js');
  const { GRAPH_DATA } = await import('../src/data/knowledgeGraphData.js');

  // 1. Chapter node
  const chNode = GRAPH_DATA.nodes.find(n => n.category === 'chapter');
  const chDrawer = buildNodeDrawerContent(chNode);
  assert.ok(chDrawer, 'Chapter drawer content must be generated');
  assert.equal(chDrawer.targetView, 'classroom');
  assert.ok(chDrawer.title);
  assert.ok(chDrawer.story);
  assert.ok(chDrawer.audioText);

  // 2. Sacrament node
  const sacNode = GRAPH_DATA.nodes.find(n => n.category === 'sacrament');
  const sacDrawer = buildNodeDrawerContent(sacNode);
  assert.ok(sacDrawer);
  assert.equal(sacDrawer.category, 'sacrament');

  // 3. Exam node
  const examNode = GRAPH_DATA.nodes.find(n => n.category === 'exam');
  const examDrawer = buildNodeDrawerContent(examNode);
  assert.ok(examDrawer);
  assert.equal(examDrawer.targetView, 'solver');
  assert.ok(examDrawer.targetPaperId);

  // 4. Agent node
  const agentNode = GRAPH_DATA.nodes.find(n => n.category === 'agent');
  const agentDrawer = buildNodeDrawerContent(agentNode);
  assert.ok(agentDrawer);
  assert.equal(agentDrawer.category, 'agent');
});
