<script>
  // Enfocament del Pla de salut 26-30. Horitzo 2035
  import { onMount } from "svelte";
  // Intro block: sticky title + text + three (non-clickable) illustrations.
  import AmbitsIcon5 from "$lib/assets/Ambits-Pla-Salut-color-nou-5.svg";
  import AmbitsIcon7 from "$lib/assets/Ambits-Pla-Salut-color-nou-7.svg";
  import AmbitsIcon8 from "$lib/assets/Ambits-Pla-Salut-color-nou-8.svg";
  import PrincipisEtics from "$lib/assets/Principis-etics-i-Valors.svg";
  import MortalitatEvitable from "$lib/assets/Mortalitat-evitable-sexe.svg";

  const blocs = [
    { icon: AmbitsIcon5, label: "Principis ètics i valors" },
    { icon: AmbitsIcon7, label: "Mortalitat evitable" },
    {
      icon: AmbitsIcon8,
      label: "Pioners en l'anàlisi de la càrrega de malaltia a Catalunya",
    },
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
        <p
          class="font-abhaya text-[clamp(20px,5.5vw,36px)] font-bold leading-[1.15] text-[#2E3A59]"
        >
          Enfocament del Pla de salut
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
          la ciutadania. El Pla promou un enfocament ecosistèmic que integra
          actuacions a nivell individual, comunitari, per transformar els
          entorns, territoris i condicions de vida per fer de l'opció saludable
          l'opció més fàcil, equitativa i accessible. Orienta el sistema de
          salut cap a resultats i pràctiques de valor.
        </p>
      </div>

      <!-- Illustracions: three equal columns so the blocs align column for
           column with the Eixos estrategics grid. -->
      <div class="mx-auto mt-8 w-full md:mt-[42px] md:w-[60%]">
        <div class="grid grid-cols-3 items-start gap-x-3 gap-y-8 md:gap-x-10">
          {#each blocs as bloc}
            <div class="flex flex-col items-center">
              <div class="mb-2 w-full max-w-[84px] md:mb-3 md:max-w-[150px]">
                <img src={bloc.icon} alt={bloc.label} class="h-auto w-full" />
              </div>
              <h3
                class="max-w-[185px] text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[14px] md:leading-[1.3]"
              >
                {bloc.label}
              </h3>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Principis etics i Valors -->
<section class="w-full pt-12 pb-20">
  <div class="container mx-auto px-4">
    <p
      class="font-abhaya text-[clamp(19px,5vw,30px)] font-extrabold leading-[1.35] text-[#2E3A59]"
    >
      Principis ètics i valors
    </p>

    <div class="mx-auto mt-8 w-full md:w-[48%]">
      <img
        src={PrincipisEtics}
        alt="Principis ètics i valors del Pla de salut"
        class="block h-auto w-full"
      />
    </div>
  </div>
</section>

<!-- Mortalitat evitable -->
<section class="w-full pt-12 pb-20">
  <div class="container mx-auto px-4">
    <p
      class="font-abhaya text-[clamp(19px,5vw,30px)] font-extrabold leading-[1.35] text-[#2E3A59]"
    >
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
<section class="w-full pt-12 pb-20">
  <div class="container mx-auto px-4">
    <p
      class="font-abhaya text-[clamp(19px,5vw,30px)] font-extrabold leading-[1.35] text-[#2E3A59]"
    >
      Pioners en l'anàlisi de la càrrega de malaltia a Catalunya
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
        aria-label="Table"
        id="datawrapper-chart-V9z4E"
        src="https://datawrapper.dwcdn.net/V9z4E/1/"
        scrolling="no"
        frameborder="0"
        height="887"
        style="width: 0; min-width: 100%; border: none; display: block;"
      ></iframe>
    </div>
  </div>
</section>
