import { animate } from "motion";

// Movement of the figures when the filters change.
//
// A figure is two layers: the still SVG, which NEVER moves (it only fades out
// where the figure leaves from and fades in where it arrives), and the
// animated GIF, which is the only thing that travels. The GIF takes off over
// the still figure, flies to its new place along ONE continuous curve (no stops
// in between) and lands over the spot where the new still figure fades in.
// Tune the feel from here.
export const MOTION = {
  // Seconds a figure takes to get to its new place: every figure gets its own
  // time between DURATION_MIN and DURATION_MAX (DURATION_SKEW 1 spreads them
  // evenly; higher bunches them towards DURATION_MIN, with a few stragglers).
  // The landings are spread over several seconds, so only a few figures hand
  // over from GIF to SVG at any moment instead of all at once.
  // MAX_DELAY is a small random wait before each figure sets off.
  DURATION_MIN: 2.2,
  DURATION_MAX: 5.4,
  DURATION_SKEW: 1,
  MAX_DELAY: 0.2,
  // Gentle start and arrival, with no stop on the way.
  EASE: [0.4, 0, 0.2, 1],
  // How far the curve bends sideways: a fraction of the trip's length, but at
  // least MIN_BEND px so even short trips draw a visible arc.
  BEND: 0.8,
  MIN_BEND: 40,
  // The GIF and the still SVG cross-fade only while the GIF is within HAND_OFF_PX
  // of the spot where it takes off / lands (about one figure wide), so the two
  // never show up side by side. For very short trips the cross-fade is instead
  // spread over the first / last HAND_OFF share of the trip (eased progress).
  HAND_OFF_PX: 24,
  HAND_OFF: 0.1,
};

// Layout constants
export const LAYOUT_CONSTANTS = {
  PADDING_BOTTOM: 16,
  ANIMATION_START_DELAY: 50,
  // Multiplies (rowHeight + verticalSpacing) to create the gap between the
  // "selected" group and the rest. Kept higher than 1 on purpose: general
  // spacing is intentionally tight, so this is what keeps the two groups
  // visually distinct instead of reading as one continuous crowd.
  SEPARATION_ROWS: 2.2,
  DEFAULT_GRID_HEIGHT: 500,
};

export function getResponsiveConfig(width) {
  const w = width || 1200;

  // Sizes are 10% smaller than the previous ones (46/54/52 -> 41.4/48.6/46.8),
  // which were already 20% smaller than the original design (58/68/65), and
  // spacing between figures is tighter than before — only SEPARATION_ROWS above
  // keeps the "selected vs rest" gap visible despite that.
  if (w < 640) {
    return {
      imageHeight: 41.4,
      HORIZONTAL_SPACING: 2,
      VERTICAL_SPACING: 5,
    };
  }
  if (w < 1024) {
    return {
      imageHeight: 48.6,
      HORIZONTAL_SPACING: 4,
      VERTICAL_SPACING: 6,
    };
  }
  return {
    imageHeight: 46.8,
    HORIZONTAL_SPACING: 4,
    VERTICAL_SPACING: 5,
  };
}

// Hard ceiling on how many figures share a row, regardless of how much
// horizontal space is available — mirrors the original design's column cap.
// In practice this mostly matters on wide/desktop screens: on narrow ones,
// running out of width already forces a wrap well before 25 items.
export const MAX_ITEMS_PER_ROW = 25;

// Splits items of varying width into rows that fit a container, then centres
// each row on its own — not the block as a whole. This is what makes a
// 10-figure group and a 90-figure group (4-5 rows) both look right at the
// same time: a short row centres itself instead of sitting lopsided inside a
// box sized for a much wider row elsewhere.
//
// Step 1: greedily fill rows, breaking on whichever limit hits first — the
// container width, or MAX_ITEMS_PER_ROW.
function splitIntoRows(
  widths,
  horizontalSpacing,
  containerWidth,
  maxItemsPerRow,
) {
  const rows = [];
  let currentWidths = [];
  let currentWidth = 0;

  for (const w of widths) {
    const widthIfAdded =
      currentWidths.length === 0 ? w : currentWidth + horizontalSpacing + w;
    const rowIsFull =
      currentWidths.length > 0 &&
      (widthIfAdded > containerWidth || currentWidths.length >= maxItemsPerRow);

    if (rowIsFull) {
      rows.push({ widths: currentWidths, width: currentWidth });
      currentWidths = [];
      currentWidth = 0;
    }

    currentWidths.push(w);
    currentWidth =
      currentWidths.length === 1 ? w : currentWidth + horizontalSpacing + w;
  }

  if (currentWidths.length > 0) {
    rows.push({ widths: currentWidths, width: currentWidth });
  }
  return rows;
}

