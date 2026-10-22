<script>
  // Orientació del Pla de salut. Horitzó 2035
  import { onMount } from "svelte";
  // Bloc d'introducció: títol sticky + text + tres il·lustracions que són
  // enllaços a la seva part de la pàgina.
  import OrientacioPrincipis from "$lib/assets/Orientacio-principis.svg";
  import OrientacioMortalitat from "$lib/assets/Orientacio-mortalitat-e.svg";
  import OrientacioAvads from "$lib/assets/Orientacio-avads.svg";
  import Icon from "$lib/icons/Icon.svelte";
  import MortalitatEvitable from "$lib/assets/Mortalitat-evitable-sexe.svg";

  const blocs = [
    {
      icon: OrientacioPrincipis,
      label: "Principis ètics i valors",
      href: "#principis-etics-i-valors",
    },
    {
      icon: OrientacioMortalitat,
      label: "Mortalitat evitable",
      href: "#mortalitat-evitable",
    },
    {
      icon: OrientacioAvads,
      label: "Pioners en l’anàlisi de la càrrega de malaltia a Catalunya",
      href: "#pioners-analisi-carrega-malaltia",
    },
  ];

  // Els salts de línia (\n) es respecten amb `whitespace-pre-line`.
  const principis = [
    { icon: "settings_accessibility", text: "Centralitat de la persona\ni respecte a l’autonomia" },
    { icon: "vertical_distribute", text: "Justícia i equitat" },
    { icon: "volunteer_activism", text: "Solidaritat i cohesió social" },
    { icon: "nest_eco_leaf", text: "Sostenibilitat i responsabilitat\nenvers les generacions futures" },
    { icon: "rocket_launch", text: "Progrés i responsabilitat\ncompartida" },
  ];

  let avadFrame;

  // La taula d'AVAD portava una alcada fixa de 887px: en estret Datawrapper la
  // reflueix i creix, i quedava retallada. Escoltem l'alcada que reporta ella
  // mateixa, nomes per al nostre iframe.
  onMount(() => {
    const handleDatawrapperResize = (e) => {
      const heights = e.data["datawrapper-height"];
      if (!heights || !avadFrame || avadFrame.contentWindow !== e.source)
        return;
      for (const key in heights) {
        avadFrame.style.height = heights[key] + "px";
      }
    };

    window.addEventListener("message", handleDatawrapperResize);
    return () => window.removeEventListener("message", handleDatawrapperResize);
  });
</script>

