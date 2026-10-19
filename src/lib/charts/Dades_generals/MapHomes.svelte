<script>
  import { onMount, onDestroy } from "svelte";
  import * as d3 from "d3";
  import { dataStore } from "$lib/stores/stores";

  // Palette and filters can be overridden by the parent.
  const HOMES_PALETTE = {
    colors: ["#F4F7F7", "#DAE5E6", "#BFD4D5", "#A5C2C5", "#8AB1B4", "#709FA3"],
    label: "Més <br> del 90\u00a0%",
  };
  export let colorPalette = HOMES_PALETTE;
  export let filters = {
    edat: "Tots",
    estudis: "Tots",
    classe: "Tots",
    sexe: "Home",
  };
  export let dataRaw = [];

  // Tooltip info and map state.
  let container;
  let tooltipVisible = false;
  // A value of 0 in the CSV means missing data, not a real zero.
  const MISSING_COLOR = "#E8EDF2";
  const MISSING_STROKE = "#A8B6C4";
  let tooltipData = { value: "", name: "", color: MISSING_COLOR };
  let tooltipX = 0;
  let tooltipY = 0;

  let mapData = null;
  let regionValues = new Map();
  let colorScale = d3
    .scaleLinear()
    .range([
      colorPalette.colors[0],
      colorPalette.colors[colorPalette.colors.length - 1],
    ]);
  let width = 300;
  let height = 300;
  let resizeObserver;

  // Format numbers like 12,3%.
  // Beginner note: `fmtValue` is a function; it groups logic you can call later.
  const fmtValue = (value) =>
    value === undefined || value === null || Number.isNaN(+value)
      ? ""
      : `${d3.format(".1f")(+value).replace(".", ",")}\u00a0%`;

  // Try different property names to find the region name.
  // Beginner note: `getRegionName` is a function; it groups logic you can call later.
  const getRegionName = (props = {}) =>
    props.NOMCOMAR ||
    props.NOMCOMARCA ||
    props.nom ||
    props.name ||
    "Comarca desconeguda";

  // Find the value for a region from the map properties.
  // Beginner note: `getRegionValue` is a function; it groups logic you can call later.
  const getRegionValue = (props = {}) => {
    const candidates = [
      props.nom,
      props.NOMCOMAR,
      props.NOMCOMARCA,
      props.name,
    ];
    for (const candidate of candidates) {
      if (!candidate) continue;
      const key = String(candidate).trim();
      if (regionValues.has(key)) return regionValues.get(key);
    }
    return undefined;
  };

  // Beginner note: `prepareData` is a function; it groups logic you can call later.

  function prepareData(geo, csv) {
    // Build the value map and color scale from the data.
    mapData = geo;

    const rows = csv.filter(
      (d) =>
        d.Regio !== "Tots" &&
        d.Edat === filters.edat &&
        d.Estudis === filters.estudis &&
        d.Classe === filters.classe &&
        d.Sexe === filters.sexe &&
        d.Origen === "Tots" &&
        d.Indicador !== null &&
        d.Indicador !== undefined &&
        d.Indicador !== "" &&
        d.Any === 2025,
    );

    regionValues = new Map(rows.map((d) => [d.Regio.trim(), +d.Indicador]));

    // Zeros render as "no data" gray, so keep them out of the color domain.
    const values = Array.from(regionValues.values()).filter((v) => v > 0);
    let [min, max] = values.length ? d3.extent(values) : [0, 100];

    if (min === max) {
      min = min - 1;
      max = max + 1;
    }

    colorScale.domain([min ?? 0, max ?? 100]).clamp(true);
  }

  // Beginner note: `updateTooltipPosition` is a function; it groups logic you can call later.

  const updateTooltipPosition = (event) => {
    // Keep the tooltip near the mouse.
    if (!container) return;
    const [x, y] = d3.pointer(event, container);
    tooltipX = x;
    tooltipY = y - 12;
  };

  // Beginner note: `draw` is a function; it groups logic you can call later.

  function draw() {
    // Draw the map SVG.
    if (!container || !mapData) return;

    d3.select(container).selectAll("svg").remove();

    const regions = mapData.features ?? mapData.geometries ?? [];

    const rect = container.getBoundingClientRect();
    width = rect.width || 800;
    // For aspect-[4/3] containers, height should be width * (3/4), but also ensure minimum height
    const calculatedHeight = width * 0.75;
    height = Math.max(rect.height || calculatedHeight, 250);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("class", "catalonia-map")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g");

    const projection = d3.geoMercator().fitSize([width, height], mapData);
    const path = d3.geoPath().projection(projection);

    // Draw each region as a path.
    g.selectAll("path")
      .data(regions)
      .join("path")
      .attr("d", path)
      .attr("class", "region-path")
      .attr("fill", (d) => {
        const value = getRegionValue(d.properties);
        return value === undefined || value === 0
          ? MISSING_COLOR
          : colorScale(value);
      })
      .attr("stroke", (d) => {
        const value = getRegionValue(d.properties);
        return value === undefined || value === 0 ? MISSING_STROKE : "white";
      })
      .attr("stroke-width", 0.5)
      .on("mouseenter", (event, d) => {
        // Show tooltip on hover.
        d3.select(event.currentTarget).attr("stroke-width", 1.5);

        const props = d.properties || {};
        const name = getRegionName(props);
        const value = getRegionValue(props);

        const isMissing = value === undefined || value === 0;
        tooltipData = {
          value: isMissing ? "Sense dades" : fmtValue(value),
          name: name,
          color: isMissing
            ? MISSING_COLOR
            : colorPalette.colors[colorPalette.colors.length - 1],
        };
        tooltipVisible = true;
        updateTooltipPosition(event);
      })
      .on("mousemove", (event) => {
        // Move tooltip as the mouse moves.
        updateTooltipPosition(event);
      })
      .on("mouseleave", (event) => {
        // Hide tooltip when leaving.
        d3.select(event.currentTarget).attr("stroke-width", 0.5);
        tooltipVisible = false;
      });

    // Keep missing-data regions on top so their outline is not overdrawn.
    g.selectAll("path.region-path")
      .filter((d) => {
        const value = getRegionValue(d.properties);
        return value === undefined || value === 0;
      })
      .raise();
  }

  onMount(() => {
    // Load data from store or use prop.
    const csvData = dataRaw.length > 0 ? dataRaw : $dataStore?.dataRaw;
    const geo = $dataStore?.regionsGeoJson;
    prepareData(geo, csvData);
    draw();

    // Redraw when the container size changes.
    resizeObserver = new ResizeObserver(() => {
      draw();
    });

    if (container && resizeObserver) {
      resizeObserver.observe(container);
    }
  });

  onDestroy(() => {
    // Stop listening for size changes.
    if (resizeObserver && container) {
      resizeObserver.unobserve(container);
    }
  });
