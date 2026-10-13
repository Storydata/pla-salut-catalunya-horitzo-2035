import { animate } from "motion";

// Les bombolles dels SVG de "Desigualtat i salut" són <path> en forma de cercle
// ("M cx,cy v-r c…") amb una `d` curta; la resta de <path> (lletres, punts de
// la llegenda) tenen una `d` molt més llarga o un radi petit.
const BUBBLE_D = /^M(-?[\d.]+),(-?[\d.]+)v-([\d.]+)c/;
const MIN_RADIUS = 5;
const MAX_D_LENGTH = 200;
// Les posicions de les bombolles varien uns quants px entre fitxers; es
// parellen només si són a menys d'aquesta distància.
const MAX_MATCH_DISTANCE = 30;

function bubblePaths(svg) {
  return [...svg.querySelectorAll("path")].filter((path) => {
    const d = path.getAttribute("d") ?? "";
    const match = BUBBLE_D.exec(d);
    return match && d.length < MAX_D_LENGTH && Number(match[3]) >= MIN_RADIUS;
  });
}

// Fill de l'<svg> arrel que conté la bombolla (el <g> d'opacitat o el <path>).
function unitOf(path, svg) {
  let node = path;
  while (node.parentNode !== svg) node = node.parentNode;
  return node;
}

function parseColor(value) {
  return (value.match(/[\d.]+/g) ?? [0, 0, 0]).slice(0, 3).map(Number);
}

function read(path, svg) {
  const [, cx, cy, r] = BUBBLE_D.exec(path.getAttribute("d"));
  return {
    path,
    unit: unitOf(path, svg),
    d: path.getAttribute("d"),
    cx: Number(cx),
    cy: Number(cy),
    r: Number(r),
    color: parseColor(getComputedStyle(path).fill),
  };
}

function circle(cx, cy, r) {
  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
}

const mix = (a, b, t) => a + (b - a) * t;

// Parella cada bombolla de l'SVG anterior amb la més propera de la nova (la
// mateixa posició). Les que només són a la nova creixen des de 0 i les que
// només eren a l'anterior (`unit` clonat dins de la nova) es redueixen fins a 0.
function pairUp(from, to, svg) {
  const candidates = [];
  from.forEach((a, i) =>
    to.forEach((b, j) =>
      candidates.push({ i, j, dist: Math.hypot(a.cx - b.cx, a.cy - b.cy) }),
    ),
  );
  candidates.sort((x, y) => x.dist - y.dist);

  const usedFrom = new Set();
  const usedTo = new Set();
  const pairs = [];
  for (const { i, j, dist } of candidates) {
    if (dist > MAX_MATCH_DISTANCE) break;
    if (usedFrom.has(i) || usedTo.has(j)) continue;
    usedFrom.add(i);
    usedTo.add(j);
    pairs.push({ start: from[i], end: to[j], path: to[j].path });
  }

  to.forEach((bubble, j) => {
    if (!usedTo.has(j))
      pairs.push({
        start: { ...bubble, r: 0 },
        end: bubble,
        path: bubble.path,
      });
  });

  const leaving = [];
  from.forEach((bubble, i) => {
    if (usedFrom.has(i)) return;
    const unit = bubble.unit.cloneNode(true);
    const path = unit.tagName === "path" ? unit : unit.querySelector("path");
    svg.insertBefore(unit, to[0].unit);
    leaving.push(unit);
    pairs.push({ start: bubble, end: { ...bubble, r: 0 }, path });
  });

  return { pairs, leaving };
}

// Llegeix les bombolles de l'SVG que s'acaba de mostrar i en fa un clon sense
// elles (la resta: radis, etiquetes, llegenda), que serà el que s'esvaeix.
export function snapshotBubbles(svg) {
  const bubbles = bubblePaths(svg).map((path) => {
    const bubble = read(path, svg);
    return { ...bubble, unit: bubble.unit.cloneNode(true) };
  });
  const ghost = svg.cloneNode(true);
  for (const path of bubblePaths(ghost)) unitOf(path, ghost).remove();
  return { bubbles, ghost };
}

// Passa de l'SVG anterior (`snapshot`) al nou (`svg`): cada bombolla creix o es
// redueix fins al seu valor mentre la resta s'esvaeix i apareix. `host` és el
// contenidor, sobre l'SVG nou, on viu el clon que s'esvaeix. Retorna una funció
// que acaba la transició a l'estat final, o `null` si no hi ha bombolles que
// parellar (llavors es mostra l'SVG nou sense transició).
export function morphBubbles(snapshot, svg, host, duration) {
  const to = bubblePaths(svg).map((path) => read(path, svg));
  if (!to.length || !snapshot.bubbles.length) return null;

  const stage = host.parentElement;
  const { pairs, leaving } = pairUp(snapshot.bubbles, to, svg);

  const finish = () => {
    animation?.stop();
    to.forEach((bubble) => {
      bubble.path.setAttribute("d", bubble.d);
      bubble.path.style.removeProperty("fill");
      bubble.unit.removeAttribute("data-bubble");
    });
    leaving.forEach((unit) => unit.remove());
    svg.classList.remove("morph");
    stage.style.removeProperty("--morph");
    snapshot.ghost.remove();
  };

  const draw = (t) => {
    pairs.forEach(({ start, end, path }) => {
      const [red, green, blue] = end.color.map((c, k) =>
        Math.round(mix(start.color[k], c, t)),
      );
      path.setAttribute(
        "d",
        circle(
          mix(start.cx, end.cx, t),
          mix(start.cy, end.cy, t),
          mix(start.r, end.r, t),
        ),
      );
      path.style.fill = `rgb(${red}, ${green}, ${blue})`;
    });
    stage.style.setProperty("--morph", t);
  };

  svg.classList.add("morph");
  to.forEach((bubble) => bubble.unit.setAttribute("data-bubble", ""));
  leaving.forEach((unit) => unit.setAttribute("data-bubble", ""));
  snapshot.ghost.classList.add("ghost");
  host.append(snapshot.ghost);
  draw(0);

  const animation = animate(0, 1, {
    duration,
    ease: "easeInOut",
    onUpdate: draw,
    onComplete: finish,
  });

  return finish;
}
