<script>
  import Icon from "$lib/icons/Icon.svelte";

  // { icon, stat, text, label, color, size: "sm" | "lg" }
  export let bubble;
  export let delay = 0; // ms d'espera abans de l'animació d'entrada
  export let onSelect = () => {};

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
  <button
    type="button"
    on:click={onSelect}
    class="bubble flex flex-shrink-0 cursor-pointer flex-col items-center justify-start rounded-full animate-pulse-slow transition-transform hover:animate-none hover:scale-105"
    style="
      --u: {UNIT};
      width: {DIAMETER[bubble.size]};
      height: {DIAMETER[bubble.size]};
      background-color: {bubble.color};
    "
    aria-label={bubble.label}
  >
    <span class="icon">
      <Icon name={bubble.icon} color="white" class="h-full w-full" />
    </span>
    <p class="stat font-inter font-extrabold text-white text-center">
      {bubble.stat}
    </p>
    <p
      class="text font-inter font-semibold text-white text-center line-clamp-4"
    >
      {bubble.text}
    </p>
  </button>
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
  .text {
    margin-top: calc(var(--u) * 6);
    max-width: 73%;
    font-size: calc(var(--u) * 14);
    line-height: 1.2;
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
