<script>
  import BubbleContent from "./BubbleContent.svelte";

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

  const CIRCLE =
    "bubble flex flex-shrink-0 flex-col items-center justify-start rounded-full";

  $: style = `--u: ${UNIT}; width: ${DIAMETER[bubble.size]}; height: ${DIAMETER[bubble.size]}; background-color: ${bubble.color}; color: ${textColor};`;
</script>

<div
  class="flex items-center justify-center"
  style="animation: bubbleFadeIn 800ms ease both; animation-delay: {delay}ms;"
>
  <!-- Només és un botó si té detall al qual anar (`onSelect`); si no, és una
       figura sense interacció. -->
  {#if onSelect}
    <button
      type="button"
      on:click={onSelect}
      class="{CIRCLE} cursor-pointer animate-pulse-slow transition-transform hover:animate-none hover:scale-105"
      {style}
      aria-label={bubble.label}
    >
      <BubbleContent {bubble} {textColor} />
    </button>
  {:else}
    <div class={CIRCLE} {style}>
      <BubbleContent {bubble} {textColor} />
    </div>
  {/if}
</div>

<style>
  /* Mides del model de disseny (cercle de 166px), expressades en --u. */
  .bubble {
    padding-top: calc(var(--u) * 16);
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
