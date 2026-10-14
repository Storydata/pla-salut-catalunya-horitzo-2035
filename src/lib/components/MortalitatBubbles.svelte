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
      color: "#26aaaa",
      size: "sm",
      icon: "baby",
      stat: "84,43",
      unit: "anys",
      text: "Esperança de vida en néixer",
      label: "Esperança de vida en néixer",
    },
    {
      id: 2,
      color: "#26aaaa",
      size: "lg",
      icon: "shield-plus",
      stat: "68",
      unit: "anys",
      text: "Esperança de vida amb bona salut al néixer",
      label: "Esperança de vida amb bona salut al néixer",
    },
    {
      id: 3,
      color: "#26aaaa",
      size: "sm",
      icon: "elderly_woman",
      stat: "12,23",
      unit: "anys",
      text: "Esperança de vida amb bona salut als 65 anys",
      label: "Esperança de vida amb bona salut als 65 anys",
    },
    {
      id: 4,
      color: "#98cbcb",
      size: "lg",
      icon: "users",
      stat: "730,7",
      unit: "persones/100.000",
      text: "Mortalitat per totes les causes",
      label: "Mortalitat per totes les causes",
    },
    {
      id: 5,
      color: "#98cbcb",
      size: "sm",
      icon: "pulmonology",
      stat: "46,6",
      unit: "persones/100.000",
      text: "Mortalitat per càncer de pulmó",
      label: "Mortalitat per càncer de pulmó",
    },
    {
      id: 6,
      color: "#98cbcb",
      size: "lg",
      icon: "heart-pulse",
      stat: "38,3",
      unit: "persones/100.000",
      text: "Mortalitat per malalties isquèmiques del cor",
      label: "Mortalitat per malalties isquèmiques del cor",
    },
    {
      id: 7,
      color: "#98cbcb",
      size: "sm",
      icon: "brain",
      stat: "35,8",
      unit: "persones/100.000",
      text: "Mortalitat per demències",
      label: "Mortalitat per demències",
    },
    {
      id: 8,
      color: "#98cbcb",
      size: "lg",
      icon: "stethoscope",
      stat: "35,6",
      unit: "persones/100.000",
      text: "Mortalitat per la resta de malalties del cor",
      label: "Mortalitat per la resta de malalties del cor",
    },
    {
      id: 9,
      color: "#98cbcb",
      size: "sm",
      icon: "hospital",
      stat: "33,7",
      unit: "persones/100.000",
      text: "Mortalitat per malalties del ronyó",
      label: "Mortalitat per malalties del ronyó",
    },
    {
      id: 10,
      color: "#98cbcb",
      size: "lg",
      icon: "activity",
      stat: "29,4",
      unit: "persones/100.000",
      text: "Mortalitat per insuficiència cardíaca",
      label: "Mortalitat per insuficiència cardíaca",
    },
  ];

  $: selected = bubbles.find((b) => b.id === selectedId) ?? null;
  $: currentIframe = selected?.datawrapper ?? null;

  // 2 files de 3 i una tercera de 4 -- cada fila mesura
  // el que li demanen les seves pròpies bombolles i es centra per la seva
  // banda, igual que a Malalties/FactorsCausals. En mòbil, flex-wrap deixa
  // que una fila passi a 2 línies si no hi cap, en lloc d'encongir les
  // bombolles per sota de la seva mida real.
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
        La salut de la població | Esperança de vida i mortalitat
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
