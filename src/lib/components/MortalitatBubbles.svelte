<script>
  import { fade } from "svelte/transition";
  import { onMount, tick } from "svelte";

  import Icon from "$lib/icons/Icon.svelte";
  import Bubble from "./Bubble.svelte";
  import BackButton from "./BackButton.svelte";
  import SubsectionNav from "./SubsectionNav.svelte";

  export let onClose = () => {};
  export let prev = null; // subseccio anterior: { label, onSelect }
  export let next = null; // subseccio seguent

  let selectedId = null;
  let hoveredNavId = null;
  let detailVisible = true;

  async function selectBubble(id) {
    detailVisible = false;
    await new Promise((r) => setTimeout(r, 20));
    selectedId = id;
    detailVisible = true;
  }

  const bubbles = [
    {
      id: 1,
      color: "#26aaaa",
      size: "sm",
      icon: "child_care",
      stat: "84,4",
      unit: "anys",
      text: "Esperança de vida en néixer",
      label: "Esperança de vida en néixer",
      description:
        "Els indicadors de salut de la població catalana se situen entre els valors més alts dels països del nostre entorn. L'esperança de vida n'és un dels principals exemples.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/jeuOw/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#26aaaa",
      size: "lg",
      icon: "heart_smile",
      stat: "68,0",
      unit: "anys",
      text: "Esperança de vida amb bona salut al néixer",
      label: "Esperança de vida amb bona salut al néixer",
      description:
        "El repte ja no és només viure més anys, sinó viure'ls amb més salut, benestar i autonomia. Aquest indicador incorpora l'esperança de vida i la qualitat de vida per estimar quants anys de bona salut gaudeix la població.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Cl9L9/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#26aaaa",
      size: "sm",
      icon: "elderly_woman",
      stat: "12,2",
      unit: "anys",
      text: "Esperança de vida amb bona salut als 65 anys",
      label: "Esperança de vida amb bona salut als 65 anys",
      description:
        "La vellesa és el període que concentra la major pèrdua de qualitat de vida, lligada entre altres als factors de risc acumulats al llarg de la vida. Aquest indicador mesura els anys viscuts amb bona salut en aquest tram vital clau per l'avaluació de l'estat de salut de la població.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/whJQq/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#98cbcb",
      size: "lg",
      icon: "nest_eco_leaf",
      stat: "730,7",
      unit: "persones/100.000",
      text: "Mortalitat general",
      label: "Mortalitat general",
      description:
        "La taxa de mortalitat per totes les causes recull totes les defuncions, independentment de la causa que les ha provocat, i és el principal indicador del nivell general de mortalitat d'una població.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/hj5qJ",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#98cbcb",
      size: "sm",
      icon: "biotech",
      stat: "210,6",
      unit: "persones/100.000",
      text: "Mortalitat per tumors",
      label: "Mortalitat per tumors",
      description:
        "Els tumors són la primera causa de mort a Catalunya. Inclouen tots els tumors, benignes i malignes, però gairebé totes les morts d'aquest grup es deuen al càncer. Entre ells, destaquen els càncers de pulmó i bronquis, colorectal, de pàncrees, de mama i de pròstata.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/FKqyk/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#98cbcb",
      size: "lg",
      icon: "pulse_alert",
      stat: "172,4",
      unit: "persones/100.000",
      text: "Mortalitat per malalties cardiovasculars",
      label: "Mortalitat per malalties cardiovasculars",
      description:
        "Les malalties de l'aparell circulatori són la segona causa de mort a Catalunya. Destaquen la malaltia isquèmica del cor, que inclou l'infart de miocardi, i les malalties cerebrovasculars, com l'ictus. També hi apareixen la insuficiència cardíaca, la malaltia hipertensiva, les arrítmies, les malalties de les vàlvules del cor i l'embòlia pulmonar.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Bc8Bf/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#98cbcb",
      size: "sm",
      icon: "pulmonology",
      stat: "79,8",
      unit: "persones/100.000",
      text: "Mortalitat per malalties respiratòries",
      label: "Mortalitat per malalties respiratòries",
      description:
        "Les malalties respiratòries són la tercera causa de mort a Catalunya. Inclouen les pneumònies, la grip i altres infeccions respiratòries, la malaltia pulmonar obstructiva crònica (MPOC), l'asma i les malalties intersticials del pulmó.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/u8DJN/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#98cbcb",
      size: "lg",
      icon: "network_intel_node",
      stat: "44,3",
      unit: "persones/100.000",
      text: "Mortalitat per malalties del sistema nerviós",
      label: "Mortalitat per malalties del sistema nerviós",
      description:
        "Les malalties del sistema nerviós inclouen les malalties neurodegeneratives, com l'Alzheimer, el Parkinson i l'esclerosi lateral amiotròfica (ELA), a més de l'esclerosi múltiple, l'epilèpsia i les meningitis.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/f6aTL/",
        height: 400,
      },
    },
    {
      id: 9,
      color: "#98cbcb",
      size: "sm",
      icon: "cognition",
      stat: "37,9",
      unit: "persones/100.000",
      text: "Mortalitat per trastorns mentals",
      label: "Mortalitat per trastorns mentals",
      description:
        "Les malalties mentals inclouen trastorns relacionats amb el consum d'alcohol i altres drogues, ansietat, depressió, esquizofrènia i altres trastorns psicòtics, trastorns del comportament i el desenvolupament, i alguns tipus específics de demències.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/rJ6j0/2/",
        height: 400,
      },
    },
    {
      id: 10,
      color: "#98cbcb",
      size: "lg",
      icon: "gastroenterology",
      stat: "36,6",
      unit: "persones/100.000",
      text: "Mortalitat per malalties de l'aparell digestiu",
      label: "Mortalitat per malalties de l'aparell digestiu",
      description:
        "Les malalties de l'aparell digestiu inclouen les malalties del fetge, com la cirrosi, les del pàncrees i la vesícula biliar, les d'esòfag i estómac, i les intestinals, entre altres.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/F8G5q/1/",
        height: 400,
      },
    },
    {
      id: 11,
      color: "#98cbcb",
      size: "sm",
      icon: "nest_eco_leaf",
      stat: "34,6",
      unit: "persones/100.000",
      text: "Mortalitat per causes externes",
      label: "Mortalitat per causes externes",
      description:
        "Les causes externes recullen morts degudes a accidents de trànsit, caigudes, ofegaments i asfíxies, intoxicacions accidentals i suïcidis, principalment.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Butpn/1/",
        height: 400,
      },
    },
  ];

  $: selected = bubbles.find((b) => b.id === selectedId) ?? null;
  // Una bombolla té detall quan té el gràfic de Datawrapper; el text
  // explicatiu és opcional i, si encara no hi és, simplement no es mostra.
  // Només les que tenen detall surten a la navegació.
  $: detailBubbles = bubbles.filter((b) => b.datawrapper);
  $: currentIframe = selected?.datawrapper ?? null;

  // Files de 3, 4 i 4 -- cada fila mesura
  // el que li demanen les seves pròpies bombolles i es centra per la seva
  // banda, igual que a Malalties/FactorsCausals. En mòbil, flex-wrap deixa
  // que una fila passi a 2 línies si no hi cap, en lloc d'encongir les
  // bombolles per sota de la seva mida real.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 7), bubbles.slice(7, 11)];

  let root;

  // Puja un nivell: del detall a la llista de bombolles i, des de la llista, al
  // menú de les quatre subseccions.
  function goBack() {
    if (selectedId !== null) selectedId = null;
    else onClose();
  }

  // En obrir el detall d'una bombolla (o canviar de bombolla) es mostra des de
  // l'inici del contingut, no des d'on s'estava fent scroll a la llista.
  $: if (selectedId !== null) showFromTop();

  async function showFromTop() {
    await tick();
    root?.scrollIntoView({ block: "start" });
  }

  onMount(() => {
    // En obrir la subseccio es veu el seu inici, no el scroll d'on veniem.
    root?.scrollIntoView({ block: "start" });

    // Nomes els nostres iframes: abans es recorria tot el document i aquest
    // listener redimensionava tambe els grafics d'altres seccions.
    const handleDatawrapperResize = (e) => {
      const heights = e.data["datawrapper-height"];
      if (!heights || !root) return;
      root.querySelectorAll("iframe").forEach((iframe) => {
        if (iframe.contentWindow === e.source) {
          for (const key in heights) {
            iframe.style.height = heights[key] + "px";
          }
        }
      });
    };

    window.addEventListener("message", handleDatawrapperResize);
    return () => window.removeEventListener("message", handleDatawrapperResize);
  });
