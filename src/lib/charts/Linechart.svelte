<script>
  import * as d3 from "d3";
  import {
    filterSelectClasses,
    fmtPct,
    getLineColor,
    getLineLabelColor,
    lineChartButtonClasses,
    lineChartSvgColors,
  } from "./chartHelpers";
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { compararMargeStore } from "$lib/stores/stores";

  export let dataRaw = [];

  const parseDate = d3.timeParse("%Y");
  const formatDate = d3.timeFormat("%Y");

  const fallbackWidth = 750;
  const height = 350;

  const filterOptions = [
    { key: "Tots", label: "Tots" },
    { key: "Edat", label: "Edat" },
    { key: "ClasseSocial", label: "Classe social" },
    { key: "Estudis", label: "Nivell estudis" },
  ];

  let sexeFilter = "Tots";
  let activeFilterType = "Tots";
  let showDifferences = true;
  let containerWidth = 0;

  function prepareData(rows, filterType, sexe) {
    let filtered = rows.filter(
      (d) =>
        d.Regio === "Catalunya" &&
        d.Origen === "Tots" &&
        d.Indicador !== undefined &&
        d.Indicador !== null &&
        d.Indicador !== "",
    );

    const hasSpecificAgeGroups = filtered.some(
      (d) => d.Estudis === "Tots" && d.Classe === "Tots" && d.Edat !== "Tots",
    );

    if (filterType === "Edat") {
      filtered = filtered.filter(
        (d) => d.Estudis === "Tots" && d.Classe === "Tots",
      );
    } else if (filterType === "ClasseSocial") {
      filtered = filtered.filter(
        (d) => d.Edat === "Tots" && d.Estudis === "Tots",
      );
    } else if (filterType === "Estudis") {
      filtered = filtered.filter(
        (d) => d.Edat === "Tots" && d.Classe === "Tots",
      );
    } else {
      filtered = filtered.filter(
        (d) => d.Edat === "Tots" && d.Classe === "Tots" && d.Estudis === "Tots",
      );
    }

    const useSexAsAgeFallback = filterType === "Edat" && !hasSpecificAgeGroups;

    if (filterType !== "Tots" && !useSexAsAgeFallback && sexe === "Tots") {
      filtered = filtered.filter((d) => d.Sexe === "Tots");
    } else if (sexe !== "Tots") {
      filtered = filtered.filter((d) => d.Sexe === sexe);
    }

    let groupByField = "Edat";
    if (filterType === "ClasseSocial") groupByField = "Classe";
    else if (filterType === "Estudis") groupByField = "Estudis";
    else if (filterType === "Tots" || useSexAsAgeFallback)
      groupByField = "Sexe";

    const grouped = d3.group(filtered, (d) => parseDate(d.Any));
    const years = Array.from(grouped.keys()).sort((a, b) => a - b);

    const yearData = years.map((year) => ({
      year,
      values: Object.fromEntries(
        grouped.get(year).map((d) => [d[groupByField], +d.Indicador]),
      ),
    }));

    // Marge d'error across the lines actually drawn, for the latest year the
    // filtered rows cover. Indicador and Tasa are both 0 when missing, so
    // those rows drop out instead of pulling the range down to zero.
    const drawn = filtered.filter((d) => +d.Indicador > 0 && +d.Tasa > 0);
    const latestYear = d3.max(drawn, (d) => +d.Any);
    const marges = drawn
      .filter((d) => +d.Any === latestYear)
      .map((d) => +d.Tasa);
    const margeRange = marges.length
      ? { min: Math.min(...marges), max: Math.max(...marges) }
      : null;

    return { yearData, groupByField, margeRange };
  }

  function fmtDiff(diff) {
    const sign = diff > 0 ? "+" : "";
    return sign + diff.toFixed(1);
  }

  function calculateYearDifferences(points) {
    const diffs = [];
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      diffs.push({
        currentYear: current.year,
        nextYear: next.year,
        value: current.value,
        nextValue: next.value,
        difference: next.value - current.value,
      });
    }
    return diffs;
  }

  $: ({ yearData, groupByField, margeRange } = prepareData(
    dataRaw,
    activeFilterType,
    sexeFilter,
  ));

  // The shared footnote lives in the parent, so hand it the range from here.
  $: compararMargeStore.set(margeRange);

  $: categories = Array.from(
    new Set(yearData.flatMap((d) => Object.keys(d.values))),
  );

  $: width = containerWidth || fallbackWidth;
  $: margin = {
    top: width < 500 ? 20 : 40,
    // Room, right of the lines, for the value and the name of each category.
    right: width < 500 ? 64 : 100,
    bottom: width < 500 ? 20 : 40,
    left: width < 500 ? 50 : 100,
  };
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;
  $: isSmall = width < 600;

  // Room, inside the plot, for the column of values left of the first points
  // and for the values and names right of the last ones.
  $: xInset = isSmall ? 32 : 40;
  $: leaderLength = isSmall ? 8 : 10;
  // Width kept for a value ("12,3") before the name of its category.
  $: valueSlot = isSmall ? 24 : 30;

  $: x = d3
    .scaleTime()
    .domain(d3.extent(yearData, (d) => d.year))
    .range([margin.left + xInset, margin.left + innerWidth - xInset]);

  $: allValues = yearData.flatMap((d) => Object.values(d.values));
  $: maxYValue = allValues.length > 0 ? Math.max(...allValues) : 100;

  $: y = d3
    .scaleLinear()
    .domain([0, maxYValue])
    .range([margin.top + innerHeight, margin.top])
    .nice();

  $: yTicks = d3.ticks(0, y.domain()[1], 3);

  $: linePath = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.value));

  $: series = categories.map((name) => {
    const points = yearData
      .map((d) => ({ year: d.year, value: d.values[name] }))
      .filter(
        (p) =>
          p.value !== undefined &&
          p.value !== null &&
          !Number.isNaN(p.value) &&
          p.value !== 0,
      );

    return {
      name,
      color: getLineColor(
        name,
        sexeFilter,
        activeFilterType,
        groupByField,
        categories,
      ),
      path: linePath(points),
      points,
      last: points[points.length - 1],
      diffs: calculateYearDifferences(points),
    };
  });

  $: lineWidth = width < 480 ? 1.5 : 2;

  // Spreads labels, already sorted by `y`, so that none is closer than
  // `minGap` to the next one, moving each as little as possible: a crowd of
  // labels opens up around where they wanted to be instead of piling downwards.
  // (Pool-adjacent-violators on y - i * minGap.)
  function spreadApart(labels, minGap) {
    const blocks = [];
    labels.forEach((label, i) => {
      blocks.push({ sum: label.y - i * minGap, count: 1 });
      while (blocks.length > 1) {
        const last = blocks[blocks.length - 1];
        const previous = blocks[blocks.length - 2];
        if (previous.sum / previous.count <= last.sum / last.count) break;
        previous.sum += last.sum;
        previous.count += last.count;
        blocks.pop();
      }
    });

    const spread = [];
    blocks.forEach((block) => {
      for (let k = 0; k < block.count; k++) {
        const i = spread.length;
        spread.push({ ...labels[i], y: block.sum / block.count + i * minGap });
      }
    });
    return spread;
  }

  $: labelGap = isSmall ? 12 : 14;

  // Values of the first and of the last point of every line: they sit in a
  // column away from the lines, spread apart so they never overlap, and a
  // thin grey leader joins each one to its point. The name of the category
  // goes right after the value of the last point.
  function endpointLabels(series, x, y, minGap, pointOf) {
    return spreadApart(
      series
        .filter((s) => pointOf(s))
        .map((s) => {
          const point = pointOf(s);
          const pointY = y(point.value);
          return {
            name: s.name,
            color: getLineLabelColor(s.color),
            value: point.value,
            pointX: x(point.year),
            pointY,
            y: pointY,
          };
        })
        .sort((a, b) => a.y - b.y),
      minGap,
    );
  }

  $: firstLabels = endpointLabels(series, x, y, labelGap, (s) =>
    s.points.length > 1 ? s.points[0] : null,
  );
  $: lastLabels = endpointLabels(series, x, y, labelGap, (s) => s.last);

  // Differences between consecutive years, spread apart per pair of years.
  $: diffLabels = Array.from(
    d3.group(
      series.flatMap((s) =>
        s.diffs.map((diff) => ({
          key: `${s.name}-${+diff.currentYear}`,
          pair: +diff.currentYear,
          diff,
          x: (x(diff.currentYear) + x(diff.nextYear)) / 2,
          y: (y(diff.value) + y(diff.nextValue)) / 2 - 5,
        })),
      ),
      (label) => label.pair,
    ).values(),
  ).flatMap((labels) =>
    spreadApart(
      labels.sort((a, b) => a.y - b.y),
      labelGap,
    ),
  );
