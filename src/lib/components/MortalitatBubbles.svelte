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
      color: "#6E467D",
      size: "sm",
      icon: "leaf",
      stat: "8,2‰",
      text: "taxa de mortalitat a Catalunya",
      label: "Mortalitat general",
      description:
        "La taxa de mortalitat general reflecteix l'estat de salut de la població i l'eficàcia del sistema sanitari. Els avenços en medicina i salut pública han contribuït a reduir la mortalitat en les últimes dècades.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/FKqyk/1/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#CEC4FF",
      size: "lg",
      icon: "heart-pulse",
      stat: "28%",
      text: "de morts per malalties cardiovasculars",
      label: "Malalties cardiovasculars",
      description:
        "Les malalties cardiovasculars són la principal causa de mort a Catalunya. La prevenció i el control dels factors de risc són essencials per reduir la mortalitat per aquestes malalties.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#6E467D",
      size: "sm",
      icon: "microscope",
      stat: "27%",
      text: "de morts per càncer",
      label: "Càncer",
      description:
        "El càncer és la segona causa de mort a Catalunya. La detecció precoç i els avenços en tractaments han millorat la supervivència, però segueix sent un repte important de salut pública.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/UP3ms/1/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#AC8FB3",
      size: "lg",
      icon: "brain",
      stat: "8%",
      text: "de morts per malalties neuro-\ndegeneratives",
      label: "Malalties neurodegeneratives",
      description:
        "Les malalties neurodegeneratives, com l'Alzheimer i el Parkinson, tenen una prevalença creixent amb l'envelliment de la població i són una causa important de mortalitat i discapacitat.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/keO3A/1/",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#FCC5F8",
      size: "sm",
      icon: "pulmonology",
      stat: "10%",
      text: "de morts per malalties respiratòries",
      label: "Malalties respiratòries",
      description:
        "Les malalties respiratòries cròniques són una causa important de mortalitat, especialment en persones grans i fumadores. La qualitat de l'aire i els hàbits de vida influeixen en la seva prevalença.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/r1TDM/1/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#AC8FB3",
      size: "lg",
      icon: "glucose",
      stat: "3%",
      text: "de morts relacionades amb diabetis",
      label: "Diabetis",
      description:
        "La diabetis és una causa de mortalitat significativa, sovint associada a complicacions cardiovasculars i renals. El control adequat de la malaltia és clau per prevenir la mortalitat prematura.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Ww29m/1/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#CEC4FF",
      size: "sm",
      icon: "triangle-alert",
      stat: "4%",
      text: "de morts per causes externes",
      label: "Causes externes",
      description:
        "Les causes externes inclouen accidents, suïcidis i altres morts violentes. La prevenció d'accidents i la promoció de la salut mental són estratègies clau per reduir aquesta mortalitat.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/RgIV0/1/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#6E467D",
      size: "lg",
      icon: "sprout",
      stat: "2,3‰",
      text: "taxa de mortalitat infantil",
      label: "Mortalitat infantil",
      description:
        "La taxa de mortalitat infantil és un indicador clau de la qualitat del sistema de salut. Catalunya té una de les taxes més baixes del món gràcies a l'atenció perinatal i pediàtrica de qualitat.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/ydh5l/1/",
        height: 400,
      },
    },
  ];

  $: selected = bubbles.find((b) => b.id === selectedId) ?? null;
  $: currentIframe = selected?.datawrapper ?? null;

  // 2 files de 3 (6+8 inclosos) i una tercera fila de 2 -- cada fila mesura
  // el que li demanen les seves pròpies bombolles i es centra per la seva
  // banda, igual que a Malalties/FactorsCausals. En mòbil, flex-wrap deixa
  // que una fila passi a 2 línies si no hi cap, en lloc d'encongir les
  // bombolles per sota de la seva mida real.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 6), bubbles.slice(6, 8)];

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
        Estat de la salut | Esperança de vida i mortalitat
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
        <div class="flex flex-col items-center gap-3 w-[min(600px,90vw)]">
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
