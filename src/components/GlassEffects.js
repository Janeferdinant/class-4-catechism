/**
 * GlassEffects
 * Pointer-following "liquid" highlight for glass controls (see glass.css).
 * Sets --mx / --my on the button under a mouse or trackpad; the stylesheet
 * draws the light. Touch screens and reduced-motion visitors are skipped.
 */
export function initGlassHighlights(root = typeof document !== 'undefined' ? document : null) {
  if (!root || typeof window === 'undefined' || !window.matchMedia) return () => {};
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastEvent = null;

  const update = () => {
    frame = 0;
    const target = lastEvent && lastEvent.target;
    const control = target && target.closest ? target.closest('button') : null;
    if (!control) return;
    const rect = control.getBoundingClientRect();
    control.style.setProperty('--mx', `${(lastEvent.clientX - rect.left).toFixed(0)}px`);
    control.style.setProperty('--my', `${(lastEvent.clientY - rect.top).toFixed(0)}px`);
  };

  const onPointerMove = (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    lastEvent = event;
    if (!frame) frame = requestAnimationFrame(update);
  };

  root.addEventListener('pointermove', onPointerMove, { passive: true });
  return () => {
    root.removeEventListener('pointermove', onPointerMove);
    if (frame) cancelAnimationFrame(frame);
  };
}
