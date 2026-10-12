// Converteix el text d'un .svg qualsevol (Lucide, Material Symbols o una
// icona pròpia, baixada de la web de Google o dissenyada a mà) en el
// marcatge final que pinta Icon.svelte. Funció pura, sense dependències --
// així es pot provar sola (vegeu README.md d'aquesta carpeta).
//
// Què garanteix, vingui de l'origen que vingui el fitxer:
//  - Color: sempre el decideix el CSS (`color` o una classe text-*). Si el
//    fitxer porta un color fix (p. ex. el fill="#1f1f1f" que posa Google en
//    descarregar), se substitueix per currentColor.
//  - Mida: mana la prop `size` o la classe (p. ex. "h-6 w-6"); els
//    width/height del fitxer s'ignoren, però sempre hi ha un viewBox perquè
//    la icona escali bé.
//  - Sense retalls: un SVG amagava per defecte el que sobresortia de la seva
//    caixa (overflow: hidden). Amb "rounded-full" + padding, aquesta caixa és
//    un cercle petit que talla les puntes de la icona.

const ROOT_TAG = /<svg\b[^>]*>/i;

function parseAttributes(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([^\s=<>"']+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[m[1]] = m[2] ?? m[3];
  }
  return attrs;
}

function serializeRoot(attrs) {
  const parts = Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}="${String(value).replace(/"/g, "&quot;")}"`);
  return `<svg ${parts.join(" ")}>`;
}

const toNumber = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

// Treu els colors fixos dels elements interiors d'una icona de farciment
// (Material, o una dibuixada a mà): fill="...", fill:... dins d'un style, i
// els <style> amb classes (.cls-1 { fill: ... }) que exporten Illustrator o
// Figma. fill="none" es manté: és un element transparent, no un color.
function stripFixedColors(body) {
  return body
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<(title|desc)[\s\S]*?<\/\1>/gi, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\sfill="(?!none")[^"]*"/g, "")
    .replace(/\sstyle="([^"]*)"/g, (_, css) => {
      const kept = css
        .split(";")
        .filter((rule) => rule.trim() && !/^\s*fill\s*:/i.test(rule))
        .join(";");
      return kept ? ` style="${kept}"` : "";
    });
}

/**
 * @param {string} raw        contingut del fitxer .svg
 * @param {"lucide"|"material"} family  carpeta d'origen
 * @param {{size?: number, color?: string, strokeWidth?: number, className?: string}} options
 * @returns {string|null}     marcatge <svg>…</svg>, o null si no és un SVG
 */
export function buildIconMarkup(raw, family, options = {}) {
  const { size, color, strokeWidth, className } = options;

  // Ens quedem amb tot a partir del primer <svg>: fora el pròleg <?xml?>,
  // el DOCTYPE i els comentaris de llicència que hi hagi abans.
  const start = raw.search(ROOT_TAG);
  if (start === -1) return null;
  const svg = raw.slice(start);
  const rootTag = svg.match(ROOT_TAG)[0];
  // <metadata> (firmes de procedència, dades d'editor) no es veu mai i
  // només engreixa la pàgina quan l'SVG va en línia.
  let body = svg.slice(rootTag.length).replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  const attrs = parseAttributes(rootTag);

  if (!attrs.viewBox) {
    const w = toNumber(attrs.width);
    const h = toNumber(attrs.height);
    if (w && h) attrs.viewBox = `0 0 ${w} ${h}`;
  }
  delete attrs.width;
  delete attrs.height;
  delete attrs.class;
  delete attrs.style;
  attrs.xmlns = attrs.xmlns ?? "http://www.w3.org/2000/svg";

  if (family === "lucide") {
    // Ja porten stroke="currentColor"; només es pot ajustar el gruix.
    if (strokeWidth) attrs["stroke-width"] = strokeWidth;
  } else {
    body = stripFixedColors(body);
    const isOutlineIcon =
      attrs.fill === "none" && attrs.stroke && attrs.stroke !== "none";
    if (isOutlineIcon) {
      attrs.stroke = "currentColor";
    } else {
      attrs.fill = "currentColor";
      if (attrs.stroke && attrs.stroke !== "none") attrs.stroke = "currentColor";
    }
  }

  attrs.style = ["overflow:visible", color && `color:${color}`]
    .filter(Boolean)
    .join(";");
  if (className) attrs.class = className;
  if (size) {
    attrs.width = size;
    attrs.height = size;
  } else if (!className) {
    attrs.width = 24;
    attrs.height = 24;
  }

  return serializeRoot(attrs) + body;
}
