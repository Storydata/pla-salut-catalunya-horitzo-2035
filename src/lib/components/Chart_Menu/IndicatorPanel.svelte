<script>
  import Icon from "$lib/icons/Icon.svelte";
  export let selectedCategory = null; // Eix: { icon, label }
  export let selectedItem = null; // { parentLabel?, label, descripcio? }
  export let categoryLabel = "EIX";
  export let parentLabel = "ÀMBIT";
  export let itemLabel = "OBJECTIU";
  export let goBackToCategories = () => {};
  // Si es passa, el bloc icona+categoryLabel es converteix en un botó (amb
  // l'efecte de creixement que ja fem servir a altres botons) que hi porta.
  // Si no es passa, es queda com a text no interactiu.
  export let onGoUpOneLevel = null;

  $: hasSelection = selectedCategory && selectedItem;
</script>

{#if hasSelection}
  <button
    on:click={goBackToCategories}
    class="mt-2 mr-5 flex flex-col items-start gap-1 text-left text-[#8B898E]"
  >
    <Icon name="corner-up-left" class="h-5 w-5 flex-shrink-0" />
    <span class="text-xs">
      TORNAR<br />ALS EIXOS
    </span>
  </button>

  <!-- Fila superior (EIX + LÍNIA) i INTERVENCIÓ són fills d'aquest mateix
       contenidor en columna -- INTERVENCIÓ va sempre a sota per estructura,
       no perquè "desbordi" la fila de dalt. -->
  <div class="flex min-w-0 flex-1 flex-col gap-2 p-2">
    <div class="flex flex-wrap items-center gap-4">
      {#if onGoUpOneLevel}
        <button
          type="button"
          on:click={onGoUpOneLevel}
          class="flex items-center gap-4 text-left transition-transform hover:scale-105"
        >
          {#if selectedCategory.iconColor}
            <div
              class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F7]"
            >
              <Icon
                name={selectedCategory.icon}
                class="h-7 w-7"
                color={selectedCategory.iconColor}
                strokeWidth={1.75}
              />
            </div>
          {:else}
            <img
              src={selectedCategory.icon}
              alt={selectedCategory.label}
              class="h-16 w-16 flex-shrink-0"
            />
          {/if}
          <div class="flex flex-col gap-1">
            <p
              class="font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
            >
              {categoryLabel}
            </p>
            <p
              class="max-w-[140px] font-['Inter',sans-serif] text-[12px] leading-[1.25] text-[#2E3A59] md:max-w-[160px] md:text-[14px] md:leading-[1.3]"
            >
              {selectedCategory.label}
            </p>
          </div>
        </button>
      {:else}
        <div class="flex items-center gap-4 text-left">
          {#if selectedCategory.iconColor}
            <div
              class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F7]"
            >
              <Icon
                name={selectedCategory.icon}
                class="h-7 w-7"
                color={selectedCategory.iconColor}
                strokeWidth={1.75}
              />
            </div>
          {:else}
            <img
              src={selectedCategory.icon}
              alt={selectedCategory.label}
              class="h-16 w-16 flex-shrink-0"
            />
          {/if}
          <div class="flex flex-col gap-1">
            <p
              class="font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
            >
              {categoryLabel}
            </p>
            <p
              class="max-w-[140px] font-['Inter',sans-serif] text-[12px] leading-[1.25] text-[#2E3A59] md:max-w-[160px] md:text-[14px] md:leading-[1.3]"
            >
              {selectedCategory.label}
            </p>
          </div>
        </div>
      {/if}

      {#if selectedItem.parentLabel}
        <div class="w-px self-stretch bg-[#D6D8DE]" aria-hidden="true" />

        <div class="flex flex-col gap-1">
          <p
            class="font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
          >
            {parentLabel}
          </p>
          <p
            class="font-['Inter',sans-serif] text-[12px] leading-[1.25] text-[#2E3A59] md:text-[14px] md:leading-[1.3]"
          >
            {selectedItem.parentLabel}
          </p>
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-2">
      <p
        class="font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
      >
        {itemLabel}
      </p>
      <p
        class="font-['Inter',sans-serif] text-[20px] font-bold leading-[1.2] text-[#2E3A59] md:text-[24px]"
      >
        {selectedItem.label}
      </p>

      {#if selectedItem.descripcio}
        <!-- Text explicatiu opcional (p. ex. l'Indicador objectiu de salut),
             mateix estil que "Evolució i estructura per edat i sexe". -->
        <p
          class="font-['Inter',sans-serif] text-lg font-semibold leading-[1.4] text-[#2E3A59]"
        >
          {selectedItem.descripcio}
        </p>
      {/if}
    </div>
  </div>
{/if}
