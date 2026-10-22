<script>
  import { tick } from "svelte";
  import { base } from "$app/paths";
  import { slide } from "svelte/transition";
  import Icon from "$lib/icons/Icon.svelte";
  import IndicatorPanel from "./IndicatorPanel.svelte";
  import EixosOverview from "./EixosOverview.svelte";
  import IndicadorsEntorn from "./IndicadorsEntorn.svelte";
  import { eixos } from "./eixosStore";
  import { objectiusGrups } from "./objectiusStore";
  import {
    menuOpenStore,
    menuAtRootStore,
    datawrapperStore,
    selectedSubcategoryStore,
    objectiuFontStore,
    objectiuIndicadorStore,
  } from "$lib/stores/stores";

  // --- Eixos estratègics -----------------------------------------------
  let selectedEix = null; // Eix (nivell 1, únic que "navega" a pantalla nova)
  let openLiniaId = null; // Línia desplegada (acordeó, directament sota l'Eix)
  let selectedIntervencio = null; // Intervenció desplegada -> panell d'accions
  let confirmedIntervencio = null; // confirmada -> mostra el Datawrapper

  // --- Objectius de salut -------------------------------------------------
  let selectedObjectiuGrup = null; // Objectiu general (nivell 1 del bloc)
  let confirmedObjectiu = null; // confirmat -> mostra el visor de dades

  // --- Indicadors d'entorn ------------------------------------------------
  let showEntorn = false; // vista de les taules de determinants de salut

  let isMenuOpen = true;

  function resetSelection() {
    selectedEix = null;
    openLiniaId = null;
    selectedIntervencio = null;
    confirmedIntervencio = null;
    selectedObjectiuGrup = null;
    confirmedObjectiu = null;
    showEntorn = false;
  }

  // El menú desplegat col·lapsa quan es confirma una selecció final, però el
  // navegador manté la posició de scroll antiga, que deixa el panell massa
  // amunt sota la capçalera fixa. Es torna a alinear un cop assenti el nou
  // layout. Compartida per totes les accions que canvien de pantalla.
  async function realignScroll() {
    await tick();
    const section = document.getElementById("pla_salut_catalunya_horitzo_2035");
    const header = document.getElementById("site-header");
    if (section) {
      const headerOffset = header?.getBoundingClientRect().height ?? 0;
      const top =
        section.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "auto" });
    }
  }

  function goBackToCategories() {
    resetSelection();
    datawrapperStore.set(null);
    selectedSubcategoryStore.set(null);
    objectiuFontStore.set(null);
    isMenuOpen = true;
  }

  // --- Eixos estratègics: accions ----------------------------------------

  async function selectEix(eixId) {
    selectedEix = $eixos.find((e) => e.id === eixId);
    openLiniaId = null;
    selectedIntervencio = null;
    await realignScroll();
  }

  // Acordeó: obrir una Línia no amaga les altres, només desplega el seu
  // contingut a sota.
  function toggleLinia(linia) {
    openLiniaId = openLiniaId === linia.id ? null : linia.id;
    selectedIntervencio = null;
  }

  function selectIntervencio(intervencio, linia) {
    selectedIntervencio =
      selectedIntervencio?.id === intervencio.id
        ? null
        : { ...intervencio, label: intervencio.nom, parentLabel: linia.label };
  }

  // "Veure fitxa" obre el PDF en una pestanya nova (és un <a>, vegeu el
  // template) i no toca cap estat -- el menú es queda tal com estava.
  async function confirmMetesISeguiment() {
    if (!selectedIntervencio?.datawrapper) return;
    confirmedIntervencio = selectedIntervencio;
    datawrapperStore.set(selectedIntervencio.datawrapper);
    selectedSubcategoryStore.set(null);
    objectiuFontStore.set(null);
    isMenuOpen = false;
    await realignScroll();
  }

  // Puja un nivell: torna al menú de línies del mateix eix (no reinicia
  // selectedEix ni openLiniaId), en lloc de tornar a la graella d'eixos.
  async function goBackToEixMenu() {
    confirmedIntervencio = null;
    selectedIntervencio = null;
    datawrapperStore.set(null);
    isMenuOpen = true;
    await realignScroll();
  }

  // --- Indicadors d'entorn: accions --------------------------------------

  async function openEntorn() {
    showEntorn = true;
    await realignScroll();
  }

  // Tornar a l'inici de la secció. Les taules fan la pàgina molt més alta que
  // la pantalla d'entrada, així que es realinea el scroll com a les altres
  // vistes que canvien de pantalla.
  async function goBackFromEntorn() {
    goBackToCategories();
    await realignScroll();
  }

  // --- Objectius de salut: accions ---------------------------------------

  async function selectObjectiuGrup(grupId) {
    selectedObjectiuGrup = $objectiusGrups.find((g) => g.id === grupId);
    await realignScroll();
  }

  // Una pastilla amb dataset confirma i mostra el visor de dades. Sense
  // dataset no és un botó: només s'indica que és en elaboració.
  async function confirmObjectiu(objectiu) {
    confirmedObjectiu = {
      label: objectiu.label,
      descripcio: objectiu.indicador,
    };
    selectedSubcategoryStore.set(objectiu.datasetId);
    objectiuFontStore.set(objectiu.font);
    datawrapperStore.set(null);
    isMenuOpen = false;
    await realignScroll();
  }

  // Puja un nivell: torna a la llista d'objectius del mateix grup, en lloc
  // de tornar a la graella d'eixos.
  async function goBackToObjectiusMenu() {
    confirmedObjectiu = null;
    selectedSubcategoryStore.set(null);
    objectiuFontStore.set(null);
    isMenuOpen = true;
    await realignScroll();
  }

  // --- Capçalera compartida (IndicatorPanel) -----------------------------
  // Eixos i Objectius de salut mai estan actius alhora -- confirmedIntervencio
  // i confirmedObjectiu són mútuament excloents.
  $: panelCategory = confirmedIntervencio
    ? selectedEix
    : confirmedObjectiu
      ? selectedObjectiuGrup
      : null;
  $: panelItem = confirmedIntervencio ?? confirmedObjectiu ?? null;
  $: panelCategoryLabel = confirmedObjectiu ? "OBJECTIU GENERAL" : "EIX";
  $: panelItemLabel = confirmedObjectiu ? "OBJECTIU DE SALUT" : "INTERVENCIÓ";
  $: panelOnGoUp = confirmedIntervencio
    ? goBackToEixMenu
    : confirmedObjectiu
      ? goBackToObjectiusMenu
      : null;

  $: objectiuIndicadorStore.set(confirmedObjectiu?.descripcio ?? null);
  $: menuOpenStore.set(isMenuOpen);
  $: menuAtRootStore.set(
    isMenuOpen && !selectedEix && !selectedObjectiuGrup && !showEntorn,
  );
