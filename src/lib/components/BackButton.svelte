<script>
  import Icon from "$lib/icons/Icon.svelte";
</script>

<!-- Botó per tornar al nivell anterior: mateix estil que "TORNAR ALS EIXOS" de
     Objectius de salut (icona + text petit en gris). El posicionament el
     decideix qui l'utilitza amb `class` (també si es veu o no: `flex`/`hidden`). -->
<button
  type="button"
  on:click
  class="flex-col items-start gap-1 text-left text-[#8B898E] {$$props.class ??
    ''}"
>
  <Icon name="corner-up-left" class="h-[18px] w-[18px] flex-shrink-0" />
  <span class="text-[10.8px]">TORNAR<br />ENRERA</span>
</button>
