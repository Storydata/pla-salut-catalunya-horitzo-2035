<script>
  import Icon from "$lib/icons/Icon.svelte";

  // Contingut d'una bombolla (icona, xifra, unitat i text). Les mides van en
  // la unitat --u que defineix Bubble.svelte.
  export let bubble;
  export let textColor = "white";
</script>

<span class="icon">
  <Icon name={bubble.icon} color={textColor} class="h-full w-full" />
</span>
<p
  class="stat font-inter font-extrabold text-center"
  class:stat-long={bubble.stat.length > 8}
>
  {bubble.stat}
</p>
{#if bubble.unit}
  <p class="unit font-inter font-semibold text-center">{bubble.unit}</p>
{/if}
<p class="text font-inter font-semibold text-center">{bubble.text}</p>

<style>
  .icon {
    display: flex;
    flex-shrink: 0;
    width: calc(var(--u) * 30);
    height: calc(var(--u) * 30);
  }
  .stat {
    margin-top: calc(var(--u) * 4);
    font-size: calc(var(--u) * 24);
    line-height: 1;
  }
  /* Xifres llargues (p. ex. "12,9% i 14,8%"): no hi caben a 24. */
  .stat-long {
    font-size: calc(var(--u) * 16);
  }
  .unit {
    margin-top: calc(var(--u) * 2);
    font-size: calc(var(--u) * 11);
    line-height: 1.2;
  }
  /* La mateixa mida de text a totes les bombolles: la més gran amb la qual el
     text més llarg de qualsevol subseccio hi cap dins el cercle (comprovat a
     la mida màxima, 166px). Si un text nou no hi cap, es revisa aquesta mida,
     no se li afegeix una excepció. */
  .text {
    margin-top: calc(var(--u) * 6);
    max-width: 80%;
    font-size: calc(var(--u) * 12);
    line-height: 1.2;
  }
</style>
