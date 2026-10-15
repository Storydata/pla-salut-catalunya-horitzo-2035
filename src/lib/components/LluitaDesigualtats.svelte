<script>
  import { onDestroy, onMount, tick } from "svelte";
  import Icon from "$lib/icons/Icon.svelte";
  import ChartFootnote from "$lib/charts/ChartFootnote.svelte";
  import { morphBubbles, snapshotBubbles } from "$lib/utils/bubbleMorph.js";
  // En línia (?raw), no com a imatge: dins d'una imatge el document SVG està
  // aïllat i no pot fer servir la Inter de la pàgina.
  import SvgSexe from "$lib/assets/Desigualtats-salut-eixos-SEXE.svg?raw";
  import SvgEdat from "$lib/assets/Desigualtats-salut-eixos-EDAT.svg?raw";
  import SvgClasseSocial from "$lib/assets/Desigualtats-salut-eixos-C-SOCIAL.svg?raw";
  import SvgEstudis from "$lib/assets/Desigualtats-salut-eixos-ESTUDIS.svg?raw";
  import SvgOrigen from "$lib/assets/Desigualtats-salut-eixos-ORIGEN.svg?raw";

  export let onClose = () => {};

  // Els fitxers reutilitzen els noms .cls-1… amb valors diferents i,
  // en línia, els seus estils afecten tot el document: cal prefixar-los.
  function prepare(raw, key) {
    return raw
      .replace(/<\?xml[^>]*\?>/, "")
      .replace(/cls-/g, `${key}-cls-`)
      .replace(/id="Capa_1"/, `id="Capa_1-${key}"`);
  }

  const eixos = [
    { key: "sexe", label: "Per sexe", svg: prepare(SvgSexe, "sexe") },
    { key: "edat", label: "Per edat", svg: prepare(SvgEdat, "edat") },
    {
      key: "classe",
      label: "Per classe social",
      svg: prepare(SvgClasseSocial, "classe"),
    },
    {
      key: "estudis",
      label: "Per nivell d'estudis",
      svg: prepare(SvgEstudis, "estudis"),
    },
    {
      key: "origen",
      label: "Per país d'origen",
      svg: prepare(SvgOrigen, "origen"),
    },
  ];

  // Durada (ms) del canvi d'eix: les bombolles creixen o es redueixen fins al
  // seu valor mentre la resta de l'SVG s'esvaeix i apareix.
  const MORPH_MS = 1400;

  let activeKey = "sexe";
  let active; // contenidor de l'SVG mostrat
  let ghostHost; // capa on s'esvaeix l'SVG anterior
  let finishMorph = null;
  let request = 0;

  $: activeEix = eixos.find((e) => e.key === activeKey) ?? eixos[0];

  async function selectEix(key) {
    if (key === activeKey) return;
    finishMorph?.();
    finishMorph = null;

    const id = ++request;
    const snapshot = snapshotBubbles(active.querySelector("svg"));
    activeKey = key;
    await tick();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (id !== request || reduceMotion) return;
    finishMorph = morphBubbles(
      snapshot,
      active.querySelector("svg"),
      ghostHost,
      MORPH_MS / 1000,
    );
  }

  onDestroy(() => finishMorph?.());

  let root;

  onMount(() => {
    // En obrir la secció, situa el títol a dalt en comptes de mantenir el scroll anterior
    root?.scrollIntoView({ block: "start" });
  });
</script>

<div
  bind:this={root}
  class="relative w-full scroll-mt-[var(--site-header-h)]"
  style="animation: componentFadeIn 800ms ease both;"
>
  <div class="flex flex-col pb-8">
    <div class="relative mb-8 px-4 pt-[var(--section-top-gap)] text-center">
      <p
        class="font-inter text-base font-normal uppercase tracking-[1px] text-[#2E3A59]"
      >
        La salut de la població | Desigualtats i salut
      </p>
      <button
        on:click={onClose}
        class="absolute right-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 lg:top-24"
      >
        <Icon name="x" size={24} />
      </button>
    </div>

    <div class="container mx-auto px-4">
      <div class="mx-auto w-full max-w-[1100px]">
        <h2
          class="mb-3 text-center font-inter text-lg font-bold text-[#2e3a59]"
        >
          Desigualtats en salut per eixos socials 
        </h2>

        <p
          class="mx-auto mb-6 max-w-[820px] text-center font-inter text-[15px] leading-relaxed text-[#2e3a59]"
        >
          Les desigualtats més marcades s'observen segons el nivell educatiu i
          la classe social, fet que reforça l'evidència que la salut està
          fortament condicionada pels determinants socials i que reduir aquestes
          diferències requereix actuar molt més enllà del sistema sanitari
        </p>

        <div class="mb-6 flex flex-col items-center">
          <div class="w-full">
            <div class="mb-3 flex flex-wrap justify-center gap-3">
              {#each eixos as eix}
                <button
                  on:click={() => selectEix(eix.key)}
                  class="rounded-md px-[21.6px] py-[7.2px] font-inter text-[12.6px] uppercase tracking-[0.5px] transition-colors cursor-pointer {activeKey ===
                  eix.key
                    ? 'bg-[#2E3A59] font-bold text-white'
                    : 'bg-[#E8EDF2] text-[#2E3A59] hover:bg-[#dbe3ec]'}"
                >
                  {eix.label}
                </button>
              {/each}
            </div>

            <div
              class="mx-auto grid max-w-[820px] gap-8 text-left md:grid-cols-2"
            >
              <div>
                <p
                  class="font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-[#828898]"
                >
                  Mida de la bombolla
                </p>
                <p
                  class="font-inter text-[11px] uppercase leading-[1.6] tracking-[0.5px] text-[#828898]"
                >
                  Indica la diferència de prevalença entre 2 grups extrems. Les
                  diferències es mostren a partir de +5 punts.
                </p>
              </div>
              <div>
                <p
                  class="font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-[#828898]"
                >
                  Color
                </p>
                <p
                  class="font-inter text-[11px] uppercase leading-[1.6] tracking-[0.5px] text-[#828898]"
                >
                  Indica quin grup suporta més càrrega
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative flex justify-center">
          {#key activeEix.key}
            <div
              bind:this={active}
              class="eix h-auto w-full max-w-[589px]"
              role="img"
              aria-label="Desigualtats en salut per eixos socials: {activeEix.label}"
            >
              {@html activeEix.svg}
            </div>
          {/key}
          <div
            bind:this={ghostHost}
            class="eix pointer-events-none absolute left-1/2 top-0 w-full max-w-[589px] -translate-x-1/2"
            aria-hidden="true"
          ></div>
        </div>

        <!-- Mateixa nota de font que els indicadors dels CSV, alineada amb l'SVG. -->
        <div class="mx-auto mb-16 mt-1 w-full max-w-[589px]">
          <ChartFootnote font="Dades ESCA 2025." />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Els SVG no porten width/height: escalen al contenidor i hereten la Inter. */
  .eix :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    font-family: "Inter", sans-serif;
  }

  /* Durant el canvi d'eix (bubbleMorph.js) les bombolles es mouen soles; la
     resta de l'SVG nou apareix i la de l'anterior s'esvaeix amb el mateix
     progrés (--morph, de 0 a 1). */
  .eix :global(svg.morph > :not(defs):not(style):not([data-bubble])) {
    opacity: var(--morph, 1);
  }

  .eix :global(svg.ghost) {
    opacity: calc(1 - var(--morph, 0));
  }
</style>
