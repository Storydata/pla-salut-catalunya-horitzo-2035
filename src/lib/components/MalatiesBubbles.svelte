<script>
  import { fade } from "svelte/transition";
  import { onMount, tick } from "svelte";

  import Icon from "$lib/icons/Icon.svelte";
  import Bubble from "./Bubble.svelte";

  export let onClose = () => {};

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
      label: "Població adulta amb dolor",
    },
    {
      id: 2,
      color: "#F6C3AE",
      size: "lg",
      icon: "cognition_2",
      stat: "17,5%",
      text: "de la població adulta té ansietat lleu",
      label: "Població adulta amb ansietat lleu",
    },
    {
      id: 3,
      color: "#F19592",
      size: "sm",
      icon: "cognition_2",
      stat: "15,7%",
      text: "de la població adulta té depressió lleu",
      label: "Població adulta amb depressió lleu",
    },
    {
      id: 4,
      color: "#FF9671",
      size: "lg",
      icon: "pulmonology",
      stat: "5,9%",
      text: "de les persones de 40 anys i més tenen malaltia pulmonar obstructiva crònica",
      label: "Malaltia pulmonar obstructiva crònica (40 anys i més)",
    },
    {
      id: 5,
      color: "#F19592",
      size: "sm",
      icon: "mouth",
      stat: "396,1",
      unit: "persones/100.000",
      text: "Incidència d'infeccions de transmissió sexual",
      label: "Incidència d'infeccions de transmissió sexual",
    },
    {
      id: 6,
      color: "#FF9671",
      size: "lg",
      icon: "ecg_heart",
      stat: "294,1",
      unit: "persones/100.000",
      text: "Incidència de malaltia isquèmica del cor",
      label: "Incidència de malaltia isquèmica del cor",
    },
    {
      id: 7,
      color: "#F19592",
      size: "sm",
      icon: "threat_intelligence",
      stat: "226,3",
      unit: "persones/100.000",
      text: "Incidència d'ictus",
      label: "Incidència d'ictus",
    },
    {
      id: 8,
      color: "#EA4D50",
      size: "lg",
      icon: "coronavirus",
      stat: "0,33",
      unit: "persones/100.000",
      text: "Incidència d'hepatitis C",
      label: "Incidència d'hepatitis C",
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
    <div class="relative px-4 pt-[var(--section-top-gap)] text-center">
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
      <button
        on:click={onClose}
        class="absolute right-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 lg:top-24"
      >
        <Icon name="x" size={24} />
      </button>
    </div>

    {#if selectedId === null}
      <div class="mt-8 flex flex-1 items-center justify-center">
        <div class="flex flex-col items-center gap-3 w-[min(700px,90vw)]">
          {#each rows as row}
            <div class="flex justify-center items-center gap-3 flex-wrap">
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
          <div class="flex items-center justify-center gap-3 flex-wrap">
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
