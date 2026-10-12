<script>
  import FilterBar from "./FilterBar.svelte";
  import PopulationGrid from "./PopulationGrid.svelte";
  import { perfilStatStore, perfilMargeStore } from "$lib/stores/stores";
  import {
    buildFilterOptions,
    initializeFilters,
    filterDataBySelection,
    buildStats,
    extractDemographicSegments,
    generatePopulationUnits,
  } from "./dataHelpers.js";

  export let dataRaw = [];

  let filters = initializeFilters();
  let stats = { percentage: "", unit: "%" };
  let populationData = [];
  let segments = [];

  $: filterOptions = buildFilterOptions(dataRaw);

  $: segments = dataRaw?.length > 0 ? extractDemographicSegments(dataRaw) : [];

  $: if (dataRaw?.length > 0 && segments) {
    updateVisualization();
  } else {
    populationData = [];
    perfilStatStore.set(null);
    perfilMargeStore.set(null);
  }

  function updateVisualization() {
    const filtered = filterDataBySelection(dataRaw, filters);
    stats = buildStats(filtered);
    perfilStatStore.set(stats.percentage);
    perfilMargeStore.set(stats.marge);
    populationData = filtered
      ? generatePopulationUnits(segments, stats.percentage, filters)
      : [];
  }

  function handleFilterChange(event) {
    filters = { ...filters, ...event.detail };
    updateVisualization();
  }
</script>

<div>
  <FilterBar
    {filters}
    sexes={filterOptions.sexes}
    edats={filterOptions.edats}
    estudis={filterOptions.estudis}
    classes={filterOptions.classes}
    on:change={handleFilterChange}
  />
  <PopulationGrid {populationData} />
</div>