// Step 2: stack the rows from splitIntoRows top to bottom, each one centred
// horizontally within containerWidth.
export function layoutCenteredRows(
  widths,
  rowHeight,
  horizontalSpacing,
  verticalSpacing,
  containerWidth,
  maxItemsPerRow = MAX_ITEMS_PER_ROW,
) {
  const rows = splitIntoRows(
    widths,
    horizontalSpacing,
    containerWidth,
    maxItemsPerRow,
  );

  const positions = [];
  let y = 0;
  for (const row of rows) {
    let x = Math.max(0, (containerWidth - row.width) / 2);
    for (const w of row.widths) {
      positions.push({ x, y });
      x += w + horizontalSpacing;
    }
    y += rowHeight + verticalSpacing;
  }

  const totalHeight = rows.length > 0 ? y - verticalSpacing : 0;
  return { positions, totalHeight };
}

// How far the GIF has to be scaled and shifted to lie exactly on its SVG (see
// figureFit.js); the shift is turned from a fraction of the height into px.
function fitOf(flyer) {
  if (!flyer) return { scale: 1, shift: 0 };
  return {
    scale: Number(flyer.dataset.fitScale),
    shift: Number(flyer.dataset.fitShift) * flyer.offsetHeight,
  };
}

// The layers of every figure, in DOM order. `circle` is the slot of the still
// SVG (with the SVG it leaves behind, `fromImg`, and the one it arrives with,
// `toImg`); `flyer` holds the animated GIF and is null for figures without art.
export function getFigures(container) {
  const flyers = new Map(
    [...container.querySelectorAll("[data-flyer]")].map((el) => [
      el.dataset.unit,
      el,
    ]),
  );

  return [...container.querySelectorAll("[data-circle]")].map((el) => ({
    circle: el,
    isIncluded: el.dataset.included === "true",
    flyer: flyers.get(el.dataset.unit) ?? null,
    flyerImg: flyers.get(el.dataset.unit)?.querySelector("img") ?? null,
    fit: fitOf(flyers.get(el.dataset.unit)),
    fromImg: el.querySelector("[data-static-from]"),
    toImg: el.querySelector("[data-static-to]"),
  }));
}

// Where each figure has to end up, in the same order as `figures`. Target
// positions are computed by the caller (via layoutCenteredRows), once for the
// included group and once for the excluded group, so the same layout math also
// drives the container's CSS height reactively — no need to duplicate it here.
export function buildTargets(
  figures,
  includedPositions,
  excludedPositions,
  separationY,
) {
  let includedIdx = 0;
  let excludedIdx = 0;

  return figures.map((figure) => {
    if (figure.isIncluded) {
      return { ...includedPositions[includedIdx++], opacity: 1 };
    }
    const pos = excludedPositions[excludedIdx++];
    return { x: pos.x, y: pos.y + separationY, opacity: 0.4 };
  });
}

// What each figure looked like when its last frame was drawn, so a new trip
// (e.g. a filter changed halfway through the previous one) starts from there
// instead of jumping. `slot` is where the still SVG is, `flyer` where the GIF
// is; `still` and `gif` are how visible each one is (0-1, before `group`, the
// opacity of the whole figure: 1 selected, 0.4 the rest).
const lastFrame = new WeakMap();
const RESTING = {
  slot: { x: 0, y: 0 },
  flyer: { x: 0, y: 0 },
  group: 1,
  still: 1,
  gif: 0,
};

// Eased 0-1 ramp of `progress` between `start` and `end`.
function ramp(progress, start, end) {
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function place(element, point) {
  element.style.transform = `translate(${point.x}px, ${point.y}px)`;
}

// Control point of a figure's curve: the middle of the trip pushed sideways,
// to the left or to the right at random, but never out of the grid. Since it
// is only ever pushed sideways, the curve never doubles back on itself, so a
// figure never slows down to a stop on the way.
function pickControlPoint(from, to, maxX, maxY) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const normal = { x: (from.y - to.y) / length, y: (to.x - from.x) / length };
  const bend =
    (Math.random() * 2 - 1) * Math.max(MOTION.MIN_BEND, length * MOTION.BEND);

  // The curve's middle sits half-way between the trip's middle and the
  // control point. Try the bend on either side, then softer ones, until it
  // fits inside the grid.
  const fits = (b) => {
    const x = mid.x + (normal.x * b) / 2;
    const y = mid.y + (normal.y * b) / 2;
    return x >= 0 && x <= maxX && y >= 0 && y <= maxY;
  };
  const chosen = [bend, -bend, bend / 2, -bend / 2, 0].find(fits) ?? 0;

  return { x: mid.x + normal.x * chosen, y: mid.y + normal.y * chosen };
}

