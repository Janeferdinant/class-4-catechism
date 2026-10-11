import test from 'node:test';
import assert from 'node:assert/strict';

const VIEW_HEIGHT = 100; // world units spanning the canvas height (matches ThreeUniverse)

async function makeMap(width = 1100, height = 700) {
  const { ThreeUniverse } = await import('../src/components/ThreeUniverse.js');
  const container = { clientWidth: width, clientHeight: height, closest: () => null };
  const map = new ThreeUniverse(container, () => {});
  map.aspect = width / height;
  return map;
}

function island(overrides = {}) {
  return {
    userData: {
      id: 'ch_3', chNum: 3, baseX: 12, baseY: -8, size: 20,
      bounds: { left: 0.1, top: 0.1, right: 0.9, bottom: 0.9 },
      ...overrides
    }
  };
}

/** Where a world point lands on screen for the camera's target pan and zoom. */
function screenOf(map, x, y) {
  const { width, height } = map.containerSize();
  const ppu = height / VIEW_HEIGHT;
  const { x: px, y: py, zoom } = map.panTarget;
  return { sx: width / 2 + (x - px) * zoom * ppu, sy: height / 2 + (py - y) * zoom * ppu };
}

test('Island zoom: clicking an island centres it and zooms in', async () => {
  const map = await makeMap();
  const target = island();
  map.islandMeshes.push(target);
  map.focusOn(target);

  assert.ok(map.panTarget.zoom > 1.4, `zooms in (got ${map.panTarget.zoom})`);
  assert.ok(map.panTarget.zoom <= 2.8, 'zoom is capped');

  // The painted island's centre (its position, since the test bounds are symmetric)
  // lands mid-width, a little below mid-height
  const { sx, sy } = screenOf(map, 12, -8);
  assert.ok(Math.abs(sx - 1100 * 0.5) < 1, `centred horizontally (x=${sx.toFixed(1)})`);
  assert.ok(Math.abs(sy - 700 * 0.56) < 1, `sits slightly below centre (y=${sy.toFixed(1)})`);
});

test('Island zoom: the island fills a little under half the view height', async () => {
  const map = await makeMap();
  const target = island({ size: 30 });
  map.islandMeshes.push(target);
  map.focusOn(target);
  const artHeightPx = 0.8 * 30 * map.panTarget.zoom * (700 / VIEW_HEIGHT);
  assert.ok(artHeightPx > 700 * 0.4 && artHeightPx < 700 * 0.5, `island height ${artHeightPx.toFixed(0)}px`);
});

test('Island zoom: closing the details returns to the full map', async () => {
  const map = await makeMap();
  const target = island();
  map.islandMeshes.push(target);
  map.selectedId = 'ch_3';
  map.focusOn(target);
  map.resetView();
  assert.deepEqual(map.panTarget, { x: 0, y: 0, zoom: 1 });
  assert.equal(map.selectedId, null);
  assert.equal(map.panSlackY, 10, 'pan limits go back to normal');
});

test('Island zoom: pan limits match the old ones at rest and grow with zoom', async () => {
  const map = await makeMap();
  const oldLimit = VIEW_HEIGHT * map.aspect * 0.12;
  assert.ok(Math.abs(map.clampPanX(1e6, 1) - oldLimit) < 1e-9);
  assert.ok(map.clampPanX(1e6, 2.5) > oldLimit);
  assert.equal(map.clampPanY(1e6, 1), 10);
});

test('Island zoom: the sky layer zooms with the camera and never shows its edges', async () => {
  const map = await makeMap();
  const style = {};
  map.backdropEl = { style };
  map.backdropFrame = { originX: 550, originY: 350, width: 1400, height: 760 };

  map.pan = { x: 0, y: 0, zoom: 1 };
  map.syncBackdrop();
  assert.equal(style.transform, undefined, 'untouched at rest');

  map.pan = { x: 10, y: -5, zoom: 2 };
  map.syncBackdrop();
  const m = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px, 0\) scale\(([\d.]+)\)/.exec(style.transform);
  assert.ok(m, `transform set: ${style.transform}`);
  const [tx, ty, scale] = m.slice(1).map(Number);
  assert.equal(scale, 2);
  // Covering the layer: origin - scale*origin + t <= 0 and the far edge stays past the layer's size
  const f = map.backdropFrame;
  assert.ok(f.originX - scale * f.originX + tx <= 0.1);
  assert.ok(f.originX + scale * (f.width - f.originX) + tx >= f.width - 0.1);
  assert.ok(f.originY - scale * f.originY + ty <= 0.1);
  assert.ok(f.originY + scale * (f.height - f.originY) + ty >= f.height - 0.1);
});

test('Island zoom: tapping empty sky while an island is open zooms back out', async () => {
  const map = await makeMap();
  let closed = 0;
  map.onDeselect = () => { closed += 1; };

  map.handleTap(null);
  assert.equal(closed, 0, 'nothing to close when no island is open');

  map.selectedId = 'ch_3';
  map.handleTap(null);
  assert.equal(closed, 1, 'empty sky closes the open island');
});

test('Island zoom: without a details panel, empty sky resets the view itself', async () => {
  const map = await makeMap();
  map.selectedId = 'ch_3';
  map.panTarget = { x: 20, y: -10, zoom: 2.4 };
  map.handleTap(null);
  assert.deepEqual(map.panTarget, { x: 0, y: 0, zoom: 1 });
  assert.equal(map.selectedId, null);
});

test('Island zoom: tapping another island switches to it', async () => {
  const map = await makeMap();
  const picked = [];
  map.selectNode = (node) => picked.push(node.id);
  map.selectedId = 'ch_3';
  map.handleTap({ id: 'ch_7' });
  assert.deepEqual(picked, ['ch_7']);
});
