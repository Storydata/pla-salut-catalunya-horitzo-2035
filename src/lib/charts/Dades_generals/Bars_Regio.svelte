<script>
  import * as d3 from "d3";
  import {
    BAR_GROUP_PADDING,
    barGroupsExtent,
    fmtPct,
    getColor,
    getColorLabel,
    sexes,
  } from "../chartHelpers";

  export let dataRaw = [];

  const sortOptions = ["Dona", "Home"];
  const fallbackWidth = 760;
  // Height of one region's group of bars (its Tots/Dona/Home bars), in px.
  const groupHeight = 36.5;
  const margin = { top: 28, right: 50, bottom: 46, left: 120 };

  let sortBy = "Dona";
  let containerWidth = 0;

  const regionFilter = (d) =>
    d.Regio !== "Catalunya" &&
    d.Edat === "Tots" &&
    d.Estudis === "Tots" &&
    d.Classe === "Tots" &&
    d.Origen === "Tots" &&
    d.Any === 2025;

  const meanRowFilter = (d) =>
    d.Regio === "Catalunya" &&
    d.Edat === "Tots" &&
    d.Estudis === "Tots" &&
    d.Classe === "Tots" &&
    d.Sexe === "Tots" &&
    d.Origen === "Tots" &&
    d.Any === 2025;

  function splitLabel(label) {
    const trimmed = String(label).trim();
    const words = trimmed.split(/\s+/);

    if (words.length <= 2) return [trimmed];

    const midpoint = Math.ceil(words.length / 2);
    return [
      words.slice(0, midpoint).join(" "),
      words.slice(midpoint).join(" "),
    ];
  }

  function getBarHeight(innerBand, sex) {
    return sex === "Tots" ? innerBand.bandwidth() * 0.6 : innerBand.bandwidth();
  }

  function getBarY(innerBand, sex) {
    const baseY = innerBand(sex) ?? 0;
    const height = getBarHeight(innerBand, sex);

    return sex === "Tots"
      ? baseY + (innerBand.bandwidth() - height) / 2
      : baseY;
  }

  function handleSort(key) {
    if (key === sortBy) return;
    sortBy = key;
  }

  $: filtered = dataRaw.filter(regionFilter);
  $: groupedByRegio = d3.group(filtered, (d) => d.Regio);
  $: allRegions = Array.from(groupedByRegio.keys());

  $: regioData = allRegions.map((regio) => {
    const rows = groupedByRegio.get(regio) || [];

    return {
      regio,
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

  $: meanRow = dataRaw.find(meanRowFilter);
  $: meanValue = meanRow ? +meanRow.Indicador : undefined;

  $: grouped = [...regioData].sort(
    (a, b) => (b.values?.[sortBy] ?? 0) - (a.values?.[sortBy] ?? 0),
  );

  $: width = containerWidth || fallbackWidth;
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = barGroupsExtent(grouped.length, groupHeight);
  $: height = margin.top + innerHeight + margin.bottom;
  $: maxValue =
    d3.max(grouped, (row) => d3.max(sexes, (sex) => row.values?.[sex] ?? 0)) ??
    0;
  $: xDomainMax = maxValue > 0 ? maxValue : 1;
  $: axisTicks = d3.ticks(0, xDomainMax, 3);

  $: x = d3
    .scaleLinear()
    .domain([0, xDomainMax])
    .range([margin.left, margin.left + innerWidth])
    .nice();

  $: y = d3
    .scaleBand()
    .domain(grouped.map((d) => d.regio))
    .range([margin.top, margin.top + innerHeight])
    .padding(BAR_GROUP_PADDING);

  $: innerBand = d3
    .scaleBand()
    .domain(sexes)
    .range([0, y.bandwidth()])
    .paddingInner(0);

  $: chartRows = grouped.map((row) => ({
    ...row,
    y: y(row.regio) ?? margin.top,
    labelLines: splitLabel(row.regio),
    sexValues: sexes.map((sex) => {
      const value = row.values?.[sex];
      const barY = getBarY(innerBand, sex);
      const barHeight = getBarHeight(innerBand, sex);
      const barWidth = value === undefined ? 0 : Math.max(0, x(value) - x(0));

      return {
        sex,
        value,
        barY,
        barHeight,
        barWidth,
        labelX: x(value ?? 0) + 6,
        labelY: barY + barHeight / 2 + 4,
        showLabel:
          value !== 0 &&
          value !== null &&
          value !== undefined &&
          !Number.isNaN(value),
      };
    }),
  }));

  $: hasMeanValue =
    meanValue !== undefined && meanValue !== null && !Number.isNaN(meanValue);
  $: meanX = hasMeanValue ? x(meanValue) : null;
</script>

<div class="text-[#22333b] flex flex-col gap-2 items-center">
  <div class="sort-row flex gap-2 w-full max-w-[1100px] justify-start">
    {#each sortOptions as option}
      <button
        type="button"
        class={`border border-[#b9b8bb] px-1.5 py-1 rounded-none text-[10px] font-medium cursor-pointer
              transition-opacity duration-150 shadow-none whitespace-nowrap
              ${
                sortBy === option
                  ? `${option === "Home" ? "bg-[#26AAAA]" : "bg-[#754480]"} text-white opacity-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)]`
                  : "bg-white text-[#b9b8bb] opacity-80"
              }`}
        on:click={() => handleSort(option)}
      >
        {option === "Dona" ? "ORDENAT PER DONES" : "ORDENAT PER HOMES"}
      </button>
    {/each}
  </div>

  <div bind:clientWidth={containerWidth} class="w-full">
    <svg
      class="block w-full h-auto"
      viewBox={`0 0 ${width} ${height}`}
      {width}
      {height}
      preserveAspectRatio="xMidYMid meet"
      aria-label="Horizontal bar chart by region"
    >
      {#if chartRows.length > 0}
        {#each axisTicks as tick}
          <g transform={`translate(${x(tick)}, ${margin.top + innerHeight})`}>
            <text
              x="0"
              y="16"
              text-anchor="middle"
              font-size={width < 300 ? 8 : 9}
              fill="#8B898E"
            >
              {tick}%
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

        {#if hasMeanValue}
          <line
            x1={meanX}
            x2={meanX}
            y1={margin.top}
            y2={margin.top + innerHeight - 18}
            stroke="#EA4D50"
            stroke-opacity="0.4"
            stroke-width="1"
          />

          <text
            x={meanX}
            y={margin.top - 8}
            text-anchor="middle"
            font-size="10"
            fill="#333333"
          >
            CATALUNYA
          </text>
        {/if}

        {#each chartRows as row}
          <g transform={`translate(0, ${row.y})`}>
            <text
              x={margin.left - 10}
              y={y.bandwidth() / 2}
              text-anchor="end"
              dominant-baseline="middle"
              font-size={width < 300 ? 8 : 9}
              fill="#3F3F46"
            >
              {#each row.labelLines as line, index}
                <tspan x={margin.left - 10} dy={index === 0 ? 0 : 13}
                  >{line}</tspan
                >
              {/each}
            </text>

            {#each row.sexValues as sexValue}
              <rect
                x={x(0)}
                y={sexValue.barY}
                width={sexValue.barWidth}
                height={sexValue.barHeight}
                fill={getColor(sexValue.sex)}
              />

              <!-- // fill={getColorLabel(sexValue.sex)} -->

              {#if sexValue.showLabel}
                <text
                  x={sexValue.labelX}
                  y={sexValue.labelY}
                  text-anchor="start"
                  font-size={width < 300 ? 8 : 9}
                  font-weight="400"
                  fill="#4C4F51"
                >
                  {fmtPct(sexValue.value)}
                </text>
              {/if}
            {/each}
          </g>
        {/each}
      {/if}
    </svg>
  </div>
</div>