</script>

<div
  bind:this={root}
  class="relative w-full scroll-mt-[var(--site-header-h)]"
  style="animation: componentFadeIn 800ms ease both;"
>
  <div class="flex flex-col pb-8">
    <SubsectionNav {prev} {next} />
    <!-- En mòbil, el botó de tornar va a l'esquerra del títol, sense empènyer
         el contingut cap avall; des de lg va a l'esquerra de la primera bombolla. -->
    <div
      class="flex items-center justify-center gap-3 px-4 pt-[var(--section-top-gap)] text-center"
    >
      <BackButton on:click={goBack} class="flex lg:hidden" />
      <div>
        <p
          class="font-inter text-base font-normal uppercase tracking-[1px] text-[#2E3A59]"
        >
          La salut de la població | Esperança de vida i mortalitat
        </p>
        {#if detailBubbles.length}
          <p
            class="text-xs font-normal uppercase tracking-[0.5px] text-[#828898] mt-1"
          >
            Clica a les bombolles per aprofundir
          </p>
        {/if}
      </div>
    </div>

    {#if selectedId === null}
      <div class="mt-8 flex flex-1 items-center justify-center">
        <div class="flex flex-col items-center gap-3 w-[min(700px,90vw)]">
          {#each rows as row, i}
            <div
              class="relative flex flex-wrap items-center justify-center gap-3"
            >
              {#if i === 0}
                <BackButton
                  on:click={onClose}
                  class="hidden lg:absolute lg:right-full lg:top-0 lg:mr-8 lg:flex"
                />
              {/if}
              {#each row as bubble}
                <Bubble
                  {bubble}
                  delay={500 + (bubble.id - 1) * 150}
                  onSelect={bubble.datawrapper
                    ? () => (selectedId = bubble.id)
                    : null}
                />
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div in:fade={{ duration: 100 }}>
        <div class="sticky z-30 py-2 px-4 mb-4">
          <div
            class="relative mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-3"
          >
            <BackButton
              on:click={() => (selectedId = null)}
              class="hidden lg:absolute lg:right-full lg:mr-8 lg:flex"
            />
            {#each detailBubbles as bubble}
              <div class="relative flex flex-col items-center">
                <button
                  on:click={() => selectBubble(bubble.id)}
                  on:mouseenter={() => (hoveredNavId = bubble.id)}
                  on:mouseleave={() => (hoveredNavId = null)}
                  class="rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style="
                width: 44px; height: 44px;
                background-color: {bubble.color};
                border: {selectedId === bubble.id
                    ? '2px solid #2e3a59'
                    : '2px solid transparent'};
              "
                >
                  <Icon
                    name={bubble.icon}
                    size={20}
                    color={bubble.textColor ?? "white"}
                  />
                </button>

                {#if hoveredNavId === bubble.id}
                  <div
                    transition:fade={{ duration: 150 }}
                    class="absolute top-full z-10 mt-2 hidden rounded-lg px-3 py-2 text-center lg:block"
                    style="min-width: 120px; max-width: 180px; background-color: rgba(255,255,255,0.6); backdrop-filter: blur(4px);"
                  >
                    <p class="font-inter text-xs font-medium text-[#2e3a59]">
                      {bubble.label}
                    </p>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <div
          class="container mx-auto px-4 py-8"
          style="opacity: {detailVisible
            ? 1
            : 0}; transition: opacity {detailVisible ? 1200 : 20}ms ease;"
        >
          <div class="mx-auto w-full max-w-[1400px]">
            <h2 class="font-inter text-xl font-bold text-[#2e3a59] mb-3">
              {selected?.label}
            </h2>
            <div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
              {#if currentIframe}
                <iframe
                  title={selected?.label}
                  src={currentIframe.src}
                  scrolling="no"
                  frameborder="0"
                  height={currentIframe.height}
                  class="w-full min-w-full border-none"
                  data-external="1"
                ></iframe>
              {/if}
              {#if selected?.description}
                <p
                  class="font-inter text-[15px] leading-relaxed text-[#2e3a59]"
                >
                  {selected.description}
                </p>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes -global-componentFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
