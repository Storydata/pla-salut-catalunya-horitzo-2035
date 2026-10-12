import { animate, scroll } from "motion";

/**
 * Deixa els grafics de Datawrapper a la seva alcada real dins d'una seccio
 * fixada, sense retallar-los i sense encongir-los.
 *
 * Les seccions d'estructura de poblacio son un `lg:sticky` d'una alcada igual a
 * la de la pantalla (menys la capcalera) amb `overflow-hidden`: mentre el scroll
 * mou el bloc de context (parallax), la caixa es queda quieta. Datawrapper dona
 * a cada grafic una alcada propia (p. ex. 579px la piramide) que no es pot
 * variar, i en pantalles baixes titol + comptadors + grafic no hi caben.
 *
 * En lloc d'escalar els grafics (es veien petits), es deixen a la seva alcada i
 * el bloc `stack` (titol + comptadors + grafics) puja amb el scroll just el que
 * li sobra: la caixa continua fixada, el parallax no s'atura i al cap de poc
 * scroll es veu el grafic sencer amb el seu peu.
 *
 * Els grafics aparellats es fixen a l'alcada del mes alt, que es la que els
 * dona Datawrapper. Per sota de lg la seccio va en flux normal i mana l'alcada
 * que reporta Datawrapper (en estret els grafics creixen).
 *
 * @param {object} options
 * @param {HTMLElement} options.container  arrel de la seccio (hi busquem els
 *                                         `[data-chart-box]`)
 * @param {HTMLElement} options.stage      la caixa `lg:sticky`
 * @param {HTMLElement} options.stack      titol + comptadors + grafics, el
 *                                         bloc que puja amb el scroll
 * @param {number} [options.designHeight]  alcada del grafic fins que
 *                                         Datawrapper en publica la real
 * @param {number} [options.gutter]        aire que deixem al fons de la caixa
 * @returns {() => void} neteja dels listeners
 */
export function createStickyChartHeight({
  container,
  stage,
  stack,
  designHeight = 580,
  gutter = 12,
}) {
  const desktop = window.matchMedia("(min-width: 1024px)");
  // Part del recorregut de la seccio en que el bloc acaba de pujar.
  const REVEAL_END = 0.12;
  // Alcada que Datawrapper reporta per a cada iframe.
  const naturalHeights = new WeakMap();
  let frame;
  let shift = 0;
  let stopReveal;

  const boxes = () =>
    Array.from(container.querySelectorAll("[data-chart-box]"));

  // Fa pujar `stack` `overflow` px amb el scroll de la seccio fixada.
  const syncReveal = (overflow) => {
    if (overflow === shift) return;
    shift = overflow;
    stopReveal?.();
    stopReveal = undefined;
    stack.style.transform = "";
    if (overflow <= 0) return;

    stopReveal = scroll(
      animate(
        stack,
        {
          transform: [
            "translateY(0px)",
            `translateY(-${overflow}px)`,
            `translateY(-${overflow}px)`,
          ],
        },
        { easing: "easeInOut", offset: [0, REVEAL_END, 1] },
      ),
      { target: container, offset: ["start start", "end start"] },
    );
  };

  const apply = () => {
    const charts = boxes()
      .map((box) => ({ box, iframe: box.querySelector("iframe") }))
      .filter(({ iframe }) => iframe);
    if (charts.length === 0) return;

    const wanted = (iframe) => naturalHeights.get(iframe) ?? designHeight;

    if (!desktop.matches) {
      charts.forEach(({ box, iframe }) => {
        box.style.height = "";
        iframe.style.height = wanted(iframe) + "px";
      });
      syncReveal(0);
      return;
    }

    const tallest = Math.max(...charts.map(({ iframe }) => wanted(iframe)));
    charts.forEach(({ box, iframe }) => {
      box.style.height = "";
      iframe.style.height = tallest + "px";
    });

    // El que sobra de la pila respecte a la caixa fixada.
    const bottom = stack.offsetTop + stack.offsetHeight + gutter;
    syncReveal(Math.max(0, Math.round(bottom - stage.clientHeight)));
  };

  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(apply);
  };

  // Datawrapper publica l'alcada natural de cada grafic en carregar i cada cop
  // que canvia d'amplada. Cal reaplicar la nostra a cada missatge, perque els
  // listeners d'altres seccions redimensionen tots els iframes de la pagina.
  const handleMessage = (e) => {
    const heights = e.data && e.data["datawrapper-height"];
    if (!heights) return;
    boxes().forEach((box) => {
      const iframe = box.querySelector("iframe");
      if (!iframe || iframe.contentWindow !== e.source) return;
      for (const key in heights) naturalHeights.set(iframe, heights[key]);
    });
    schedule();
  };

  window.addEventListener("message", handleMessage);
  window.addEventListener("resize", schedule);
  desktop.addEventListener("change", schedule);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    stopReveal?.();
    window.removeEventListener("message", handleMessage);
    window.removeEventListener("resize", schedule);
    desktop.removeEventListener("change", schedule);
  };
}
