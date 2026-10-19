<script>
  // Shared three-layer header (title, legend, big number) shown above the
  // section tabs so switching views never shifts the layout.
  import Legend from "$lib/charts/Legend.svelte";
  import { fmtPct } from "./chartHelpers";

  export let value = undefined;
  export let showTotal = true;
  export let showTotalCategoria = true;
  export let valueColor = "#EA4D50";
  export let showInfoIcon = true;
  export let compact = false;
  export let showValue = true;
  // Name of the indicator the value belongs to ("% de persones de 15 anys i més
  // amb ansietat lleu"). By default it is written next to the value, on the
  // same line, so the two read as one sentence; with `indicatorBelow` it goes
  // under the value.
  export let indicatorName = undefined;
  export let indicatorBelow = false;

  $: hasValue = value !== undefined && value !== null && value !== "";
  $: isNumeric = hasValue && !Number.isNaN(+value);
</script>

<div class="flex flex-col">
  <h3 class="text-[#1B4853] text-sm font-bold flex justify-center mt-1">
    DADES 2021-2025
  </h3>
  <div class="flex flex-wrap justify-center gap-1 md:gap-5">
    <Legend
      {showTotal}
      {showTotalCategoria}
      infoText={showInfoIcon
        ? "Els resultats estan ponderats seguint la metodologia de l’Enquesta de Salut de Catalunya"
        : ""}
    />
  </div>
  <div
    class="flex flex-col items-center {!showValue
      ? 'mt-0 mb-0 min-h-0'
      : compact
        ? 'mt-0 mb-0 min-h-[48px]'
        : 'mt-1 mb-1 min-h-[65px]'}"
  >
    {#if hasValue && showValue}
      <!-- The name stays on one line beside the value while both fit; when
           they don't (narrow screen, or the long "no data" message in place of
           the value) it goes under the value, centred, still in one piece. -->
      <div
        class="flex px-4 text-center {indicatorBelow
          ? 'flex-col items-center'
          : 'flex-wrap items-baseline justify-center gap-x-2'}"
      >
        <span
          style="color: {valueColor}"
          class="font-semibold leading-tight {isNumeric
            ? 'text-4xl'
            : 'text-2xl py-1'}"
        >
          {isNumeric ? fmtPct(value) : value}
        </span>
        {#if indicatorName}
          <span
            class="font-['Inter',sans-serif] text-[12px] md:text-[14px] font-medium leading-snug text-[#2E3A59]"
          >
            {indicatorName}
          </span>
        {/if}
      </div>
    {/if}
  </div>
</div>