// Draws one frame of a figure's trip. `progress` is 0 at the start and 1 on
// arrival. The GIF follows a quadratic curve from `from.flyer` to `to`, bent
// towards `via`. The still SVG stays put: until half-way it is the old one,
// where the figure left from, fading out; then, while invisible, its slot
// jumps to the new place, and the new SVG fades in there.
function drawFrame(figure, from, via, to, progress) {
  const u = 1 - progress;
  const flyer = {
    x: u * u * from.flyer.x + 2 * u * progress * via.x + progress ** 2 * to.x,
    y: u * u * from.flyer.y + 2 * u * progress * via.y + progress ** 2 * to.y,
  };
  const group = from.group + (to.opacity - from.group) * progress;

  // Figures without art (a grey dot) have no GIF: their only layer travels.
  if (!figure.flyer) {
    place(figure.circle, flyer);
    figure.circle.style.opacity = group;
    lastFrame.set(figure.circle, { ...from, slot: flyer, flyer, group });
    return;
  }

  // How far the GIF has taken off (0-1) and how far it has landed (0-1).
  const takenOff = Math.max(
    ramp(progress, 0, MOTION.HAND_OFF),
    ramp(
      Math.hypot(flyer.x - from.flyer.x, flyer.y - from.flyer.y),
      0,
      MOTION.HAND_OFF_PX,
    ),
  );
  const landed = Math.min(
    ramp(progress, 1 - MOTION.HAND_OFF, 1),
    1 - ramp(Math.hypot(flyer.x - to.x, flyer.y - to.y), 0, MOTION.HAND_OFF_PX),
  );

  // Each hand-off is a dissolve, not a plain cross-fade: the image that is
  // coming in gets fully opaque before the other one starts to go, so the
  // figure never turns see-through half-way (the GIF is drawn on top).
  const leaving = progress < 0.5;
  const slot = leaving ? from.slot : to;
  const still = leaving
    ? from.still * (1 - ramp(takenOff, 0.4, 1))
    : ramp(landed, 0, 0.6);
  const gif =
    (from.gif + (1 - from.gif) * ramp(takenOff, 0, 0.6)) *
    (1 - ramp(landed, 0.4, 1));

  place(figure.circle, slot);
  figure.circle.style.opacity = leaving ? from.group : to.opacity;
  figure.fromImg.style.opacity = leaving ? still : 0;
  figure.toImg.style.opacity = leaving ? 0 : still;

  place(figure.flyer, flyer);
  figure.flyer.style.opacity = gif * group;
  // While it lands, the GIF is scaled and nudged onto its SVG's footprint.
  figure.flyerImg.style.transform = `translateX(${figure.fit.shift * landed}px) scale(${
    1 + (figure.fit.scale - 1) * landed
  })`;

  lastFrame.set(figure.circle, { slot, flyer, group, still, gif });
}

// Moves every figure from where it is to its target. widths[i] is the
// on-screen width of figure i, used to keep the curve inside the grid.
// Returns a function that stops the whole movement (e.g. before a new one
// starts, or when the grid goes away).
export function animateFigures(
  figures,
  targets,
  widths,
  gridWidth,
  gridHeight,
  imageHeight,
) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const animations = figures.map((figure, i) => {
    const from = lastFrame.get(figure.circle) ?? RESTING;
    const to = targets[i];

    if (reduceMotion) {
      drawFrame(figure, from, to, to, 1);
      return null;
    }

    // Each figure bends to a different side, so they wander around instead of
    // all walking in straight lines.
    const via = pickControlPoint(
      from.flyer,
      to,
      Math.max(0, gridWidth - widths[i]),
      Math.max(0, gridHeight - imageHeight),
    );
    const duration =
      MOTION.DURATION_MIN +
      (MOTION.DURATION_MAX - MOTION.DURATION_MIN) *
        Math.random() ** MOTION.DURATION_SKEW;

    return animate(0, 1, {
      duration,
      delay: Math.random() * MOTION.MAX_DELAY,
      ease: MOTION.EASE,
      onUpdate: (progress) => drawFrame(figure, from, via, to, progress),
    });
  });

  return () => animations.forEach((animation) => animation?.stop());
}
