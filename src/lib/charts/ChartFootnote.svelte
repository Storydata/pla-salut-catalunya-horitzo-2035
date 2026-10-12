<script>
  import { fmtPct } from "./chartHelpers";

  // Shared source note rendered under every top-button view (Dades generals,
  // Filtra per perfil, Comparar eixos). Kept as one instance in
  // ExplorarIndicadors so the text can never drift between views.

  // Marge d'error: column E in the raw data, renamed Tasa when processed.
  // A single value for the views that show one figure; pass margeMax too and
  // the line renders as a range (the line chart, across its drawn series).
  // 0 means missing here just as it does for Indicador, so the line hides.
  export let marge = null;
  export let margeMax = null;
  export let font = "Generalitat de Catalunya, Departament de Salut.";

  const hasValue = (v) => v !== null && v !== undefined && v !== "" && +v > 0;

  $: showMarge = hasValue(marge);
  $: showRange = showMarge && hasValue(margeMax) && +margeMax !== +marge;
</script>

<div class="font-inter text-left text-[11px] font-normal leading-snug text-[#828898]">
  {#if showMarge}
    <p>
      Marge d&rsquo;error: {fmtPct(marge)}{#if showRange} - {fmtPct(
          margeMax,
        )}{/if}.
    </p>
  {/if}
  <p>Font: {font}</p>
</div>
