import { base } from "$app/paths";

// All figure artwork lives in static/Indicadores. Every age group ships the
// same set: 5 SVGs and 5 GIFs, named <sexe>-<codi>-<n>.<ext>.
//
// Extracted out of PopulationImage.svelte (unchanged logic) so PopulationGrid
// can resolve — and measure — each unit's artwork before laying anything
// out, instead of the leaf component picking it after the fact.
const IMAGE_BASE = `${base}/Indicadores`;
const VARIANTS = [1, 2, 3, 4, 5];

const STEM_BY_SEXE = { Dona: "dona", Home: "home" };
const CODE_BY_AGE = {
  "0-14": "A",
  "15-44": "B",
  "45-64": "C",
  "65 i més": "D",
};

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function figureFor(sexe, edat) {
  const stem = STEM_BY_SEXE[sexe];
  const code = CODE_BY_AGE[edat];
  return stem && code ? `${stem}-${code}` : null;
}

// Single-age-group datasets (Infants: 0-14, seniors: 65 i més) collapse
// Edat to the literal "Tots", but Edat_label keeps the real range, e.g.
// "Tots (65 i més)" — recover it so the right artwork group is picked.
function resolveAgeKey(h) {
  if (h.edat !== "Tots") return h.edat;
  const match = /\(([^)]+)\)/.exec(h.edatLabel || "");
  return match ? match[1] : h.edat;
}

// An unresolvable age falls back to the adult group of the same sexe, so we
// never show the wrong figure for a known profile.
function resolveFigure(h) {
  return (
    figureFor(h.sexe, resolveAgeKey(h)) ||
    figureFor(h.sexe, "15-44") ||
    figureFor("Dona", "15-44")
  );
}

// Resolves both artwork paths for one population unit. Called once up front
// per unit (not on every render like before), so the random pick is stable
// for the unit's whole lifetime on screen. The SVG and the GIF are the SAME
// figure (same variant number): the GIF is that figure walking, the SVG is
// that figure standing still.
export function resolveArtwork(human) {
  if (!human.sexe) return { staticSrc: null, animatedSrc: null };
  const figure = resolveFigure(human);
  const variant = randomFrom(VARIANTS);
  return {
    staticSrc: `${IMAGE_BASE}/${figure}-${variant}.svg`,
    animatedSrc: `${IMAGE_BASE}/${figure}-${variant}.gif`,
  };
}
