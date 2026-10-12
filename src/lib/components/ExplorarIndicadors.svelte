<script>
  import { onMount } from "svelte";
  import {
    dataStore,
    subcategoryDataStore,
    selectedSubcategoryStore,
    menuOpenStore,
    perfilStatStore,
    perfilMargeStore,
    compararMargeStore,
    datawrapperStore,
    objectiuFontStore,
    objectiuIndicadorStore,
  } from "$lib/stores/stores";
  import TopButtons from "$lib/charts/TopButtons.svelte";
  import IndicatorHeader from "$lib/charts/IndicatorHeader.svelte";
  import Linechart from "$lib/charts/Linechart.svelte";
  import DadesGenerals from "$lib/charts/Dades_generals/DadesGenerals.svelte";
  import Animation from "$lib/charts/Filtra_perfil/Animation.svelte";
  import IndicadorViewer from "./Chart_Menu/IndicadorViewer.svelte";
  import ChartFootnote from "$lib/charts/ChartFootnote.svelte";

  let dataRaw = [];

  let chartData = [];

  const defaultOptions = [
    { key: "general", label: "Dades generals/Territori", chart: DadesGenerals },
    { key: "perfil", label: "Filtra per veure un perfil", chart: Animation },
    {
      key: "comparar",
      label: "Comparar eixos de desigualtat",
      chart: Linechart,
    },
  ];

  let activeKey = defaultOptions[0].key;
  $: activechart =
    defaultOptions.find((opt) => opt.key === activeKey)?.chart || Linechart;

  $: dataRaw = $subcategoryDataStore["ACT_INT_MOD_adults"] || [];

  $: {
    if ($selectedSubcategoryStore) {
      chartData = $subcategoryDataStore[$selectedSubcategoryStore] || [];
    } else {
      chartData = dataRaw;
    }
  }

  function handleChartChange(event) {
    activeKey = event.detail.key;
  }

  // Catalunya total (all filters at "Tots") for the latest year.
  $: catalunyaRow = chartData.find(
    (d) =>
      d.Regio === "Catalunya" &&
      d.Edat === "Tots" &&
      d.Estudis === "Tots" &&
      d.Classe === "Tots" &&
      d.Sexe === "Tots" &&
      d.Origen === "Tots" &&
      d.Any === 2025 &&
      d.Indicador !== null &&
      d.Indicador !== undefined &&
      d.Indicador !== "",
  );
  $: catalunyaTotal = catalunyaRow?.Indicador;

  // The perfil view shows its filtered value; the other views show the total.
  $: headerValue = activeKey === "perfil" ? $perfilStatStore : catalunyaTotal;

  // Marge d'error under the chart: the filtered row in perfil, the range of
  // the drawn lines in comparar, and the Catalunya total everywhere else.
  $: footnoteMarge =
    activeKey === "perfil"
      ? $perfilMargeStore
      : activeKey === "comparar"
        ? $compararMargeStore?.min
        : catalunyaRow?.Tasa;
  $: footnoteMargeMax =
    activeKey === "comparar" ? $compararMargeStore?.max : null;

  // Datawrapper envia la seva pròpia alçada per postMessage un cop carregat
  // (el seu embed pot ser més alt o baix segons el gràfic i l'ample real).
  // L'alçada guardada al JSON només és el valor inicial, abans que arribi
  // el primer missatge.
  function handleDatawrapperResize(event) {
    const heights = event.data?.["datawrapper-height"];
    if (!heights) return;
    for (const [chartId, height] of Object.entries(heights)) {
      const iframe = document.querySelector(
        `iframe[data-datawrapper-id="${chartId}"]`,
      );
      if (iframe) iframe.style.height = `${height}px`;
    }
  }

  onMount(() => {
    window.addEventListener("message", handleDatawrapperResize);
    return () => window.removeEventListener("message", handleDatawrapperResize);
  });
</script>

<div class="relative w-full">
  <div class="container mx-auto">
    <IndicadorViewer />
  </div>
  {#if !$menuOpenStore}
    {#if $datawrapperStore}
      {@const dwId = $datawrapperStore.src.split("/").filter(Boolean).pop()}
      <!-- Metes i indicadors de seguiment: substitueix pestanyes + gràfic +
           peu per l'iframe de Datawrapper. Ample fix (70% escriptori, 100%
           mòbil), alçada automàtica segons el propi gràfic. -->
      <div class="flex justify-center py-10">
        <iframe
          title="Metes i indicadors de seguiment"
          src={$datawrapperStore.src}
          data-datawrapper-id={dwId}
          class="w-full border-0 px-4 md:w-[60%] md:px-0"
          style="height: {$datawrapperStore.height ?? 400}px;"
          scrolling="no"
        ></iframe>
      </div>
    {:else}
      <div class="indicator-explorer">
        <div>
          <TopButtons {activeKey} on:change={handleChartChange} />
        </div>
        <!-- DadesGenerals (general) pinta el seu propi header dins la columna
             central, alineat amb "Per edat"/"Per Territori". Linechart i
             Animation no tenen header propi: usen aquest, sempre ancorat just
             sota les pestanyes (mai centrat verticalment, per això no hi ha
             `justify-center` aquí — un contingut curt no ha de generar un
             buit variable per sota de les pestanyes). -->
        <div class="chart-stage flex flex-col">
          {#if activeKey !== "general"}
            <IndicatorHeader
              value={headerValue}
              showTotal={activeKey !== "perfil"}
              showTotalCategoria={activeKey !== "perfil"}
              valueColor={activeKey === "perfil" ? "#2E3A59" : "#EA4D50"}
              showInfoIcon={activeKey !== "perfil"}
              compact={activeKey === "perfil"}
              showValue={activeKey !== "comparar"}
              indicatorName={activeKey === "perfil"
                ? $objectiuIndicadorStore
                : undefined}
            />
          {/if}
          <div class="flex flex-col">
            <svelte:component
              this={activechart}
              dataRaw={chartData}
              {headerValue}
            />
          </div>
        </div>
        <ChartFootnote
          marge={footnoteMarge}
          margeMax={footnoteMargeMax}
          font={$objectiuFontStore ?? undefined}
        />
      </div>
    {/if}
  {/if}
</div>

<style>
  /* Below lg the columns stack, so a fixed height would clip; let it grow. */
  .chart-stage {
    min-height: 480px;
  }

  @media (min-width: 1024px) {
    .chart-stage {
      height: 580px;
    }
  }
</style>
