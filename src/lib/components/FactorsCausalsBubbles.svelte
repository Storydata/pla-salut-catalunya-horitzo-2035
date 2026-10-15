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
      color: "#e5fbfe",
      textColor: "#262626",
      size: "sm",
      icon: "baby",
      stat: "54,6%",
      text: "de nadons amb lactància materna exclusiva als 6 mesos",
      label: "Lactància materna exclusiva als 6 mesos",
    },
    {
      id: 2,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "lg",
      icon: "apple",
      stat: "8,4%",
      text: "de la població infantil consumeix cinc racions de fruita i/o verdura",
      label: "Població infantil amb consum diari de fruita i/o verdura",
    },
    {
      id: 3,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "sm",
      icon: "hamburger",
      stat: "35,4%",
      text: "de la població infantil consumeix aliments alts en sucres, greixos no saludables i sal",
      label: "Població infantil amb consum d'aliments alts en sucres, greixos i sal",
    },
    {
      id: 4,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "lg",
      icon: "gauge",
      stat: "34%",
      text: "de la població infantil té excés de pes",
      label: "Població infantil amb excés de pes",
    },
    {
      id: 5,
      color: "#e5fbfe",
      textColor: "#262626",
      size: "sm",
      icon: "activity",
      stat: "33,4%",
      text: "de la població infantil té un estil d'oci actiu",
      label: "Població infantil amb oci actiu",
    },
    {
      id: 6,
      color: "#b3f7fe",
      textColor: "#262626",
      size: "lg",
      icon: "vape_free",
      stat: "12,9% i 14,8%",
      text: "dels nois i noies de 4t d'ESO fumen cigarretes electròniques",
      label: "Consum de cigarretes electròniques a 4t d'ESO",
    },
    {
      id: 7,
      color: "#b3f7fe",
      textColor: "#262626",
      size: "sm",
      icon: "beer-off",
      stat: "14,8% i 17,0%",
      text: "dels nois i noies de 4t d'ESO amb consum de risc d'alcohol",
      label: "Consum de risc d'alcohol a 4t d'ESO",
    },
    {
      id: 8,
      color: "#5eebef",
      textColor: "#262626",
      size: "lg",
      icon: "gauge",
      stat: "54,3%",
      text: "de la població adulta té excés de pes",
      label: "Població adulta amb excés de pes",
    },
    {
      id: 9,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "bike",
      stat: "38,7%",
      text: "de la població adulta realitza l'activitat física (OMS)",
      label: "Població adulta amb activitat física recomanada",
    },
    {
      id: 10,
      color: "#5eebef",
      textColor: "#262626",
      size: "lg",
      icon: "cigarette-off",
      stat: "20,6%",
      text: "de la població adulta fuma tabac",
      label: "Població adulta que consumeix tabac",
    },
    {
      id: 11,
      color: "#5eebef",
      textColor: "#262626",
      size: "sm",
      icon: "face-expressionless",
      stat: "11,8%",
      text: "de la població adulta presenta baix benestar emocional",
      label: "Població adulta amb baix benestar emocional",
    },
  ];

  $: selected = bubbles.find((b) => b.id === selectedId) ?? null;
  // Només les que tenen detall (descripció i gràfic) surten a la navegació.
  $: detailBubbles = bubbles.filter((b) => b.description);
  $: currentIframe = selected?.datawrapper ?? null;

  // 3 files independents (3+4+4) en lloc de columnes d'una graella: cada
  // fila mesura el que li demanen les seves pròpies bombolles (que ja
  // tenen una mida fixa, `dim`) i es centra per la seva banda, així la fila
  // de 4 surt més ampla que les de 3 de dalt de manera natural -- sense cap
  // truc d'amplades proporcionals que obligui les bombolles a encongir-se.
  $: rows = [bubbles.slice(0, 3), bubbles.slice(3, 7), bubbles.slice(7, 11)];

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
      {#if bubbles.some((b) => b.description)}
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
      <div class="flex justify-center items-center flex-1">
        <div class="flex flex-col items-center gap-3 w-[min(700px,90vw)]">
          {#each rows as row}
            <div class="flex justify-center items-center gap-3 flex-wrap">
              {#each row as bubble}
                <Bubble
                  {bubble}
                  delay={500 + (bubble.id - 1) * 150}
                  onSelect={bubble.description
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
