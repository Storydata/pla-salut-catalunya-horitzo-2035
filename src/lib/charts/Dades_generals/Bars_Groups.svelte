<script>
  import BarsGroupsMiniChart from "./Bars_MiniChart.svelte";

  export let dataRaw = [];

  function getAgeRows(data) {
    const baseRows = data.filter(
      (d) =>
        d.Estudis === "Tots" &&
        d.Classe === "Tots" &&
        d.Regio === "Catalunya" &&
        d.Origen === "Tots" &&
        d.Any == 2025,
    );
    const ageGroups = Array.from(
      new Set(
        baseRows.map((row) => row.Edat).filter((edat) => edat !== "Tots"),
      ),
    );

    return baseRows.filter((row) =>
      ageGroups.length > 0 ? row.Edat !== "Tots" : row.Edat === "Tots",
    );
  }

  const chartConfigs = [
    {
      key: "edat",
      title: "Per edat",
      groupField: "Edat",
      labelField: "Edat_label",
      getRows: getAgeRows,
    },
    {
      key: "estudis",
      title: "Per nivell d'estudis",
      groupField: "Estudis",
      filter: (d) =>
        d.Edat === "Tots" &&
        d.Classe === "Tots" &&
        d.Regio === "Catalunya" &&
        d.Origen === "Tots" &&
        d.Estudis !== "Tots" &&
        d.Any == 2025,
    },
    {
      key: "classe",
      title: "Per classe social",
      groupField: "Classe",
      filter: (d) =>
        d.Edat === "Tots" &&
        d.Estudis === "Tots" &&
        d.Regio === "Catalunya" &&
        d.Origen === "Tots" &&
        d.Classe !== "Tots" &&
        d.Any == 2025,
    },
  ];

  $: charts = chartConfigs.map((config) => ({
    ...config,
    rows: config.getRows
      ? config.getRows(dataRaw)
      : dataRaw.filter(config.filter),
  }));
</script>

<div class="flex flex-col">
  <div class="charts-container w-full flex flex-col flex-wrap">
    {#each charts as chart (chart.key)}
      <h3 class="text-[#1B4853] font-inter font-bold text-xs mb-1 mt-2">
        {chart.title}
      </h3>
      <BarsGroupsMiniChart
        title={chart.title}
        rows={chart.rows}
        groupField={chart.groupField}
        labelField={chart.labelField}
      />
    {/each}
  </div>
</div>