</script>

<div class="flex flex-col gap-4 items-center w-full">
  <div class="flex flex-wrap gap-2 md:gap-9 items-center justify-center p-4">
    <select
      id="filter-sexe"
      aria-label="Sexe"
      bind:value={sexeFilter}
      class={`flex-1 sm:flex-none min-w-[140px] ${
        sexeFilter !== "Tots"
          ? filterSelectClasses.active
          : filterSelectClasses.inactive
      }`}
    >
      {#each ["Dona", "Home", "Tots"] as option}
        <option value={option}>
          {option === "Tots" ? "Sexe: Tots" : option}
        </option>
      {/each}
    </select>

    <ButtonGroup
      class="*:ring-primary-700! gap-2 flex flex-wrap justify-center shadow-none"
    >
      {#each filterOptions as option}
        <Button
          class={`px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-lg
            ${activeFilterType === option.key ? lineChartButtonClasses.active : lineChartButtonClasses.inactive}`}
          on:click={() => (activeFilterType = option.key)}
        >
          {option.label}
        </Button>
      {/each}
    </ButtonGroup>

    <button
      id="toggle-differences"
      on:click={() => (showDifferences = !showDifferences)}
      class={`px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-lg min-w-[10.5rem] text-center
        ${showDifferences ? lineChartButtonClasses.active : lineChartButtonClasses.inactive}`}
    >
      {showDifferences ? "Amaga diferències" : "Mostra diferències"}
    </button>
  </div>

  <div bind:clientWidth={containerWidth} class="w-full max-w-[750px]">
    <svg
      class="block w-full h-auto"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label="Gràfic de línies de l'indicador per any"
    >
      {#if yearData.length > 0}
        {#each yearData as d}
          <line
            x1={x(d.year)}
            x2={x(d.year)}
            y1={margin.top}
            y2={margin.top + innerHeight}
            stroke={lineChartSvgColors.gridStroke}
            stroke-width="0.5"
            stroke-opacity="0.7"
          />
          <text
            x={x(d.year)}
            y={margin.top + innerHeight + (isSmall ? 14 : 24)}
            text-anchor="middle"
            font-size={isSmall ? 9 : 14}
            fill={lineChartSvgColors.textFill}
          >
            {formatDate(d.year)}
          </text>
        {/each}

        <line
          x1={margin.left}
          x2={margin.left + innerWidth}
          y1={height - margin.bottom}
          y2={height - margin.bottom}
          stroke={lineChartSvgColors.axisStroke}
          stroke-width="1"
        />

        {#each yTicks as tick}
          <text
            x={margin.left - 8}
            y={y(tick)}
            text-anchor="end"
            dominant-baseline="middle"
            font-size={isSmall ? 9 : 12}
            fill={lineChartSvgColors.textFill}
          >
            {tick}%
          </text>
        {/each}

        {#each series as s (s.name)}
          <path
            d={s.path}
            stroke={lineChartSvgColors.labelBackground}
            stroke-width={lineWidth + 3}
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
          <path
            d={s.path}
            stroke={s.color}
            stroke-width={lineWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        {/each}

        {#each firstLabels as label (label.name)}
          <line
            x1={label.pointX}
            y1={label.pointY}
            x2={label.pointX - leaderLength}
            y2={label.y}
            stroke={lineChartSvgColors.leaderStroke}
            stroke-width="0.75"
          />
          <text
            class="halo"
            x={label.pointX - leaderLength - 2}
            y={label.y}
            text-anchor="end"
            dominant-baseline="middle"
            fill={lineChartSvgColors.textFill}
            font-size={isSmall ? 10 : 12}
          >
            {fmtPct(label.value)}
          </text>
        {/each}

        {#each lastLabels as label (label.name)}
          <line
            x1={label.pointX}
            y1={label.pointY}
            x2={label.pointX + leaderLength}
            y2={label.y}
            stroke={lineChartSvgColors.leaderStroke}
            stroke-width="0.75"
          />
          <text
            class="halo"
            x={label.pointX + leaderLength + 2}
            y={label.y}
            text-anchor="start"
            dominant-baseline="middle"
            fill={lineChartSvgColors.textFill}
            font-size={isSmall ? 10 : 12}
          >
            {fmtPct(label.value)}
          </text>
          <text
            class="halo"
            x={label.pointX + leaderLength + 2 + valueSlot}
            y={label.y}
            text-anchor="start"
            dominant-baseline="middle"
            font-size={isSmall ? 10 : 12}
            font-weight="600"
            fill={label.color}
          >
            {label.name}
          </text>
        {/each}

        {#if showDifferences}
          {#each diffLabels as label (label.key)}
            <text
              class="halo"
              x={label.x}
              y={label.y}
              text-anchor="middle"
              fill={label.diff.difference > 0
                ? lineChartSvgColors.differencePositive
                : label.diff.difference < 0
                  ? lineChartSvgColors.differenceNegative
                  : lineChartSvgColors.differenceNeutral}
              font-size={isSmall ? 10 : 12}
              font-weight="500"
            >
              {fmtDiff(label.diff.difference)}
            </text>
          {/each}
        {/if}
      {/if}
    </svg>
  </div>
</div>

<style>
  text.halo {
    paint-order: stroke;
    stroke: white;
    stroke-width: 3px;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>