</script>

<div class="relative flex flex-col h-full w-full mb-3">
  <div class="flex flex-col h-full w-full">
    <!-- Títol general de la secció: sempre visible (no condicionat a
         isMenuOpen), no sticky, i abans que res més. Viu dins d'EixosOverview
         quan estem a l'arrel (junt amb el text explicatiu i els blocs nous),
         però mentre naveguem dins d'un eix o d'un objectiu general (l'acordeó)
         es manté aquí. -->
    {#if selectedEix || selectedObjectiuGrup || showEntorn}
      <div class="mb-3 mt-[var(--section-top-gap)] text-center">
        <p class="section-title !text-gray-700">
          Pla de salut de Catalunya. Horitzó 2035
        </p>
      </div>
    {/if}

    <div class="flex flex-row flex-wrap items-start">
      <IndicatorPanel
        selectedCategory={panelCategory}
        selectedItem={panelItem}
        categoryLabel={panelCategoryLabel}
        parentLabel="LÍNIA"
        itemLabel={panelItemLabel}
        {goBackToCategories}
        onGoUpOneLevel={panelOnGoUp}
      />
    </div>

    <div class="flex flex-col rounded-lg overflow-hidden flex-1">
      <div class="overflow-y-auto flex-1">
        <div class="w-full">
          {#if isMenuOpen}
            {#if !selectedEix && !selectedObjectiuGrup && !showEntorn}
              <!-- Nivell 1: pantalla d'entrada (títol, text, blocs
                   d'Objectius de salut / Indicadors d'entorn, i Eixos
                   estratègics) — tot el disseny visual viu a
                   EixosOverview.svelte, aquest component només hi passa les
                   dades i la selecció. -->
              <div class="pt-[var(--section-top-gap)] pb-4">
                <EixosOverview
                  categories={$eixos}
                  onSelectCategory={selectEix}
                  objectiusGrups={$objectiusGrups}
                  onSelectObjectiuGeneral={selectObjectiuGrup}
                  onSelectIndicadorsEntorn={openEntorn}
                />
              </div>
            {:else if showEntorn}
              <!-- Indicadors d'entorn: les taules de determinants de salut -->
              <IndicadorsEntorn onBack={goBackFromEntorn} />
            {:else if selectedObjectiuGrup}
              <!-- Objectius de salut: acordeó d'1 sol nivell (el botó ja és
                   el nivell 1) -- cada pastilla o confirma el visor de dades
                   o es desplega in situ amb "En procés d'elaboració". -->
              <div class="py-4">
                <div class="mx-auto w-full max-w-2xl">
                  <div class="mb-8 flex items-center gap-6">
                    <button
                      on:click={goBackToCategories}
                      class="flex flex-shrink-0 flex-col items-start gap-1 text-left text-[#8B898E]"
                    >
                      <Icon
                        name="corner-up-left"
                        class="h-5 w-5 flex-shrink-0"
                      />
                      <span class="text-xs">TORNAR<br />ALS EIXOS</span>
                    </button>

                    <div class="flex min-w-0 flex-1 items-center gap-4">
                      <div
                        class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F7] md:h-24 md:w-24"
                      >
                        <Icon
                          name={selectedObjectiuGrup.icon}
                          class="h-7 w-7 md:h-10 md:w-10"
                          color={selectedObjectiuGrup.iconColor}
                          strokeWidth={1.75}
                        />
                      </div>
                      <h2
                        class="min-w-0 text-lg font-bold leading-tight text-[#2E3A59] md:text-2xl"
                      >
                        {selectedObjectiuGrup.label}
                      </h2>
                    </div>
                  </div>

                  <p
                    class="mb-3 font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
                  >
                    Objectius de salut
                  </p>

                  <div class="flex flex-col gap-1">
                    {#each selectedObjectiuGrup.objectius as objectiu (objectiu.label)}
                      {#if objectiu.datasetId}
                        <button
                          on:click={() => confirmObjectiu(objectiu)}
                          class="w-full rounded-md bg-[#E8EDF2] px-6 py-3 text-left text-[15px] font-semibold text-[#2E3A59] transition-colors hover:bg-[#D5D8DE]"
                        >
                          {objectiu.label}
                        </button>
                      {:else}
                        <div
                          class="flex w-full flex-col gap-1 rounded-md bg-[#E8EDF2] px-6 py-3 text-left text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-x-4"
                        >
                          <span class="min-w-0 sm:flex-1">{objectiu.label}</span>
                          <span
                            class="flex-shrink-0 text-xs uppercase tracking-[0.5px] text-[#828898]"
                          >
                            En elaboració
                          </span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                </div>
              </div>
            {:else}
              <!-- Eixos estratègics: TOT és un únic acordeó a partir d'aquí:
                   cap clic canvia de pantalla, només desplega/col·lapsa
                   contingut in situ. -->
              <div class="py-4">
                <div class="mx-auto w-full max-w-2xl">
                  <div class="mb-8 flex items-center gap-6">
                    <button
                      on:click={goBackToCategories}
                      class="flex flex-shrink-0 flex-col items-start gap-1 text-left text-[#8B898E]"
                    >
                      <Icon
                        name="corner-up-left"
                        class="h-5 w-5 flex-shrink-0"
                      />
                      <span class="text-xs">TORNAR<br />ALS EIXOS</span>
                    </button>

                    <div class="flex min-w-0 flex-1 items-center gap-4">
                      <img
                        src={selectedEix.icon}
                        alt={selectedEix.label}
                        class="h-16 w-16 flex-shrink-0 md:h-24 md:w-24"
                      />
                      <h2
                        class="min-w-0 text-lg font-bold leading-tight text-[#2E3A59] md:text-2xl"
                      >
                        {selectedEix.label}
                      </h2>
                    </div>
                  </div>

                  <p
                    class="mb-3 font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
                  >
                    Línies d’actuació
                  </p>

                  <div class="flex flex-col gap-1">
                    <!-- Nivell 2: Línies -->
                    {#each selectedEix.linies as linia (linia.id)}
                      {@const liniaOpen = openLiniaId === linia.id}
                      <div>
                        <button
                          on:click={() => toggleLinia(linia)}
                          class="flex w-full items-center justify-between rounded-md px-6 py-3 text-left text-sm transition-colors {liniaOpen
                            ? 'bg-[#2E3A59] text-white font-semibold'
                            : 'bg-[#E8EDF2] text-[#2E3A59] hover:bg-[#D5D8DE]'}"
                        >
                          <span>{linia.label}</span>
                          <Icon
                            name="chevron-down"
                            class="h-4 w-4 flex-shrink-0 transition-transform {liniaOpen
                              ? 'rotate-180'
                              : ''}"
                          />
                        </button>

                        {#if liniaOpen}
                          <div
                            transition:slide={{ duration: 220 }}
                            class="mt-1 flex flex-col gap-1 pl-6"
                          >
                            <!-- Nivell 3 (fulla): Intervencions. De moment només es
                                 mostra la llista, sense accions (fitxa, metes i
                                 indicadors de seguiment), fins que hi hagi contingut
                                 consensuat. -->
                            <p
                              class="mb-1 font-['Inter',sans-serif] text-sm uppercase tracking-wide text-[#8B898E]"
                            >
                              Intervencions
                            </p>
                            <p
                              class="mb-3 font-['Inter',sans-serif] text-sm tracking-wide text-[#8B898E]"
                            >
                              Metes i indicadors de procés. Properament
                            </p>
                            <ul class="flex flex-col gap-1">
                              {#each linia.intervencions as intervencio (intervencio.id)}
                                <li
                                  class="rounded-md bg-[#E8EDF2]/40 px-6 py-3 text-left text-sm text-[#2E3A59]"
                                >
                                  {intervencio.nom}
                                </li>
                              {/each}
                            </ul>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
