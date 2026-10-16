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
      color: "#EA4D50",
      size: "sm",
      icon: "rheumatology",
      stat: "33,9%",
      text: "de la població adulta té dolor",
      label: "Dolor",
      description:
        "Aquest indicador mesura la proporció de persones adultes que manifesten patir dolor en la seva vida quotidiana, independentment de la causa que l'origina, i reflecteix un aspecte rellevant del benestar i la qualitat de vida de la població.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/66XcP/2/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#F6C3AE",
      size: "lg",
      icon: "cognition_2",
      stat: "17,5%",
      text: "de la població adulta té ansietat lleu",
      label: "Ansietat lleu",
      description:
        "L'ansietat és un estat de preocupació, nerviosisme o tensió que pot afectar el benestar emocional i el funcionament diari. Aquest indicador mesura la proporció de persones adultes que presenten símptomes lleus d'ansietat, com ara inquietud, preocupació excessiva o dificultat per relaxar-se.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/x0QnV/4/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#F19592",
      size: "sm",
      icon: "cognition_2",
      stat: "15,7%",
      text: "de la població adulta té depressió lleu",
      label: "Depressió lleu",
      description:
        "La depressió és un trastorn de l'estat d'ànim que pot provocar tristesa persistent, pèrdua d'interès per les activitats habituals i disminució del benestar emocional. Aquest indicador mesura la proporció de persones adultes que presenten símptomes lleus de depressió, com ara desànim, cansament o dificultats de concentració.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/tU5OG/2/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#FF9671",
      size: "lg",
      icon: "pulmonology",
      stat: "5,9%",
      text: "de les persones de 40 anys i més tenen malaltia pulmonar obstructiva crònica",
      label: "Malaltia pulmonar obstructiva crònica",
      description:
        "Aquest indicador mesura la proporció de persones de 40 anys o més que conviuen amb la malaltia pulmonar obstructiva crònica (MPOC), una malaltia que dificulta el pas de l'aire pels pulmons i provoca símptomes com falta d'aire, tos crònica i expectoració.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/GI9ir/1/",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#F19592",
      size: "sm",
      icon: "ITS",
      stat: "396,1",
      unit: "/ 100.000 hab.",
      text: "Incidència d'infeccions de transmissió sexual",
      label: "Infeccions de transmissió sexual",
      description:
        "Recull la taxa d'incidència de les principals infeccions de transmissió sexual a tot Catalunya (clamídia, infecció per gonococ, sífilis, limfogranuloma veneri i herpes simple)",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/McatE/1/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#FF9671",
      size: "lg",
      icon: "ecg_heart",
      stat: "294,1",
      unit: "/ 100.000 hab.",
      text: "Incidència de malaltia isquèmica del cor",
      label: "Malaltia isquèmica del cor",
      description:
        "La malaltia isquèmica del cor (també anomenada cardiopatia isquèmica) és la patologia que causa una obstrucció total o parcial de les artèries coronàries com a conseqüència de l'ateroesclerosi. És la segona causa a Catalunya de mortalitat evitable en els homes, i la quarta en les dones.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/O6qpQ/3/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#F19592",
      size: "sm",
      icon: "threat_intelligence",
      stat: "226,3",
      unit: "/ 100.000 hab.",
      text: "Incidència d'ictus",
      label: "Ictus",
      description:
        "L'ictus (o accident cerebrovascular) representa la quarta causa més freqüent de mortalitat evitable a Catalunya en els homes i la cinquena en les dones.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/rDGNZ/2/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#EA4D50",
      size: "lg",
      icon: "coronavirus",
      stat: "0,33",
      unit: "/ 100.000 hab.",
      text: "Incidència d'hepatitis\u00a0C", // espai dur: la C no queda sola
      label: "Hepatitis C",
      description:
        "La infecció per virus de l'hepatitis C és la causa d'un gran nombre de casos d'hepatitis aguda, hepatitis crònica, cirrosi, càncer de fetge i trasplantament hepàtic. Això comporta un elevat cost econòmic al sistema de salut, i el patiment i la reducció de l'esperança de vida de les persones afectades.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/otz8b/2/",
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

  // 3 files independents (3+3+2) en lloc de columnes d'una graella: cada
  // fila mesura el que li demanen les seves pròpies bombolles (que ja
  // tenen una mida fixa, `dim`) i es centra per la seva banda, així la fila
  // de 4 surt més ampla que les de 3 de dalt de manera natural -- sense cap
  // truc d'amplades proporcionals que obligui les bombolles a encongir-se.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 6), bubbles.slice(6, 8)];

  let root;

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
    <div class="px-4 pt-[var(--section-top-gap)] text-center">
      <p
        class="font-inter text-base font-normal uppercase tracking-[1px] text-[#2E3A59]"
      >
       La salut de la població | Les malalties
      </p>
      {#if detailBubbles.length}
        <p
          class="text-xs font-normal uppercase tracking-[0.5px] text-[#828898] mt-1"
        >
          Clica a les bombolles per aprofundir
        </p>
      {/if}
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
                  class="w-full md:absolute md:right-full md:top-0 md:mr-8 md:w-auto"
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
              class="w-full md:absolute md:right-full md:mr-8 md:w-auto"
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
