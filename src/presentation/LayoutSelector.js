/**
 * LayoutSelector
 * Viewport-aware Presentation Layer Manager
 * Automatically switches between DesktopLayout and MobileLayout,
 * while allowing desktop users to preview the real mobile interface inside a preview viewport.
 */
export class LayoutSelector {
  constructor(options = {}) {
    this.mobileBreakpoint = options.mobileBreakpoint || 768;
    this.onLayoutChange = options.onLayoutChange || (() => {});
    this.currentMode = 'auto'; // 'auto' | 'desktop' | 'mobile' | 'preview'
    this.activeLayout = 'desktop';
    this.previewWidth = 390;
    this._boundResizeHandler = this.handleResize.bind(this);
  }

  determineLayout(viewportWidth) {
    const width = viewportWidth !== undefined ? viewportWidth : (typeof window !== 'undefined' ? window.innerWidth : 1200);
    return width <= this.mobileBreakpoint ? 'mobile' : 'desktop';
  }

  init() {
    if (typeof window === 'undefined') return;
    this.updateLayout();
    this.setupPreviewControls();
    window.addEventListener('resize', this._boundResizeHandler);
    window.addEventListener('orientationchange', this._boundResizeHandler);
  }

  setupPreviewControls() {
    if (typeof document === 'undefined') return;
    const exitBtn = document.getElementById('btn-exit-mobile-preview');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => this.exitPreview());
    }

    const presetBtns = document.querySelectorAll('.preview-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const width = parseInt(btn.getAttribute('data-width'), 10) || 390;
        presetBtns.forEach(b => b.classList.toggle('active', b === btn));
        this.setPreviewWidth(width);
      });
    });
  }

  setPreviewWidth(width) {
    this.previewWidth = width;
    if (typeof document === 'undefined') return;
    const mobileRoot = document.getElementById('mobile-layout-root');
    if (mobileRoot && this.currentMode === 'preview') {
      mobileRoot.style.maxWidth = `${width}px`;
    }
  }

  destroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this._boundResizeHandler);
    window.removeEventListener('orientationchange', this._boundResizeHandler);
  }

  handleResize() {
    if (this.currentMode === 'preview') return;
    this.updateLayout();
  }

  updateLayout() {
    const determined = this.determineLayout();
    this.applyLayout(determined);
  }

  applyLayout(layoutName) {
    this.activeLayout = layoutName;
    if (typeof document === 'undefined') return;

    const desktopRoot = document.getElementById('desktop-layout-root');
    const mobileRoot = document.getElementById('mobile-layout-root');

    if (layoutName === 'desktop') {
      if (desktopRoot) desktopRoot.style.display = 'block';
      if (mobileRoot) mobileRoot.style.display = 'none';
      document.body.classList.remove('mobile-layout-active');
      document.body.classList.add('desktop-layout-active');
    } else {
      if (desktopRoot) desktopRoot.style.display = 'none';
      if (mobileRoot) mobileRoot.style.display = 'block';
      document.body.classList.remove('desktop-layout-active');
      document.body.classList.add('mobile-layout-active');
    }

    this.onLayoutChange(layoutName);
  }

  previewMobile(width = 390) {
    this.currentMode = 'preview';
    this.previewWidth = width;
    this.activeLayout = 'preview';

    if (typeof document === 'undefined') return;
    const desktopRoot = document.getElementById('desktop-layout-root');
    const mobileRoot = document.getElementById('mobile-layout-root');
    const previewContainer = document.getElementById('mobile-preview-frame-container');

    if (desktopRoot) desktopRoot.style.display = 'none';
    if (mobileRoot) {
      mobileRoot.style.display = 'block';
      mobileRoot.classList.add('in-preview-frame');
      mobileRoot.style.maxWidth = `${width}px`;
    }
    if (previewContainer) previewContainer.style.display = 'flex';
    document.body.classList.add('mobile-preview-active');
    this.onLayoutChange('preview');
  }

  exitPreview() {
    this.currentMode = 'auto';
    if (typeof document === 'undefined') return;
    const mobileRoot = document.getElementById('mobile-layout-root');
    const previewContainer = document.getElementById('mobile-preview-frame-container');

    if (mobileRoot) {
      mobileRoot.classList.remove('in-preview-frame');
      mobileRoot.style.maxWidth = '';
    }
    if (previewContainer) previewContainer.style.display = 'none';
    document.body.classList.remove('mobile-preview-active');
    this.updateLayout();
  }
}
