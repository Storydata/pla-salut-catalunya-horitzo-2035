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
<p
  class="text font-inter font-semibold text-center"
  class:text-long={bubble.text.length > 38}
>
  {bubble.text}
</p>

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
  .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    margin-top: calc(var(--u) * 6);
    max-width: 73%;
    font-size: calc(var(--u) * 14);
    line-height: 1.2;
  }
  /* Frases llargues: lletra més petita (11px a mida màxima) perquè hi cabin. */
  .text-long {
    -webkit-line-clamp: 5;
    max-width: 80%;
    font-size: calc(var(--u) * 11);
  }
</style>