<div class="relative w-full lg:min-h-[180vh]">
  <div
    class="pb-12 pt-[var(--section-top-gap)] lg:sticky lg:top-[var(--site-header-h)] lg:z-10 lg:pb-16"
  >
    <div class="container mx-auto px-4">
      <!-- Titol de seccio -->
      <div class="mb-6 text-center">
        <p class="section-title">
        Orientació del Pla de salut
        </p>
      </div>

      <!-- Text introductori -->
      <div class="mx-auto max-w-[680px]">
        <p
          class="text-center font-['Inter',sans-serif] text-[15px] font-normal leading-[1.65] text-[#2E3A59] md:text-[18px] md:leading-[1.8]"
        >
          El Pla de salut de Catalunya Horitzó 2035 suposa un canvi de mirada.
          Aposta per actuar sobre les causes, els factors i els determinants de
          la salut i prioritza les intervencions que han demostrat ser efectives
          i eficients en generar un major impacte en la salut i el benestar de
          la ciutadania.<br> El Pla promou un enfocament ecosistèmic que integra 
          actuacions a nivell individual i comunitari, entorns, regulació, polítiques 
          comercials, tecnologia i dades, i organització i gestió del sistema de salut. <br> 
          L’objectiu és transformar els entorns, territoris i condicions de vida per 
          fer que l’opció saludable sigui la més fàcil, equitativa i accessible per a 
          tothom; i orientar el sistema de salut cap a la generació de valor, mitjançant 
          la millora dels resultats en salut, el benestar i la qualitat de vida de la població.
        </p>
      </div>

      <!-- Il·lustracions: la mida és la de la maqueta (84px d'alt en mòbil,
           150px des de md) i, si no hi caben les tres en fila, la que sobra
           passa a la línia següent. -->
      <div
        class="mx-auto mt-8 flex w-full flex-wrap items-start justify-center gap-x-4 gap-y-8 md:mt-[42px] lg:gap-x-10"
      >
        {#each blocs as bloc}
          <a
            href={bloc.href}
            class="flex w-[121px] flex-col items-center transition-transform hover:scale-105 md:w-[216px]"
          >
            <img
              src={bloc.icon}
              alt={bloc.label}
              class="mb-2 h-auto w-full md:mb-3"
            />
            <span
              class="text-center font-['Inter',sans-serif] text-[11px] font-semibold leading-[1.25] text-[#2E3A59] md:text-[14px] md:leading-[1.3]"
            >
              {bloc.label}
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Principis etics i Valors -->
<section
  id="principis-etics-i-valors"
  class="w-full scroll-mt-[var(--site-header-h)] pt-12 pb-20"
>
  <div class="container mx-auto px-4">
    <p class="section-subtitle">
      Principis ètics i valors
    </p>

    <!-- Llista vertical: a escriptori el bloc fa 475px d'alt i els 5 elements
         es reparteixen en aquesta alçada. -->
    <ul
      class="mx-auto mt-8 flex w-fit flex-col gap-6 lg:h-[475px] lg:justify-between lg:gap-0"
    >
      {#each principis as principi}
        <li class="flex items-center gap-4 lg:gap-6">
          <span
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff8f68] lg:h-20 lg:w-20"
          >
            <Icon name={principi.icon} class="h-6 w-6 text-white lg:h-8 lg:w-8" />
          </span>
          <span
            class="whitespace-pre-line font-['Inter',sans-serif] text-base font-semibold leading-[1.35] text-[#2E3A59]"
          >
            {principi.text}
          </span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<!-- Mortalitat evitable -->
<section
  id="mortalitat-evitable"
  class="w-full scroll-mt-[var(--site-header-h)] pt-12 pb-20"
>
  <div class="container mx-auto px-4">
    <p class="section-subtitle">
      Mortalitat evitable
    </p>

    <p
      class="mt-8 font-['Inter',sans-serif] text-[15px] font-normal leading-[1.65] text-[#2E3A59] md:text-[18px] md:leading-[1.8]"
    >
      Aquest Pla de salut aposta per utilitzar la mortalitat evitable
      (prevenible i/o tractable) com a instrument de planificació.
    </p>

    <div class="mx-auto mt-12 w-full md:w-[72%]">
      <img
        src={MortalitatEvitable}
        alt="10 primeres causes de mortalitat evitable en dones i homes"
        class="block h-auto w-full"
      />
    </div>
  </div>
</section>

<!-- Pioners en l'analisi de la carrega de malaltia -->
<section
  id="pioners-analisi-carrega-malaltia"
  class="w-full scroll-mt-[var(--site-header-h)] pt-12 pb-10"
>
  <div class="container mx-auto px-4">
    <p class="section-subtitle">
      Pioners en l’anàlisi de la càrrega de malaltia a Catalunya
    </p>

    <p
      class="mt-8 font-['Inter',sans-serif] text-[15px] font-normal leading-[1.65] text-[#2E3A59] md:text-[18px] md:leading-[1.8]"
    >
      El Pla analitza amb dades de Catalunya els Anys de Vida Ajustats per
      Discapacitat (AVAD) que es mostren a continuació.
    </p>

    <div class="mx-auto mt-12 w-full md:w-[84%]">
      <iframe
        bind:this={avadFrame}
        title="Salut barres horitzontals"
        aria-label="Taula"
        id="datawrapper-chart-4wgfp"
        src="https://datawrapper.dwcdn.net/4wgfp/2/"
        scrolling="no"
        frameborder="0"
        height="887"
        style="width: 0; min-width: 100%; border: none; display: block;"
      ></iframe>
    </div>
  </div>
</section>
