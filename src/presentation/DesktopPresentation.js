/**
 * DesktopPresentation
 * Dedicated presentation layer for the desktop experience.
 * Manages desktop-specific navigation, widescreen layouts, 3D WebGL panels,
 * and coordinates view switching while sharing state with the core application.
 */
export class DesktopPresentation {
  constructor(app) {
    this.app = app;
    this.activeView = 'universe';
  }

  init() {
    if (typeof document === 'undefined') return;
    this.setupDesktopNavigation();
    this.setupDesktopHeaderActions();
  }

  setupDesktopNavigation() {
    const tabs = document.querySelectorAll('.nav-tabs .tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.getAttribute('data-view');
        if (view && this.app?.switchView) {
          this.app.switchView(view);
        }
      });
    });
  }

  setupDesktopHeaderActions() {
    const previewBtn = document.getElementById('btn-desktop-preview-mobile') || document.getElementById('btn-mobile-toggle');
    if (previewBtn && this.app?.layoutSelector) {
      previewBtn.addEventListener('click', () => {
        if (this.app?.sfx?.playPop) this.app.sfx.playPop();
        this.app.layoutSelector.previewMobile(390);
      });
    }

    const gearBtn = document.getElementById('btn-mobile-menu');
    if (gearBtn) {
      gearBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        if (this.app?.toggleSettingsPopup) {
          this.app.toggleSettingsPopup();
        }
      });
    }
  }

  setActiveTab(viewName) {
    this.activeView = viewName;
    const tabs = document.querySelectorAll('.nav-tabs .tab-btn');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-view') === viewName);
    });
  }

  updateStars(count) {
    const starEl = document.getElementById('header-star-count');
    if (starEl) starEl.textContent = `${count} Stars`;
  }
}
