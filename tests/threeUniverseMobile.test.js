import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('ThreeUniverse: has resize and attachToContainer methods with pointer event support', async () => {
  const threeUniverseCode = fs.readFileSync(path.resolve('src/components/ThreeUniverse.js'), 'utf8');

  // Verify pointer events are used for touch & drag interaction
  assert.ok(
    threeUniverseCode.includes('pointerdown') && threeUniverseCode.includes('pointermove'),
    'ThreeUniverse must bind pointerdown and pointermove for touch drag support'
  );

  // Verify resize method exists
  assert.ok(
    threeUniverseCode.includes('resize('),
    'ThreeUniverse must provide a resize(width, height) method'
  );

  // Verify attachToContainer method exists
  assert.ok(
    threeUniverseCode.includes('attachToContainer('),
    'ThreeUniverse must provide attachToContainer(newContainer) method for switching between desktop and mobile'
  );
});

test('Mobile 3D Node Drawer: index.html and app.js support mobile details drawer', async () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(
    indexHtml.includes('id="mob-three-node-drawer"'),
    'index.html must include #mob-three-node-drawer inside mobile 3D view container'
  );

  const appCode = fs.readFileSync(path.resolve('src/app.js'), 'utf8');
  assert.ok(
    appCode.includes('mob-three-node-drawer'),
    'src/app.js must populate and control #mob-three-node-drawer when node is selected'
  );
});
