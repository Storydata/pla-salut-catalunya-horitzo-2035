<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

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
      color: "#2E3A59",
      size: "sm",
      icon: "baby",
      stat: "55%",
      text: "de lactància materna als 6 mesos",
      label: "Lactància materna",
      description:
        "Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/FKqyk/1/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#828898",
      size: "lg",
      icon: "can-soda",
      stat: "17%",
      text: "dels adults consumeixen begudes ensucrades",
      label: "Alimentació poc saludable en adults",
      description:
        "Una dieta desequilibrada amb excés de greixos saturats, sucres i sal és un factor de risc per a malalties cròniques. Promoure una alimentació equilibrada és clau.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#2E3A59",
      size: "sm",
      icon: "gauge",
      stat: "54,3%",
      text: "de les persones adultes tenen excés de pes",
      label: "Excés de pes en adults",
      description:
        "L'excés de pes és un factor de risc important per a múltiples malalties cròniques. Una alimentació saludable i l'activitat física són fonamentals per prevenir i controlar l'obesitat.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/UP3ms/1/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#828898",
      size: "lg",
      icon: "bike",
      stat: "39%",
      text: "d'adults fa activitat física recomanada per l'OMS",
      label: "Activitat física en adults",
      description:
        "Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/r1TDM/1/",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#2E3A59",
      size: "sm",
      icon: "cigarette-off",
      stat: "21%",
      text: "de les persones adultes fuma",
      label: "Tabaquisme en adults",
      description:
        "El tabaquisme és un dels principals factors de risc per a la salut, associat a malalties cardiovasculars, respiratòries i càncer. Les polítiques de prevenció i cessació tabàquica són prioritàries.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/keO3A/1/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#828898",
      size: "lg",
      icon: "face-expressionless",
      stat: "12%",
      text: "d'adults amb baix benestar emocional",
      label: "Benestar emocional en adults",
      description:
        "Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Ww29m/1/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#26AAAA",
      size: "sm",
      icon: "hamburger",
      stat: "33%",
      text: "menors d'edat amb alimentació alta en greixos no saludables, sucres i sal",
      label: "Alimentació poc saludable en infants i adolescents",
      description:
        "Una dieta desequilibrada amb excés de greixos saturats, sucres i sal és un factor de risc per a malalties cròniques. Promoure una alimentació equilibrada és clau.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/RgIV0/1/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#7DCCCC",
      size: "lg",
      icon: "moon-star",
      stat: "25%",
      text: "menors d'edat no dormen les hores recomanades",
      label: "Hores de son en infants i adolescents",
      description:
        "Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/ydh5l/1/",
        height: 400,
      },
    },
    {
      id: 9,
      color: "#26AAAA",
      size: "sm",
      icon: "vape_free",
      stat: "14%",
      text: "d'adolescents fuma cigarretes electròniques",
      label: "Consum de cigarretes electròniques en adolescents",
      description:
        "El tabaquisme és un dels principals factors de risc per a la salut, associat a malalties cardiovasculars, respiratòries i càncer. Les polítiques de prevenció i cessació tabàquica són prioritàries.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
    {
      id: 10,
      color: "#7DCCCC",
      size: "lg",
      icon: "beer-off",
      stat: "16%",
      text: "d'adolescents té un consum de risc d'alcohol",
      label: "Consum d'alcohol en adolescents",
      description:
        "El consum excessiu d'alcohol és un factor de risc important per a la salut física i mental. La promoció del consum responsable i la prevenció de l'alcoholisme són essencials.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
  ];

  $: selected = bubbles.find((b) => b.id === selectedId) ?? null;
  $: currentIframe = selected?.datawrapper ?? null;

  // 3 files independents (3+3+4) en lloc de columnes d'una graella: cada
  // fila mesura el que li demanen les seves pròpies bombolles (que ja
  // tenen una mida fixa, `dim`) i es centra per la seva banda, així la fila
  // de 4 surt més ampla que les de 3 de dalt de manera natural -- sense cap
  // truc d'amplades proporcionals que obligui les bombolles a encongir-se.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 6), bubbles.slice(6, 10)];

  let root;

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
  class="relative w-full lg:min-h-[180vh]"
  style="animation: componentFadeIn 800ms ease both;"
>
  <div class="flex flex-col py-8 lg:sticky lg:top-[var(--site-header-h)] lg:z-10">
    <div class="relative mb-8 px-4 pt-[var(--section-top-gap)] text-center">
      <p
        class="font-inter text-base font-normal uppercase tracking-[1px] text-[#2E3A59]"
      >
        La salut de la població | Factors causals i de risc
      </p>
      <p
        class="text-xs font-normal uppercase tracking-[0.5px] text-[#828898] mt-1"
      >
        Clica a les bombolles per aprofundir
      </p>
      <button
        on:click={onClose}
        class="absolute right-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 lg:top-24"
      >
        <Icon name="x" size={24} />
      </button>
    </div>

    {#if selectedId === null}
      <div class="flex justify-center items-center flex-1">
        <div class="flex flex-col items-center gap-3 w-[min(700px,90vw)]">
          {#each rows as row}
            <div class="flex justify-center items-center gap-3 flex-wrap">
              {#each row as bubble}
                <Bubble
                  {bubble}
                  delay={500 + (bubble.id - 1) * 150}
                  onSelect={() => (selectedId = bubble.id)}
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
            {#each bubbles as bubble}
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
                  <Icon name={bubble.icon} size={20} color="white" />
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
              <p class="font-inter text-[15px] leading-relaxed text-[#2e3a59]">
                {selected?.description}
              </p>
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
