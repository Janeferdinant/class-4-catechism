import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Presentation Layer Architecture: LayoutSelector exists and provides viewport-based selection', async () => {
  const selectorPath = path.resolve(process.cwd(), 'src/presentation/LayoutSelector.js');
  assert.ok(fs.existsSync(selectorPath), 'src/presentation/LayoutSelector.js must exist');

  const { LayoutSelector } = await import('../src/presentation/LayoutSelector.js');
  assert.ok(typeof LayoutSelector === 'function', 'LayoutSelector must be a class/constructor');

  // Test viewport detection logic
  const selector = new LayoutSelector({
    onLayoutChange: () => {},
  });

  assert.equal(typeof selector.determineLayout, 'function', 'determineLayout must be a function');
  assert.equal(selector.determineLayout(500), 'mobile', '500px viewport must select mobile');
  assert.equal(selector.determineLayout(1200), 'desktop', '1200px viewport must select desktop');
  assert.equal(selector.determineLayout(768), 'mobile', '768px tablet portrait must select mobile');
  assert.equal(selector.determineLayout(769), 'desktop', '769px must select desktop');
});

test('Presentation Layer Architecture: index.html defines distinct layout root boundaries', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('id="desktop-layout-root"'), 'index.html must define #desktop-layout-root');
  assert.ok(html.includes('id="mobile-layout-root"'), 'index.html must define #mobile-layout-root');
});

test('Presentation Layer Architecture: applyLayout, previewMobile, and exitPreview toggle DOM styles accurately', async () => {
  const { LayoutSelector } = await import('../src/presentation/LayoutSelector.js');

  // Set up mock DOM elements
  const desktopRoot = { style: { display: '' } };
  const mobileRoot = {
    style: { display: '', maxWidth: '' },
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    }
  };
  const previewContainer = { style: { display: '' } };
  const body = {
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    }
  };

  global.document = {
    body,
    getElementById(id) {
      if (id === 'desktop-layout-root') return desktopRoot;
      if (id === 'mobile-layout-root') return mobileRoot;
      if (id === 'mobile-preview-frame-container') return previewContainer;
      return null;
    },
    querySelectorAll() { return []; }
  };

  const selector = new LayoutSelector();

  // Test applyLayout('desktop')
  selector.applyLayout('desktop');
  assert.equal(desktopRoot.style.display, 'block');
  assert.equal(mobileRoot.style.display, 'none');
  assert.ok(body.classList.contains('desktop-layout-active'));
  assert.ok(!body.classList.contains('mobile-layout-active'));

  // Test applyLayout('mobile')
  selector.applyLayout('mobile');
  assert.equal(desktopRoot.style.display, 'none');
  assert.equal(mobileRoot.style.display, 'block');
  assert.ok(body.classList.contains('mobile-layout-active'));
  assert.ok(!body.classList.contains('desktop-layout-active'));

  // Test previewMobile(375)
  selector.previewMobile(375);
  assert.equal(desktopRoot.style.display, 'none');
  assert.equal(mobileRoot.style.display, 'block');
  assert.equal(mobileRoot.style.maxWidth, '375px');
  assert.ok(mobileRoot.classList.contains('in-preview-frame'));
  assert.equal(previewContainer.style.display, 'flex');
  assert.ok(body.classList.contains('mobile-preview-active'));

  // Test exitPreview()
  selector.exitPreview();
  assert.equal(mobileRoot.style.maxWidth, '');
  assert.ok(!mobileRoot.classList.contains('in-preview-frame'));
  assert.equal(previewContainer.style.display, 'none');
  assert.ok(!body.classList.contains('mobile-preview-active'));

  // Cleanup
  delete global.document;
});
