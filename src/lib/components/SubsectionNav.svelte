<script>
  import Icon from "$lib/icons/Icon.svelte";

  // Navegació lateral entre les subseccions de "La salut de la població":
  // { label, onSelect } de l'anterior i de la següent (null si no n'hi ha).
  export let prev = null;
  export let next = null;
</script>

<!-- Fins a lg, les fletxes van a les cantonades de la capçalera (no hi ha
     lloc als costats). Des de lg, aquest contenidor de 0 d'alcada es queda
     fix al centre vertical de la pantalla (sota el menú) mentre es fa scroll
     per la subseccio i les fletxes hi queden centrades. -->
<div
  class="h-0 lg:sticky lg:top-[calc(50%+var(--site-header-h)/2)] lg:z-20"
>
{#if prev}
  <button
    type="button"
    on:click={prev.onSelect}
    aria-label={`Anar a ${prev.label}`}
    class="group absolute left-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 focus-visible:text-gray-800 lg:top-0 lg:-translate-y-1/2"
  >
    <Icon name="chevron-left" size={30} />
    <span
      class="pointer-events-none absolute left-0 top-full mt-1 hidden whitespace-nowrap text-left text-xs font-normal uppercase tracking-[0.5px] text-[#828898] group-hover:block group-focus-visible:block"
    >
      {prev.label}
    </span>
  </button>
{/if}

{#if next}
  <button
    type="button"
    on:click={next.onSelect}
    aria-label={`Anar a ${next.label}`}
    class="group absolute right-4 top-12 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 focus-visible:text-gray-800 lg:top-0 lg:-translate-y-1/2"
  >
    <Icon name="chevron-right" size={30} />
    <span
      class="pointer-events-none absolute right-0 top-full mt-1 hidden whitespace-nowrap text-right text-xs font-normal uppercase tracking-[0.5px] text-[#828898] group-hover:block group-focus-visible:block"
    >
      {next.label}
    </span>
  </button>
{/if}
</div>
