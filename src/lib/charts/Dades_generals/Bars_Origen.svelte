<script>
  import * as d3 from "d3";
  import { fmtPct } from "../chartHelpers";
  import InfoPopover from "../InfoPopover.svelte";
  import { P } from "flowbite-svelte";

  export let dataRaw = [];

  const fallbackWidth = 520;
  const margin = { top: 6, right: 60, bottom: 30, left: 160 };
  // Thickness of each bar, in px, and the share of a band left empty around it.
  const barThickness = 20;
  const bandPadding = 0.2;

  const origenLabels = {
    Si: "Nivell d’ingressos alt",
    No: "Resta de països",
  };

  let containerWidth = 0;

  const OrigenFilter = (d) =>
    d.Regio === "Catalunya" &&
    d.Edat === "Tots" &&
    d.Estudis === "Tots" &&
    d.Classe === "Tots" &&
    d.Origen !== "Tots" &&
    d.Any === 2025;

  $: filtered = dataRaw.filter(OrigenFilter);
  $: groupedByOrigen = d3.group(filtered, (d) => d.Origen);
  $: allOrigens = Array.from(groupedByOrigen.keys());

  $: origenData = allOrigens.map((origen) => {
    const rows = groupedByOrigen.get(origen) || [];

    return {
      origen,
      values: Object.fromEntries(
        rows
          .filter(
            (row) =>
              row.Indicador !== "=" &&
              row.Indicador !== undefined &&
              row.Indicador !== null &&
              row.Indicador !== "",
          )
          .map((row) => [row.Sexe, +row.Indicador]),
      ),
    };
  });

  const origenOrder = ["Si", "No"];

  $: grouped = [...origenData].sort(
    (a, b) => origenOrder.indexOf(a.origen) - origenOrder.indexOf(b.origen),
  );

  $: width = containerWidth || fallbackWidth;
  $: innerWidth = width - margin.left - margin.right;
  // The chart is as tall as its bars need (a band scale with that padding).
  $: innerHeight =
    (barThickness * (grouped.length + bandPadding)) / (1 - bandPadding);
  $: height = margin.top + innerHeight + margin.bottom;
  $: maxValue = d3.max(grouped, (row) => row.values?.["Tots"] ?? 0) ?? 0;
  $: xDomainMax = maxValue > 0 ? maxValue : 1;
  $: axisTicks = d3.ticks(0, xDomainMax, 3);

  $: x = d3
    .scaleLinear()
    .domain([0, xDomainMax])
    .range([margin.left, margin.left + innerWidth])
    .nice();

  $: y = d3
    .scaleBand()
    .domain(grouped.map((d) => d.origen))
    .range([margin.top, margin.top + innerHeight])
    .padding(bandPadding);

  $: chartRows = grouped.map((row) => {
    const value = row.values?.["Tots"];
    const barHeight = y.bandwidth();
    const barWidth = value === undefined ? 0 : Math.max(0, x(value) - x(0));

    return {
      ...row,
      y: y(row.origen) ?? margin.top,
      value,
      barHeight,
      barWidth,
      labelX: x(value ?? 0) + 6,
      labelY: barHeight / 2 + 4,
    };
  });
</script>

<div class="flex flex-col gap-0.5 w-full max-w-[520px] mx-auto mt-4 px-2">
  <div class="flex flex-col gap-1">
    <p class="text-xs text-[#3F3F46] leading-relaxed max-w-sm">
      Classificació del Banc Mundial. Ingrés Nacional Brut (INB) del país de
      naixement. <strong>Dades 2025</strong>
      <InfoPopover text="Segons el nivell d’ingressos del país d’origen" />
    </p>
  </div>

  <div bind:clientWidth={containerWidth} class="w-full max-w-[420px] mx-auto">
    <svg
      class="block w-full h-auto"
      viewBox={`0 0 ${width} ${height}`}
      {width}
      {height}
      preserveAspectRatio="xMidYMid meet"
    >
      {#if chartRows.length > 0}
        {#each axisTicks as tick}
          <g transform={`translate(${x(tick)}, ${margin.top + innerHeight})`}>
            <line
              x1="0"
              x2="0"
              y1="0"
              y2="4"
              stroke="#8B898E"
              stroke-width="1"
            />
            <text
              x="0"
              y="16"
              text-anchor="middle"
              font-size="8"
              fill="#8B898E"
            >
              {tick}&nbsp;%
            </text>
          </g>
        {/each}

        <line
          x1={x(0)}
          x2={x(0)}
          y1={margin.top}
          y2={margin.top + innerHeight}
          stroke="#8B898E"
          stroke-width="0.75"
        />

        {#each chartRows as row}
          <g transform={`translate(0, ${row.y})`}>
            <text
              x={margin.left - 10}
              y={y.bandwidth() / 2}
              text-anchor="end"
              dominant-baseline="middle"
              font-size={width < 300 ? 9 : 11}
              fill="#3F3F46"
            >
              {origenLabels[row.origen] ?? row.origen}
            </text>
            <rect
              x={x(0)}
              width={row.barWidth}
              height={row.barHeight}
              fill="#EA4D50"
            />
            <text
              x={row.labelX}
              y={row.labelY}
              text-anchor="start"
              font-size={width < 300 ? 9 : 11}
              font-weight="400"
              fill="#4C4F51"
            >
              {fmtPct(row.value)}&nbsp;%
            </text>
          </g>
        {/each}
      {/if}
    </svg>
  </div>
</div>
