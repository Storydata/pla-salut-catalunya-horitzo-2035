<script>
  import Icon from "$lib/icons/Icon.svelte";

  // { icon, stat, unit?, text, label, color, textColor?, size: "sm" | "lg" }
  // `unit` va sota la xifra (només les dades que no són un %); `textColor`
  // és el color de la icona i dels textos (blanc si no es dóna).
  export let bubble;
  export let delay = 0; // ms d'espera abans de l'animació d'entrada
  export let onSelect = null; // sense detall: la bombolla no és clicable

  $: textColor = bubble.textColor ?? "white";

  // Diàmetre de la bombolla gran (responsive). La petita és una fracció fixa
  // de la gran, no un clamp propi: així la proporció es manté igual a tots
  // els amples de pantalla i el text hi cap sempre igual. El mínim
  // perquè hi càpiguen 4 línies de text en les petites és 0,97; s'hi ha
  // deixat un punt de marge. Mai més gran que la gran.
  const LARGE = "clamp(118px, 15vw, 166px)";
  const DIAMETER = { lg: LARGE, sm: `calc(${LARGE} * 0.98)` };

  // Icona, xifra, text i marges es mesuren en una unitat --u que val 1px
  // quan la bombolla gran arriba al seu màxim (166px, la mida del model de
  // disseny) i s'encongeix amb ella en pantalles més petites, perquè el
  // contingut sempre càpiga dins del cercle. Es calcula sobre la gran i no
  // sobre cada bombolla perquè icones i xifres tinguin la mateixa mida a
  // totes les bombolles, siguin petites o grans.
  const UNIT = `calc(${LARGE} / 166)`;
</script>

<div
  class="flex items-center justify-center"
  style="animation: bubbleFadeIn 800ms ease both; animation-delay: {delay}ms;"
>
  <!-- Només és un botó si té detall al qual anar (`onSelect`); si no, és una
       figura sense interacció. -->
  <svelte:element
    this={onSelect ? "button" : "div"}
    type={onSelect ? "button" : undefined}
    on:click={onSelect}
    class="bubble flex flex-shrink-0 flex-col items-center justify-start rounded-full {onSelect
      ? 'cursor-pointer animate-pulse-slow transition-transform hover:animate-none hover:scale-105'
      : ''}"
    style="
      --u: {UNIT};
      width: {DIAMETER[bubble.size]};
      height: {DIAMETER[bubble.size]};
      background-color: {bubble.color};
      color: {textColor};
    "
    aria-label={onSelect ? bubble.label : undefined}
  >
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
  </svelte:element>
</div>

<style>
  /* Mides del model de disseny (cercle de 166px), expressades en --u. */
  .bubble {
    padding-top: calc(var(--u) * 16);
  }
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

  @keyframes -global-bubbleFadeIn {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
