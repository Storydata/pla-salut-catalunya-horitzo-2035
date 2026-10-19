<script>
  import * as d3 from "d3";
  import {
    BAR_GROUP_PADDING,
    barGroupsExtent,
    displayLabel,
    fmtPct,
    getColor,
    getColorLabel,
    sexes as sexOrder,
  } from "../chartHelpers";

  export let title = "";
  export let rows = [];
  export let groupField = "";
  export let labelField = "";

  const margin = { top: 0, right: 40, bottom: 20, left: 80 };
  const fallbackWidth = 320;
  // Height of one group of bars (its Tots/Dona/Home bars stacked), in px.
  const groupHeight = 35;

  let containerWidth = 0;

  function getBarHeight(yScale, sex) {
    return yScale.bandwidth() * (sex === "Tots" ? 0.6 : 1);
  }

  function getBarY(yScale, sex) {
    const bandY = yScale(sex) ?? 0;
    const barHeight = getBarHeight(yScale, sex);

    return sex === "Tots"
      ? bandY + (yScale.bandwidth() - barHeight) / 2
      : bandY;
  }

  $: groups = Array.from(new Set(rows.map((row) => row[groupField])));
  $: sexes = Array.from(new Set(rows.map((row) => row.Sexe)));
  $: orderedSexes = sexOrder
    .filter((sex) => sexes.includes(sex))
    .concat(sexes.filter((sex) => !sexOrder.includes(sex)));

  $: width = containerWidth || fallbackWidth;
  $: groupsExtent = barGroupsExtent(groups.length, groupHeight);
  $: height = margin.top + groupsExtent + margin.bottom;
  $: maxValue = d3.max(rows, (row) => +row.Indicador) ?? 0;
  $: xDomainMax = maxValue > 0 ? maxValue : 1;
  $: axisTicks = d3.ticks(0, xDomainMax, 3);

  $: xScale = d3
    .scaleLinear()
    .domain([0, xDomainMax])
    .range([margin.left, width - margin.right])
    .nice();

  $: facetScale = d3
    .scaleBand()
    .domain(groups)
    .range([margin.top, margin.top + groupsExtent])
    .padding(BAR_GROUP_PADDING);

  $: yScale = d3
    .scaleBand()
    .domain(orderedSexes)
    .range([0, facetScale.bandwidth()])
    .paddingInner(0);

  $: facetRows = groups.map((group) => {
    const groupRows = rows.filter((row) => row[groupField] === group);

    return {
      group,
      label: displayLabel((labelField && groupRows[0]?.[labelField]) || group),
      y: facetScale(group) ?? margin.top,
      labelY: facetScale.bandwidth() / 2,
      bars: groupRows
        .map((row) => {
          const value = +row.Indicador;
          const barY = getBarY(yScale, row.Sexe);
          const barHeight = getBarHeight(yScale, row.Sexe);

          return {
            key: `${group}-${row.Sexe}`,
            sex: row.Sexe,
            value,
            barY,
            barHeight,
            barWidth: Math.max(0, xScale(value) - xScale(0)),
            labelX: xScale(value) + 4,
            labelY: (yScale(row.Sexe) ?? 0) + yScale.bandwidth() / 2,
            showLabel:
              value !== 0 &&
              row.Indicador !== null &&
              row.Indicador !== undefined &&
              !Number.isNaN(value),
          };
        })
        .sort(
          (a, b) =>
            (orderedSexes.indexOf(a.sex) === -1
              ? 999
              : orderedSexes.indexOf(a.sex)) -
            (orderedSexes.indexOf(b.sex) === -1
              ? 999
              : orderedSexes.indexOf(b.sex)),
        ),
    };
  });
</script>

<div
  class="chart-wrapper flex-[1_1_100%] md:flex-[0_1_calc(50%-0.75rem)] lg:flex-1 items-center"
>
  <div
    bind:clientWidth={containerWidth}
    class="w-full"
  >
    <svg
      class="block w-full"
      style="height: {height}px"
      viewBox={`0 0 ${width} ${height}`}
      {width}
      {height}
      preserveAspectRatio="xMidYMid meet"
      aria-label={title}
    >
      {#if facetRows.length > 0}
        {#each facetRows as facet}
          <g class="facet" transform={`translate(0, ${facet.y})`}>
            <text
              class="facet-label"
              x={xScale(0) - 10}
              y={facet.labelY}
              dominant-baseline="middle"
              text-anchor="end"
              font-size={width < 300 ? 8 : 9}
              fill="#4C4F51"
            >
              {facet.label}
            </text>

            {#each facet.bars as bar}
              <rect
                x={xScale(0)}
                y={bar.barY}
                width={bar.barWidth}
                height={bar.barHeight}
                fill={getColor(bar.sex)}
              />

              {#if bar.showLabel}
                <text
                  class="indicator-label"
                  x={bar.labelX}
                  y={bar.labelY}
                  dominant-baseline="middle"
                  fill="#8B898E"
                  font-size={width < 300 ? 8 : 9}
                >
                  {fmtPct(bar.value)}
                </text>
              {/if}
            {/each}
          </g>
        {/each}

        <line
          x1={xScale(0)}
          x2={xScale(0)}
          y1={margin.top}
          y2={height - margin.bottom}
          stroke="#B8B2A2"
        />

        <g class="x-axis" transform={`translate(0, ${height - margin.bottom})`}>
          {#each axisTicks as tick}
            <g transform={`translate(${xScale(tick)}, 0)`}>
              <text
                y="16"
                text-anchor="middle"
                font-size={width < 300 ? 8 : 9}
                fill="#8B898E"
              >
                {tick}&nbsp;%
              </text>
            </g>
          {/each}
        </g>
      {/if}
    </svg>
  </div>
</div>