</script>

<!-- Map container and tooltip. -->
<div class="relative w-full xl:h-full mx-auto px-2 sm:px-4 md:px-6">
  <div
    bind:this={container}
    class="relative w-full xl:h-full aspect-[4/3] min-h-[200px]"
  ></div>

  <!-- Tooltip -->
  {#if tooltipVisible}
    <div
      class="absolute bg-white/90 shadow-lg rounded-lg border border-gray-200 px-4 py-3 max-w-xs pointer-events-none z-50 transition-opacity duration-200"
      style="transform: translate(calc({tooltipX}px - 50%), calc({tooltipY}px - 100%)); left: 0; top: 0;"
    >
      {#if tooltipData.value}
        <div
          class="text-center font-inter text-[10px] font-bold leading-normal"
          style="color: {tooltipData.color}"
        >
          {tooltipData.value}
        </div>
      {/if}
      <div
        class="text-[#616161] text-center font-inter text-[10px] font-medium leading-normal"
      >
        {tooltipData.name}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.catalonia-map) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  :global(.region-path) {
    /* Regions aren't clickable, so no pointer hand — it would cover the tooltip. */
    cursor: default;
    transition:
      fill 0.2s ease,
      stroke-width 0.2s ease;
  }

  :global(.region-path:hover) {
    opacity: 0.9;
  }
</style>
