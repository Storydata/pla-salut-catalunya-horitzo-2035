<script>
  import Image from "$lib/assets/pla-salut-ilustracions-colors-nous-02c.jpg";
  import { tick } from "svelte";
  import Icon from "$lib/icons/Icon.svelte";
  import MortalitatBubbles from "./MortalitatBubbles.svelte";
  import MalatiesBubbles from "./MalatiesBubbles.svelte";
  import FactorsCausalsBubbles from "./FactorsCausalsBubbles.svelte";
  import LluitaDesigualtats from "./LluitaDesigualtats.svelte";

  // Ordre dels quatre botons: la navegacio lateral hi segueix.
  const subs = [
    { key: "mortalitat", label: "Esperança de vida i mortalitat" },
    { key: "malalties", label: "Les malalties" },
    { key: "factors", label: "Factors de risc i causals" },
    { key: "desigualtats", label: "Desigualtats i salut" },
  ];

  let activeSub = null;
  let menu;

  // Subseccio veina de l'activa (-1 anterior, +1 seguent) per a les fletxes.
  function neighbour(offset) {
    const target = subs[subs.findIndex((s) => s.key === activeSub) + offset];
    return target
      ? { label: target.label, onSelect: () => (activeSub = target.key) }
      : null;
  }

  // En tornar al menu es veu el seu inici, no el scroll de la subseccio.
  async function closeSub() {
    activeSub = null;
    await tick();
    menu?.scrollIntoView({ block: "start" });
  }
</script>

{#if activeSub === "mortalitat"}
  <MortalitatBubbles
    onClose={closeSub}
    prev={neighbour(-1)}
    next={neighbour(1)}
  />
{/if}

{#if activeSub === "malalties"}
  <MalatiesBubbles
    onClose={closeSub}
    prev={neighbour(-1)}
    next={neighbour(1)}
  />
{/if}

{#if activeSub === "factors"}
  <FactorsCausalsBubbles
    onClose={closeSub}
    prev={neighbour(-1)}
    next={neighbour(1)}
  />
{/if}

{#if activeSub === "desigualtats"}
  <LluitaDesigualtats
    onClose={closeSub}
    prev={neighbour(-1)}
    next={neighbour(1)}
  />
{/if}

<div
  bind:this={menu}
  class="relative w-full scroll-mt-[var(--site-header-h)]"
  class:hidden={activeSub !== null}
>
  <div class="pt-[var(--section-top-gap)] text-center">
    <p class="section-title">La salut de la població</p>
  </div>
  <div class="container mx-auto px-4">
    <div class="mb-[25px] flex justify-center">
      <img
        src={Image}
        alt="Il·lustració sobre la salut de la població de Catalunya"
        class="h-auto w-[70%] sm:w-[50%] lg:w-[36%]"
      />
    </div>

    <div class="mb-[12.5px] text-center">
      <p
        class="text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
      >
        Clica per veure més informació
      </p>
    </div>

    <div
      class="grid grid-cols-2 items-start justify-items-center gap-x-3 gap-y-6 md:flex md:flex-wrap md:justify-center md:gap-12 lg:gap-20"
    >
      <button
        on:click={() => (activeSub = "mortalitat")}
        class="group flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105 md:w-[160px]"
      >
        <div class="animate-pulse-slow relative mb-2 md:mb-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7] md:h-24 md:w-24"
          >
            <Icon
              name="leaf"
              class="h-6 w-6 text-[#26aaaa] md:h-10 md:w-10"
            />
          </div>
        </div>
        <h3
          class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]"
        >
          Esperança de vida i mortalitat
        </h3>
      </button>

      <button
        on:click={() => (activeSub = "malalties")}
        class="group flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105 md:w-[160px]"
      >
        <div class="animate-pulse-slow relative mb-2 md:mb-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7] md:h-24 md:w-24"
          >
            <Icon
              name="activity"
              class="h-6 w-6 text-[#ff8f68] md:h-10 md:w-10"
            />
          </div>
        </div>
        <h3
          class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]"
        >
          Les malalties
        </h3>
      </button>

      <button
        on:click={() => (activeSub = "factors")}
        class="group flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105 md:w-[160px]"
      >
        <div class="animate-pulse-slow relative mb-2 md:mb-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7] md:h-24 md:w-24"
          >
            <Icon
              name="search-check"
              class="h-6 w-6 text-[#5eebef] md:h-10 md:w-10"
            />
          </div>
        </div>
        <h3
          class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]"
        >
          Factors de risc i causals
        </h3>
      </button>

      <button
        on:click={() => (activeSub = "desigualtats")}
        class="group flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105 md:w-[160px]"
      >
        <div class="animate-pulse-slow relative mb-2 md:mb-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7] md:h-24 md:w-24"
          >
            <Icon
              name="user-round-group"
              class="h-6 w-6 text-[#7d4184] md:h-10 md:w-10"
            />
          </div>
        </div>
        <h3
          class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]"
        >
          Desigualtats i salut
        </h3>
      </button>
    </div>
  </div>
</div>
