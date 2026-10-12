<script>
  import Icon from "$lib/icons/Icon.svelte";

  // Grid d'eixos i botons d'Objectius de salut (nivell 1): venen del pare,
  // que ja té $eixos/$objectiusGrups i les funcions de selecció — aquest
  // component no toca cap store ni lògica de menú.
  export let categories = [];
  export let onSelectCategory = () => {};
  export let objectiusGrups = [];
  export let onSelectObjectiuGeneral = () => {};
  export let onSelectIndicadorsEntorn = () => {};

  // Botó gris, icona amb color propi — mateix fons que les línies
  // separadores, tal com marca el SVG de disseny.
  const BUTTON_BG = "#F3F4F7";

  // Mateix estil de text que els botons d'"Objectius generals de l'estat de
  // salut" (EstatdelaSalut.svelte), aplicat aquí als 6 botons per igual.
  const LABEL_CLASS =
    "text-center font-['Inter',sans-serif] text-[11px] leading-[1.25] text-[#2E3A59] md:text-[15px] md:leading-[1.3]";
</script>

<!-- Ample real: cap "container" de Tailwind pel mig (imposa el seu propi
     max-width per breakpoint) — així els percentatges de sota es calculen
     sobre l'ample real de la web, tal com demana el disseny. -->
<div class="w-full">
  <!-- Títol de la secció (recurrent, mateix text que a Inici) -->
  <div class="mb-2 text-center">
    <p class="section-title !text-gray-700">
      Pla de salut de Catalunya. Horitzó 2035
    </p>
  </div>

  <!-- Text explicatiu: mateix estil que el d'Enfocament.svelte -->
  <div class="mx-auto mb-8 max-w-[680px] md:mb-10">
    <p
      class="text-center font-['Inter',sans-serif] text-[15px] font-normal leading-[1.65] text-[#2E3A59] md:text-[18px] md:leading-[1.8]"
    >
      Aquest pla proposa 15 objectius de context, 17 objectius generals de
      salut, 26 objectius de reducció de risc, 11 objectius de morbiditat,
      agrupats en 6 eixos estratègics que donen lloc a 140 intervencions i X
      metes.
    </p>
  </div>

  <!-- Objectius de salut (vora esquerra al 10%, ample 50%) +
       Indicadors d'entorn (vora dreta al 90%, ample 25%). Una graella de tres
       files amb subgraella: els dos blocs comparteixen fila de títol, de línia
       i de botons, així la línia i els botons de l'un queden sempre a l'alçada
       de l'altre encara que un títol ocupi dues línies, i si els botons
       d'Objectius de salut salten de línia, tota la fila creix i empeny els
       Eixos estratègics cap avall. -->
  <div class="mb-8 grid w-full grid-cols-[10%_50%_1fr_25%_10%] md:mb-10">
    <div class="col-start-2 row-span-3 grid grid-rows-[subgrid]">
      <p
        class="mb-2 flex items-end justify-center text-center font-abhaya text-[clamp(15px,2.2vw,26px)] font-extrabold leading-[1.2] text-[#2E3A59]"
      >
        Objectius de salut
      </p>
      <div class="border-t-4 border-[#F3F4F7]" />
      <!-- 10% del propi bloc (que ja és el 50% de la web) = 5% real de la
           web a cada costat, tal com marca el disseny. -->
      <div
        class="mx-[10%] mt-4 flex flex-wrap items-start justify-between gap-y-4 md:mt-6"
      >
        {#each objectiusGrups as grup (grup.id)}
          <button
            type="button"
            on:click={() => onSelectObjectiuGeneral(grup.id)}
            disabled={grup.objectius.length === 0}
            class="flex flex-col items-center transition-transform enabled:hover:scale-105 disabled:cursor-default disabled:opacity-40"
          >
            <div
              class="mb-2 flex h-14 w-14 items-center justify-center rounded-full md:h-24 md:w-24"
              style="background-color: {BUTTON_BG};"
            >
              <Icon
                name={grup.icon}
                class="h-6 w-6 md:h-10 md:w-10"
                color={grup.iconColor}
                strokeWidth={1.75}
              />
            </div>
            <span class="max-w-[100px] {LABEL_CLASS}">
              {grup.label}
            </span>
          </button>
        {/each}
      </div>
    </div>

    <div class="col-start-4 row-span-3 grid grid-rows-[subgrid]">
      <p
        class="mb-2 flex items-end justify-center text-center font-abhaya text-[clamp(15px,2.2vw,26px)] font-extrabold leading-[1.2] text-[#2E3A59]"
      >
        Indicadors d'entorn
      </p>
      <div class="border-t-4 border-[#F3F4F7]" />
      <div class="mt-4 flex justify-center md:mt-6">
        <button
          type="button"
          on:click={onSelectIndicadorsEntorn}
          class="flex flex-col items-center transition-transform hover:scale-105"
        >
          <div
            class="mb-2 flex h-14 w-14 items-center justify-center md:h-24 md:w-24"
            style="background-color: {BUTTON_BG}; border-radius: 12%;"
          >
            <Icon
              name="file-chart-column-increasing"
              class="h-6 w-6 md:h-10 md:w-10"
              color="#2B3A5C"
              strokeWidth={1.75}
            />
          </div>
          <span class="max-w-[150px] {LABEL_CLASS}">
            Explora aquests indicadors
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Eixos estratègics: 10% de marge a cada costat (línia al 80% d'ample) -->
  <div class="mx-auto w-[80%]">
    <p
      class="mb-2 text-center font-abhaya text-[clamp(15px,2.2vw,26px)] font-extrabold leading-[1.2] text-[#2E3A59]"
    >
      Eixos estratègics
    </p>
    <div class="border-t-4 border-[#F3F4F7]" />
    <div
      class="mt-4 flex flex-wrap items-start justify-between gap-y-4 md:mt-6"
    >
      {#each categories as category (category.id)}
        <button
          type="button"
          on:click={() => onSelectCategory(category.id)}
          disabled={category.linies.length === 0}
          class="group flex flex-col items-center transition-transform enabled:hover:scale-105 disabled:cursor-default disabled:opacity-40"
        >
          <div class="mb-2 w-[56px] md:w-[90px]">
            <img
              src={category.icon}
              alt={category.label}
              class="animate-pulse-slow h-auto w-full"
            />
          </div>
          <h3 class="max-w-[100px] {LABEL_CLASS}">
            {category.label}
          </h3>
        </button>
      {/each}
    </div>
  </div>
</div>
