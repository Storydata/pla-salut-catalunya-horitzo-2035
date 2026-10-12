// A figure's GIF and its still SVG are drawn by hand and don't line up exactly:
// in some of them (above all the 0-14 group) the SVG is up to ~10% smaller than
// the GIF and sits to one side of it. Left alone, that shows as a jump when the
// GIF hands over to the SVG, so the GIF is gently scaled and nudged onto the
// SVG's footprint while it lands (see animationHelpers.js).
//
// The correction is measured from the real files, so it follows them if they
// are ever re-exported. It needs ImageDecoder (Chromium, recent Safari) to read
// the GIF's frames; where it is missing the correction is simply skipped.
//
// Both files are measured in the same box the grid draws them in: GIF at its
// natural size (SIZE.width x SIZE.height), SVG scaled to the same height, both
// centred and standing on the bottom edge (object-fit: contain +
// object-position: bottom).
const SIZE = { width: 275, height: 360 };
const ALPHA_THRESHOLD = 40;
const NO_FIT = { scale: 1, shift: 0 };

const cache = new Map();

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Height, and horizontal centre, of the visible part of an image.
function silhouetteOf(source, sourceWidth, sourceHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE.width;
  canvas.height = SIZE.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const scale = Math.min(SIZE.width / sourceWidth, SIZE.height / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  ctx.drawImage(
    source,
    (SIZE.width - width) / 2,
    SIZE.height - height,
    width,
    height,
  );

  const pixels = ctx.getImageData(0, 0, SIZE.width, SIZE.height).data;
  let minX = SIZE.width;
  let maxX = -1;
  let minY = SIZE.height;
  let maxY = -1;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] <= ALPHA_THRESHOLD) continue;
    const pixel = (i - 3) / 4;
    const x = pixel % SIZE.width;
    const y = Math.floor(pixel / SIZE.width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  if (maxX < 0) return null;
  return { height: maxY - minY + 1, centre: (minX + maxX) / 2 };
}

async function measureGif(src) {
  const bytes = await (await fetch(src)).arrayBuffer();
  const decoder = new ImageDecoder({ data: bytes, type: "image/gif" });
  await decoder.tracks.ready;

  const silhouettes = [];
  for (let i = 0; i < decoder.tracks.selectedTrack.frameCount; i++) {
    const { image } = await decoder.decode({ frameIndex: i });
    silhouettes.push(
      silhouetteOf(image, image.displayWidth, image.displayHeight),
    );
    image.close();
  }
  decoder.close();
  return silhouettes.filter(Boolean);
}

async function measure(staticSrc, animatedSrc) {
  const svg = await loadImage(staticSrc);
  const still = silhouetteOf(svg, svg.naturalWidth, svg.naturalHeight);
  const frames = await measureGif(animatedSrc);
  if (!still || frames.length === 0) return NO_FIT;

  // The GIF's height is that of its tallest frame (the walk cycle bobs a
  // little); its centre is the average one.
  const gifHeight = Math.max(...frames.map((f) => f.height));
  const gifCentre =
    frames.reduce((sum, f) => sum + f.centre, 0) / frames.length;

  return {
    scale: still.height / gifHeight,
    // As a fraction of the figure's height, so it holds at any size.
    shift: (still.centre - gifCentre) / SIZE.height,
  };
}

// How to scale (around the bottom centre) and shift the GIF so that it lies on
// top of its SVG: { scale, shift }, where shift is a fraction of the figure's
// height. Cached per figure; never rejects.
export function getFigureFit(staticSrc, animatedSrc) {
  if (!staticSrc || !animatedSrc || typeof ImageDecoder === "undefined") {
    return Promise.resolve(NO_FIT);
  }
  if (!cache.has(animatedSrc)) {
    cache.set(
      animatedSrc,
      measure(staticSrc, animatedSrc).catch(() => NO_FIT),
    );
  }
  return cache.get(animatedSrc);
}
