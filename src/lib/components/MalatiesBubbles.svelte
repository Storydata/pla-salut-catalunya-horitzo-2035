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
      color: "#EA4D50",
      size: "sm",
      icon: "pill-bottle",
      stat: "16%",
      text: "de catalans prenen psicofàrmacs crònicament",
      label: "Psicofàrmacs",
      description:
        "L'ús crònic de psicofàrmacs reflecteix la prevalença de trastorns mentals i emocionals a la població catalana. Aquests medicaments inclouen antidepressius, ansiolítics i altres tractaments per a la salut mental.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#F6C3AE",
      size: "lg",
      icon: "calendars",
      stat: "43%",
      text: "de catalans amb una o més malalties cròniques",
      label: "% de persones amb una o més malalties cròniques",
      description:
        "Les malalties cròniques són una de les principals causes de morbiditat i mortalitat a Catalunya. La prevalença de persones amb una o més malalties cròniques ha augmentat en les últimes dècades, reflectint l'envelliment de la població i els canvis en els estils de vida.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/FKqyk/1/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#F19592",
      size: "sm",
      icon: "glucose",
      stat: "590.000",
      text: "de catalans majors de 15 anys són diabètics",
      label: "Diabetis",
      description:
        "La diabetis és una malaltia crònica amb una prevalença creixent a Catalunya. El seu control adequat és essencial per prevenir complicacions greus com malalties cardiovasculars, nefropatia i retinopatia.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/r1TDM/1/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#FF9671",
      size: "lg",
      icon: "eye-dashed",
      stat: "158.213",
      text: "majors de 65 anys pateixen degeneració macular",
      label: "Degeneració macular",
      description:
        "La degeneració macular és una de les principals causes de pèrdua de visió en persones grans. La detecció precoç i el tractament adequat són fonamentals per prevenir la pèrdua de visió evitable.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/UP3ms/1/",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#F19592",
      size: "sm",
      icon: "alert-circle",
      stat: "5,8%",
      text: "dels catalans amb depressió moderada o greu",
      label: "Depressió",
      description:
        "La depressió és un problema de salut mental que afecta milions de persones. Les estratègies de prevenció, detecció precoç i tractament adequat són prioritàries per millorar el benestar emocional de la població.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/keO3A/1/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#FF9671",
      size: "lg",
      icon: "heart-pulse",
      stat: "30%",
      text: "dels catalans amb la pressió arterial alta",
      label: "Hipertensió arterial",
      description:
        "La hipertensió arterial és un factor de risc cardiovascular major. El seu control és fonamental per prevenir infarts de miocardi, ictus i altres complicacions cardiovasculars i renals.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/Ww29m/1/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#F19592",
      size: "sm",
      icon: "stethoscope",
      stat: "5-20%",
      text: "dels catalans tenen el colesterol molt alt",
      label: "Hiperlipidèmia/Hipercolesterolèmia",
      description:
        "Els nivells elevats de colesterol i altres lípids en sang són factors de risc per a malalties cardiovasculars. La modificació d'hàbits de vida i el tractament farmacològic adequat són claus per al seu control.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/RgIV0/1/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#EA4D50",
      size: "lg",
      icon: "shield-plus",
      stat: "78,6%",
      text: "de catalans tenen una percepció positiva de la seva salut",
      label: "Autopercepció de salut",
      description:
        "L'autopercepció de salut és un indicador subjectiu però molt rellevant que reflecteix com les persones avaluen el seu propi estat de salut. Aquest indicador està relacionat amb la morbiditat, la mortalitat i la utilització dels serveis sanitaris.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/gG0SF/1/",
        height: 400,
      },
    },
    {
      id: 9,
      color: "#F6C3AE",
      size: "sm",
      icon: "ear",
      stat: "274.000",
      text: "persones amb dificultats auditives significatives",
      label: "Sordesa",
      description:
        "Les limitacions auditives afecten la comunicació i la qualitat de vida de les persones. La detecció precoç, especialment en població infantil i gent gran, permet intervencions efectives per millorar la capacitat auditiva.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/ydh5l/1/",
        height: 400,
      },
    },
    {
      id: 10,
      color: "#EA4D50",
      size: "lg",
      icon: "mouth",
      stat: "34.522",
      text: "nous casos d'infeccions de transmissió sexual",
      label: "Infeccions de transmissió sexual",
      description:
        "Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva. Text simulat pendent de versió definitiva",
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
        Estat de la salut | Les malalties
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
