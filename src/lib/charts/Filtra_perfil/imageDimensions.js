// Caches the natural (unscaled) size of each artwork file. Many population
// units reuse the same ~20 source files, so this makes sure each file is
// only ever measured once — not once per unit, and not again on resize —
// regardless of screen size or how many times the grid re-renders.
const cache = new Map();

export function getImageDimensions(src) {
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        // A missing/broken file must never block the layout: fall back to a
        // square box rather than leaving the unit stuck with no size.
        img.onerror = () => resolve({ width: 1, height: 1 });
        img.src = src;
      }),
    );
  }
  return cache.get(src);
}

export function preloadImageDimensions(sources) {
  return Promise.all(sources.filter(Boolean).map(getImageDimensions));
}
