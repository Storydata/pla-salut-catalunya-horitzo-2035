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
      color: "#e5fbfe",
      textColor: "#262626",
      size: "sm",
      icon: "directions_bike",
      stat: "33,4%",
      text: "de la població infantil té un estil d'oci actiu",
      label: "Estil d'oci actiu en la població infantil",
      description:
        "L'activitat física durant el temps lliure contribueix al desenvolupament i la salut dels infants. Aquest indicador mesura la proporció d'infants que realitzen activitats d'oci actives de manera habitual.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/AnNT5/1/",
        height: 400,
      },
    },
    {
      id: 2,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "lg",
      icon: "breastfeeding",
      stat: "54,3%",
      text: "de nadons amb lactància materna exclusiva als 6 mesos",
      label: "Lactància materna exclusiva als 6 mesos",
      description:
        "La lactància materna és una de les intervencions més efectives per promoure la salut infantil i materna. Aquest indicador mesura la proporció de nadons que s'alimenten només amb llet materna durant els primers 6 mesos de vida.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/ed1aD/1/",
        height: 400,
      },
    },
    {
      id: 3,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "sm",
      icon: "apple",
      stat: "8,4%",
      text: "de la població infantil consumeix cinc racions de fruita i/o verdura",
      label: "Consum diari de cinc racions de fruita i/o verdura en la població infantil",
      description:
        "El consum recomanat de fruites i verdures és un dels principals indicadors d'una alimentació saludable. Aquest indicador mesura la proporció d'infants que consumeixen almenys cinc racions de fruita i/o verdura al dia.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/DgJ7h/3/",
        height: 400,
      },
    },
    {
      id: 4,
      color: "#5eebef",
      textColor: "#262626",
      size: "lg",
      icon: "gauge",
      stat: "34%",
      text: "de la població infantil té excés de pes",
      label: "Excés de pes en la població infantil",
      description:
        "L'excés de pes inclou el sobrepès i l'obesitat, mesurats per l'índex de massa corporal (IMC) superior a 25. Aquest indicador mesura la proporció d'infants amb un pes superior al considerat saludable per a la seva edat i sexe.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/25lGT/2/",
        height: 400,
      },
    },
    {
      id: 5,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "lunch_dining",
      stat: "35,4%",
      text: "de la població infantil consumeix aliments alts en sucres, greixos no saludables i sal",
      label: "Consum d'aliments alts en sucres, greixos no saludables i sal en la població infantil",
      description:
        "Aquest indicador mesura la proporció d'infants que consumeixen habitualment productes amb un alt contingut de sucres, greixos no saludables o sal. El consum freqüent d'aquests aliments s'associa a un major risc de problemes de salut que poden persistir en l'edat adulta.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/CfFJM/2/",
        height: 400,
      },
    },
    {
      id: 6,
      color: "#5eebef",
      textColor: "#262626",
      size: "lg",
      icon: "vaping_rooms",
      stat: "12,9% i 14,8%",
      text: "dels nois i noies de 4t d'ESO fumen cigarretes electròniques",
      label: "Cigarretes electròniques en l'alumnat de 2n i 4t d'ESO",
      description:
        "El tabac i l'alcohol continuen sent dos dels principals factors de risc evitables per a la salut a Catalunya, i les cigarretes electròniques són una de les formes més freqüents de consum de nicotina entre adolescents. Aquest indicador mesura la proporció d'alumnes de 4t d'ESO que en consumeixen.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/G346a/2/",
        height: 400,
      },
    },
    {
      id: 7,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "sports_bar",
      stat: "14,8% i 17,0%",
      text: "dels nois i noies de 4t d'ESO amb consum de risc d'alcohol",
      label: "Consum de risc d'alcohol en l'alumnat de 2n i 4t d'ESO",
      description:
        "El tabac i l'alcohol continuen sent dos dels principals factors de risc evitables per a la salut a Catalunya, i el consum d'alcohol durant l'adolescència pot tenir greus efectes negatius sobre la salut i el desenvolupament. Aquest indicador mesura la proporció d'alumnes de 4t d'ESO amb un patró de consum considerat de risc.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/EJJAu/4/",
        height: 400,
      },
    },
    {
      id: 8,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "lg",
      icon: "hiking",
      stat: "38,7%",
      text: "de la població adulta realitza activitat física (OMS)",
      label: "Activitat física recomanada per l'OMS en la població adulta",
      description:
        "L'activitat física regular contribueix a prevenir nombrosos problemes de salut. Aquest indicador mesura la proporció de persones adultes que compleixen les recomanacions d'activitat física de l'Organització Mundial de la Salut.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/yHP2I/2/",
        height: 400,
      },
    },
    {
      id: 9,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "cognition_2",
      stat: "11,8%",
      text: "de la població adulta presenta baix benestar emocional",
      label: "Baix benestar emocional en la població adulta",
      description:
        "El benestar emocional és una dimensió fonamental de la salut mental, i un dels principals reptes de salut pública a Catalunya. Aquest indicador mesura la proporció de persones adultes que presenten un baix nivell de benestar emocional, que pot conduir a trastorns d'ansietat i depressió.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/9BnKn/2/",
        height: 400,
      },
    },
    {
      id: 10,
      color: "#5eebef",
      textColor: "#262626",
      size: "lg",
      icon: "smoking_rooms",
      stat: "20,6%",
      text: "de la població adulta fuma tabac",
      label: "Consum tabac (15 anys i més)",
      description:
        "El tabac és el primer factor de risc de malaltia i mortalitat prematura a Catalunya, i una de les principals prioritats del Pla de Salut. Aquest indicador mesura la proporció de persones adultes que fumen.",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/zEGUC/2/",
        height: 400,
      },
    },
    {
      id: 11,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "gauge",
      stat: "54,3%",
      text: "de la població adulta té excés de pes",
      label: "Excés de pes en la població adulta",
      description:
        "L'excés de pes inclou el sobrepès i l'obesitat, mesurats per l'índex de massa corporal (IMC) superior a 25. Aquest indicador mesura la proporció de persones adultes amb un pes superior al considerat saludable, un factor associat a diverses malalties cròniques",
      datawrapper: {
        src: "https://datawrapper.dwcdn.net/kHr47/4/",
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

  // 3 files independents (3+4+4) en lloc de columnes d'una graella: cada
  // fila mesura el que li demanen les seves pròpies bombolles (que ja
  // tenen una mida fixa, `dim`) i es centra per la seva banda, així la fila
  // de 4 surt més ampla que les de 3 de dalt de manera natural -- sense cap
  // truc d'amplades proporcionals que obligui les bombolles a encongir-se.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 7), bubbles.slice(7, 11)];

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
        La salut de la població | Factors causals i de risc
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
