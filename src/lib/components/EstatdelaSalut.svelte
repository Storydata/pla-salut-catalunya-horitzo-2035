<script>
  import Image from "$lib/assets/pla-salut-ilustracions-colors-nous-02c.jpg";
  import Icon from "$lib/icons/Icon.svelte";
  import MortalitatBubbles from "./MortalitatBubbles.svelte";
  import MalatiesBubbles from "./MalatiesBubbles.svelte";
  import FactorsCausalsBubbles from "./FactorsCausalsBubbles.svelte";
  import LluitaDesigualtats from "./LluitaDesigualtats.svelte";

  let activeSub = null;
</script>

{#if activeSub === "mortalitat"}
  <MortalitatBubbles onClose={() => (activeSub = null)} />
{/if}

{#if activeSub === "malalties"}
  <MalatiesBubbles onClose={() => (activeSub = null)} />
{/if}

{#if activeSub === "factors"}
  <FactorsCausalsBubbles onClose={() => (activeSub = null)} />
{/if}

{#if activeSub === "desigualtats"}
  <LluitaDesigualtats onClose={() => (activeSub = null)} />
{/if}

<div class="relative w-full lg:min-h-[180vh]" class:hidden={activeSub !== null}>
  <div class="lg:sticky lg:top-[var(--site-header-h)] lg:z-10">
    <div class="pb-4 pt-[var(--section-top-gap)] text-center">
      <p class="section-title">La salut de la població</p>
    </div>
    <div class="container mx-auto px-4">
      <div class="mb-4 flex justify-center md:mb-6">
        <img
          src={Image}
          alt="Il·lustració sobre la salut de la població de Catalunya"
          class="h-auto w-[70%] sm:w-[50%] lg:w-[36%]"
        />
      </div>

      <div class="mb-3 text-center">
        <p
          class="text-[11px] font-normal uppercase tracking-[0.5px] text-[#828898]"
        >
          Clica per veure més informació
        </p>
      </div>

      <div
        class="grid grid-cols-2 items-start justify-items-center gap-x-3 gap-y-6 pt-4 md:flex md:flex-wrap md:justify-center md:gap-12 lg:gap-20"
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
                class="h-6 w-6 text-[#26aaaa] md:h-10 md:w-10"
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
                class="h-6 w-6 text-[#26aaaa] md:h-10 md:w-10"
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
                class="h-6 w-6 text-[#26aaaa] md:h-10 md:w-10"
              />
            </div>
          </div>
          <h3
            class="text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]"
          >
            Desigualtat i salut
          </h3>
        </button>
      </div>
    </div>
  </div>
</div>
